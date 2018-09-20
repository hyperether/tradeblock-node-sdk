**Tradeblock-node-sdk**
[![npm version](https://badge.fury.io/js/tradeblock-node.png)](https://badge.fury.io/js/tradeblock-node)  [![Build Status](https://travis-ci.org/hyperether/tradeblock-node-sdk?branch=master)](https://travis-ci.org/hyperether/tradeblock-node-sdk) 


This SDK allows you to work with TradeBlock API 

**Node.JS SDK**

Installation
---------------
Installing using npm (node package manager):
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install tradeblock-node
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

## Dependencies

Required Dependencies:
* [request](https://github.com/mikeal/request)

Dev Dependencies (for running tests):
* [nock](https://github.com/flatiron/nock)
* [mocha](http://mochajs.org/)

## Initialisation
        var tradeblock = require('tradeblock-node');
        
        var tradeAPI = tradeblock.init({
            API_KEY: '<your AUTH KEY>', 
            API_SECRET: '<your AUTH SECRET>'
        });
        
## Usage

        const response = await tradeAPI.listTrades()
        
## Tests
To run tests:
`npm test`
or
`mocha --reporter spec`

## License
-------
*tradeblock-node* is licensed under the MIT License.
