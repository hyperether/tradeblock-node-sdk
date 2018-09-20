const assert  = require('assert');
const nock    = require('nock');
const tradeblock = require('../lib/tradeblock');

const userData = {
  "company": "",
  "email": "test@test.com",
  "name": "Dorian Nakamoto",
  "id": "cXft2ZYgTNA9yVwGzobn3m"
}

describe('TradeBlock SDK Tests', function() {
  describe('Initialisation Tests', function() {
    it('init - fail - config is not provided.', function() {
      assert.throws(
        function() {
          const r = tradeblock.init();
        }
      );
    });

    it('init - fail - config is not an object.', function() {
      assert.throws(
        function() {
          const r = tradeblock.init();
        }
      );
    });

    it('init - fail - config provided without authId and authSecret', function() {
      assert.throws(
        function() {
          const r = tradeblock.init({});
        }
      );
    });

    it('init - fail - config provided without authId', function() {
      assert.throws(
        function() {
          const r = tradeblock.init({API_SECRET: '123'});
        }
      );
    });

    it('init - fail - config provided without authSecret', function() {
      assert.throws(
        function() {
          const r = tradeblock.init({API_KEY: '123'});
        }
      );
    });

    it('init - success - initialise and returns tradeblock SDK when proper config is provided.', function() {
      assert.equal('object', typeof tradeblock.init({API_KEY: '123', API_SECRET: '123'}));
    });
  });

  describe('API Tests', function() {
    const tradeAPI = tradeblock.init({API_KEY: '123', API_SECRET: '123'});

    const endpoint = nock(tradeAPI.options.protocol + '://' + tradeAPI.options.host);
    endpoint.get('/user/info')
      .reply(200, JSON.stringify(userData))
      .post('/user/info/cXft2ZYgTNA9yVwGzobn3m', userData)
      .reply(200, JSON.stringify(userData));

    it('API - success - updated user info', async() => {
      const response = await tradeAPI.setUserInfo("cXft2ZYgTNA9yVwGzobn3m", userData)
      assert.equal('object', typeof response);
      assert.equal("cXft2ZYgTNA9yVwGzobn3m", response.id);
    });

    it('API - success - get user info.', async() => {
      const response = await tradeAPI.getUserInfo("cXft2ZYgTNA9yVwGzobn3m")
      assert.equal('object', typeof response);
      assert.equal("cXft2ZYgTNA9yVwGzobn3m", response.id);
    });


  });

});
