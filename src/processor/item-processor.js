'use strict';

var path = require('path');
var Item = require('../item/item');
var ConverionController = require('../conversion/conversion-controller');
var GimpDetector = require('../gimp/gimp-detector');
var GraphicsMagick = require('../graphicsmagick/graphicsmagick');
var ImageMagick = require('../imagemagick/imagemagick');
var ItemState = require('../item/item-state');

/**
 * @class ItemProcessor
 * @constructor
 */
var ItemProcessor = function (task, process, grunt) {
    this._task = task;
    this._grunt = grunt;
    this._process = process;
    this._gimp = new GimpDetector(this._process, this._grunt).createGimp();
    this._imageMagick = new ImageMagick(this._grunt);
    this._graphicsMagick = new GraphicsMagick(this._grunt);
    this._conversionController = new ConverionController(this._grunt, this._gimp, this._imageMagick, this._graphicsMagick);
    this._queue = {};
    this._maxAsync = 5;
};

ItemProcessor.prototype.process = function (queue, callback) {
    this._queue = queue;
    this._callback = callback;
    this.processBatch(this.getBatch());
};

/**
 * @returns {Array}
 */
ItemProcessor.prototype.getBatch = function () {
    return this._queue.splice(0, this._maxAsync);
};

ItemProcessor.prototype.processBatch = function (batch) {
    var root = this;
    this._processingTaskCount = batch.length;
    for (var i = 0, len = batch.length; i < len; ++i) {
        this.processItem(batch[i], function () {
            root.onConversion();
        });
    }
};

ItemProcessor.prototype.onConversion = function () {
    this._processingTaskCount--;
    if (this._processingTaskCount === 0) {
        if (this._queue.length) {
            this.processBatch(this.getBatch());
        } else {
            if (typeof this._callback !== 'undefined') {
                this._callback();
            }
        }
    }
};

ItemProcessor.prototype.processItem = function (item, callback) {
    var grunt = this._grunt;

    if (item.convertedSrc()) {
        item.setConvertedSrc(path.join(global._cacheDir, item.convertedSrc()));
    }
    this._graphicsMagick.resize(item, function () {
        new ItemState().updateItemConfig(item);
        grunt.log.writeln('Created ' + path.basename(item.dest()));
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};

/* global module:false */
module.exports = ItemProcessor;
