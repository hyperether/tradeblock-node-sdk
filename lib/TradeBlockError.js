/*
 TradeBlock error
 */
TradeBlockError = function(msg) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = (msg || '') + '\n';
  this.name    = 'TradeBlock';
}
TradeBlockError.prototype = Error.prototype;

module.exports = TradeBlockError;