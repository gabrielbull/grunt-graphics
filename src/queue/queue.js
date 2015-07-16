'use strict';

var ConfigLoader = require('../config/config-loader');
var ConfigParser = require('../config/config-parser');
var Item = require('../item/item');

/**
 * @class ProcessingQueue
 * @constructor
 */
var ProcessingQueue = function (process, cache) {
    this._process = process;
    this._cache = cache;
};

/**
 * @param {Object} config
 */
ProcessingQueue.prototype.buildQueue = function (config) {
    var itemCollection = this.parseConfig(config);
    itemCollection = this.parseItemCollection(itemCollection);
    return this.generateQueues(itemCollection);
};

/**
 * @param {Object} config
 * @returns {Array.<Object>|number}
 */
ProcessingQueue.prototype.parseConfig = function (config) {
    var configCollection = new ConfigLoader(this._process.cwd(), config).load();
    var itemCollection = new ConfigParser(this._process.cwd(), this._process.env).parse(configCollection);
    for (var i = 0, len = itemCollection.length; i < len; ++i) {
        itemCollection[i] = new Item(itemCollection[i]);
        itemCollection[i].validator().setCache(this._cache);
    }
    return itemCollection;
};

/**
 * @param {Array} itemCollection
 * @returns {Array}
 */
ProcessingQueue.prototype.parseItemCollection = function (itemCollection) {
    var newItemCollection = [];
    for (var i = 0, len = itemCollection.length; i < len; ++i) {
        if (itemCollection[i].isProcessingRequired()) {
            newItemCollection.push(itemCollection[i]);
        }
    }
    return newItemCollection;
};

/**
 * @param {Array} itemCollection
 * @returns {Object}
 */
ProcessingQueue.prototype.generateQueues = function (itemCollection) {
    var conversionQueue = {};
    var itemQueue = [];
    var conversion;
    var item;
    for (var i = 0, len = itemCollection.length; i < len; ++i) {
        item = itemCollection[i];
        conversion = item.conversion();
        if (conversion && item.validator().isSrcNewer()) {
            if (typeof conversionQueue[item.src()] === 'undefined') {
                conversionQueue[item.src()] = item;
            }
        }
        itemQueue.push(item);
    }

    var conversionQueueArray = [];
    for(var prop in conversionQueue) {
        if(conversionQueue.hasOwnProperty(prop)) {
            conversionQueueArray.push(conversionQueue[prop]);
        }
    }


    return {
        conversionQueue: conversionQueueArray,
        itemQueue: itemQueue
    };
};

/* global module:false */
module.exports = ProcessingQueue;
