'use strict';

var Cache = require('./cache/cache');
var ConfigLoader = require('./config/config-loader');
var ConfigParser = require('./config/config-parser');
var Item = require('./item/item');
var ConverionController = require('./conversion-controller');
var GimpDetector = require('./gimp/gimp-detector');
var path = require('path');
var GraphicsMagick = require('./graphicsmagick/graphicsmagick');
var ImageMagick = require('./imagemagick/imagemagick');

/**
 * @class GraphicsController
 * @constructor
 */
var GraphicsController = function (task, process, grunt) {
    this._task = task;
    this._cache = new Cache();
    this._grunt = grunt;
    this._process = process;
    this._gimp = new GimpDetector(this._process, this._cache, this._grunt).createGimp();
    this._imageMagick = new ImageMagick(this._cache, this._grunt);
    this._graphicsMagick = new GraphicsMagick(this._cache, this._grunt);
    this._conversionController = new ConverionController(this._grunt, this._cache, this._gimp, this._imageMagick, this._graphicsMagick);
    this._queue = {};
};

GraphicsController.prototype.process = function (config) {
    var configCollection = new ConfigLoader(this._process.cwd(), config).load();
    var itemCollection = new ConfigParser(this._process.cwd(), this._process.env).parse(configCollection);
    for (var i = 0, len = itemCollection.length; i < len; ++i) {
        itemCollection[i] = new Item(itemCollection[i]);
        itemCollection[i].validator().setCache(this._cache);
    }
    this.processItemCollection(itemCollection);
};

GraphicsController.prototype.processItemCollection = function (itemCollection) {
    var newItemCollection = [];
    for (var i = 0, len = itemCollection.length; i < len; ++i) {
        if (itemCollection[i].isProcessingRequired()) {
            newItemCollection.push(itemCollection[i]);
        }
    }
    itemCollection = newItemCollection;
    newItemCollection = null;

    var item;
    for (i = 0, len = itemCollection.length; i < len; ++i) {
        itemCollection[i].deleteDest();
    }

    var itemsScheduledForConversion = {};
    var remainingItems = [];
    var conversion;
    for (i = 0, len = itemCollection.length; i < len; ++i) {
        item = itemCollection[i];
        conversion = item.conversion();
        if (conversion && item.validator().isSrcNewer()) {
            if (typeof itemsScheduledForConversion[item.src()] === 'undefined') {
                itemsScheduledForConversion[item.src()] = [];
            }
            itemsScheduledForConversion[item.src()].push(item);
        } else {
            remainingItems.push(item);
        }
    }

    this._queue = {
        conversionQueue: itemsScheduledForConversion,
        itemQueue: remainingItems
    };
    this.processQueue();
};

GraphicsController.prototype.processQueue = function () {
    var root = this;
    // Process conversion queue
    for(var prop in this._queue.conversionQueue) {
        if(this._queue.conversionQueue.hasOwnProperty(prop)) {
            this.processConversion(this._queue.conversionQueue[prop], function () {
                root.processQueue();
            });
            delete root._queue.conversionQueue[prop];
            return;
        }
    }

    // Process item queue
    for (var i = 0, len = this._queue.itemQueue.length; i < len; ++i) {
        this.processItem(this._queue.itemQueue[i]);
    }
};

GraphicsController.prototype.processConversion = function (itemCollection, callback) {
    var root = this;
    var task = this._task;
    var cache = this._cache;
    task.start();
    this._conversionController.convert(itemCollection[0], function () {
        cache.updateFileTimestamp(itemCollection[0].src());
        for (var i = 0, len = itemCollection.length; i < len; ++i) {
            root.processItem(itemCollection[i]);
        }
        if (typeof callback !== 'undefined') {
            callback();
        }
        task.end();
    });
};

GraphicsController.prototype.processItem = function (item, callback) {
    var task = this._task;
    var grunt = this._grunt;
    var cache = this._cache;

    item.setConvertedSrc(path.join(this._cache.cacheDir(), item.convertedSrc()));
    task.start();
    this._graphicsMagick.resize(item, function () {
        cache.saveItemConfig(item);
        grunt.log.writeln('Created ' + path.basename(item.dest()));
        if (typeof callback !== 'undefined') {
            callback();
        }
        task.end();
    });
};

/* global module:false */
module.exports = GraphicsController;
