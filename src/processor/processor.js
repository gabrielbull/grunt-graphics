'use strict';

var path = require('path');
var Item = require('../item/item');
var ConverionController = require('../conversion/conversion-controller');
var GimpDetector = require('../gimp/gimp-detector');
var GraphicsMagick = require('../graphicsmagick/graphicsmagick');
var ImageMagick = require('../imagemagick/imagemagick');

/**
 * @class Processor
 * @constructor
 */
var Processor = function (task, process, grunt, cache) {
    this._task = task;
    this._cache = cache;
    this._grunt = grunt;
    this._process = process;
    this._gimp = new GimpDetector(this._process, this._cache, this._grunt).createGimp();
    this._imageMagick = new ImageMagick(this._cache, this._grunt);
    this._graphicsMagick = new GraphicsMagick(this._cache, this._grunt);
    this._conversionController = new ConverionController(this._grunt, this._cache, this._gimp, this._imageMagick, this._graphicsMagick);
    this._queue = {};
};

Processor.prototype.process = function (queue) {
    if (typeof queue !== 'undefined') {
        this._queue = queue;
    }

    var root = this;

    // Process conversion queue
    for(var prop in this._queue.conversionQueue) {
        if(this._queue.conversionQueue.hasOwnProperty(prop)) {
            this.processConversion(this._queue.conversionQueue[prop], function () {
                root.process();
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

Processor.prototype.processConversion = function (itemCollection, callback) {
    var root = this;
    var task = this._task;
    var cache = this._cache;
    task.start();
    this._conversionController.convert(itemCollection[0], function () {
        cache.updateFileTimestamp(itemCollection[0]);
        for (var i = 0, len = itemCollection.length; i < len; ++i) {
            root.processItem(itemCollection[i]);
        }
        if (typeof callback !== 'undefined') {
            callback();
        }
        task.end();
    });
};

Processor.prototype.processItem = function (item, callback) {
    var task = this._task;
    var grunt = this._grunt;
    var cache = this._cache;

    if (item.convertedSrc()) {
        item.setConvertedSrc(path.join(this._cache.cacheDir(), item.convertedSrc()));
    }
    task.start();
    this._graphicsMagick.resize(item, function () {
        cache.saveItemConfig(item);
        cache.updateFileTimestamp(item);
        grunt.log.writeln('Created ' + path.basename(item.dest()));
        if (typeof callback !== 'undefined') {
            callback();
        }
        task.end();
    });
};

/* global module:false */
module.exports = Processor;
