//Get required modules
var util = require('util')
var Request = require('request')
var crypto = require('crypto')
var TradeBlockError = require('./TradeBlockError')

var BITCOIN_SENT = 'BITCOIN_SENT'
var FIAT_SENT = 'FIAT_SENT'
var BITCOIN_RECEIVED = 'BITCOIN_RECEIVED'
var FIAT_RECEIVED = 'FIAT_RECEIVED'

var METHODS = {
  POST: 'post',
  GET: 'get',
  DELETE: 'del',
  PUT: 'put'
};

var TradeBlock = function(config)  {
  this.options = {
    protocol: 'https',
    host: 'tradeblock.com/api/v1.1',
    userAgent: "TradeBlock-Node-SDK"
  };
  if (!config) {
    throw new TradeBlockError('Must provide TradeBlock basic configuration');
  }

  if (typeof config != 'object') {
    throw new TradeBlockError('Config need to be object');
  }

  if (!config.API_KEY || !config.API_SECRET) {
    throw new TradeBlockError('Auth ID and Auth Secret are mandatory');
  }

  // override default config according to the config provided.
  for (var key in config) {
    this.options[key] = config[key];
  }
};

var constrructSignature = function(msg, secret){
  return crypto.createHmac('SHA256', secret).update(msg).digest('hex');
}

/**
 * Prepare headers and Sends a request to TradeBlock API server
 * @param base
 * @param method
 * @param params
 */
TradeBlock.prototype.request = function(base, method, params) {
  var options = this.options;
  return new Promise(function(resolve, reject){
    var uri = options.protocol + '://' + options.host + base;
    var nonce = new Date().getTime();
    var signature = constrructSignature(nonce + uri, options.API_SECRET)

    var headers = {
      'ACCESS-KEY': options.API_KEY,
      'ACCESS-SIGNATURE': signature,
      'ACCESS-NONCE': nonce
    };

    var request_options = {
      uri: uri,
      headers: headers,
      json: true
    };

    switch (method) {
      case 'POST':
      case 'PUT':
        request_options.json = params;
        break;
      case 'GET':
        request_options.qs = params;
        break;
    }

    Request[METHODS[method]](request_options, function(error, response, body){
      if (error) return reject(new TradeBlockError(error));
      resolve(body);
    });
  })
};

//USER APIs
TradeBlock.prototype.getUserInfo = function(){
  var base = '/user/info';
  var method = 'GET';

  return this.request(base, method, {});
};

TradeBlock.prototype.setUserInfo = function(userId, params){
  var base = '/user/info/'+userId;
  var method = 'POST';
  return this.request(base, method, params);
};

TradeBlock.prototype.listCounterparties = function(){
  var base = '/user/counterparties';
  var method = 'GET';

  return this.request(base, method, {});
};

TradeBlock.prototype.setCounterparties = function(params){
  var base = '/user/counterparties';
  var method = 'POST';

  return this.request(base, method, params);
};

//TRADE APIs
TradeBlock.prototype.listTrades = function(params){
  var base = 'trade';
  var method = 'GET';

  return this.request(base, method, params);
};

TradeBlock.prototype.getTrade = function(tradeId){
  var base = '/trade/'+tradeId;
  var method = 'GET';

  return this.request(base, method, {});
};

TradeBlock.prototype.newQuote = function(params){
  var base = '/trade';
  var method = 'POST';

  return this.request(base, method, params);
};

TradeBlock.prototype.counterquote = function(tradeId, params){
  var base = '/trade/'+tradeId;
  var method = 'POST';

  return this.request(base, method, params);
};

TradeBlock.prototype.acceptQuote = function(tradeId){
  var base = '/trade/'+tradeId;
  var method = 'POST';

  return this.request(base, method, {accept: true});
};

TradeBlock.prototype.cancelQuote = function(trades){
  var base = '/trade/cancel';
  var method = 'POST';

  if (!Array.isArray(trades)) trades = [trades];

  return this.request(base, method, {trades: trades.join(',')});
};

TradeBlock.prototype.listQuickTrades = function(assets){
  var base = '/open_trades';
  var method = 'GET';

  if (assets && !Array.isArray(assets)) assets = [assets];

  return this.request(base, method, {assets: assets.join(',')});
};

TradeBlock.prototype.listQuickTradesSmart = function(params){
  var base = '/open_trades/smart';
  var method = 'POST';

  return this.request(base, method, params);
};

TradeBlock.prototype.acceptQuickTrade = function(params){
  var base = '/trade';
  var method = 'POST';

  return this.request(base, method, params);
};

TradeBlock.prototype.provideBitcoinAddress = function(tradeId, params){
  var base = '/trade/'+tradeId;
  var method = 'POST';

  return this.request(base, method, params);
};

TradeBlock.prototype.provideBankAccount = function(tradeId, params){
  var base = '/trade/'+tradeId;
  var method = 'POST';

  return this.request(base, method, params);
};

TradeBlock.prototype.bitcoinSentConfirmation = function(tradeId){
  var base = '/trade/'+tradeId;
  var method = 'POST';

  return this.request(base, method, {action: BITCOIN_SENT});
};

TradeBlock.prototype.fiatSentConfirmation = function(tradeId){
  var base = '/trade/'+tradeId;
  var method = 'POST';

  return this.request(base, method, {action: FIAT_SENT});
};

TradeBlock.prototype.bitcoinReceivedConfirmation = function(tradeId){
  var base = '/trade/'+tradeId;
  var method = 'POST';

  return this.request(base, method, {action: FIAT_RECEIVED});
};

TradeBlock.prototype.fiatReceivedConfirmation = function(tradeId){
  var base = '/trade/'+tradeId;
  var method = 'POST';

  return this.request(base, method, {action: FIAT_RECEIVED});
};

module.exports = {
  init: function(config){
    return new TradeBlock(config);
  }
};
