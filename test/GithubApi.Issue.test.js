const axios = require('axios');
const assert = require('assert');

const username = 'Yimar22';
const repositoryName = 'axios-api-testing-excercise';

describe('Github Api Test', function () {
  let accessToken = '';

  before(async function () {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    accessToken = process.env.ACCESS_TOKEN;
    assert.strictEqual(response.status, 200);
  });

  describe('Issues', function () {
    let issueNumber = '';
    let issueTitle = 'Test Issue Title';
    let issueBody = 'Test Issue Body';

    it('should create an issue with only a title', async function () {
      const url = `https://api.github.com/repos/${username}/${repositoryName}/issues`;
      const response = await axios.post(
        url,
        {
          title: issueTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      assert.strictEqual(response.status, 201);
      issueNumber = response.data.number;
      assert.strictEqual(response.data.title, issueTitle);
      assert.strictEqual(response.data.body, null);
    });

    it('should update an issue with a body', async function () {
      const url = `https://api.github.com/repos/${username}/${repositoryName}/issues/${issueNumber}`;
      const response = await axios.patch(
        url,
        {
          body: issueBody,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.number, issueNumber);
      assert.strictEqual(response.data.title, issueTitle);
      assert.strictEqual(response.data.body, issueBody);
    });

    it('should lock an issue', async function () {
      const url = `https://api.github.com/repos/${username}/${repositoryName}/issues/${issueNumber}/lock`;
      const response = await axios.put(
        url,
        {
          lock_reason: 'resolved',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      assert.strictEqual(response.status, 204);
      assert.strictEqual(response.data.locked, true);
      assert.strictEqual(response.data.active_lock_reason, 'resolved');
    });

    it('should check that an issue is locked', async function () {
      const url = `https://api.github.com/repos/${username}/${repositoryName}/issues/${issueNumber}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.locked, true);
      assert.strictEqual(response.data.active_lock_reason, 'resolved');
    });

    it('should unlock an issue', async function () {
      const url = `https://api.github.com/repos/${username}/${repositoryName}/issues/${issueNumber}/lock`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      assert.strictEqual(response.status, 204);
      assert.strictEqual(response.data.locked, false);
      assert.strictEqual(response.data.active_lock_reason, null);
    });
  });
});
