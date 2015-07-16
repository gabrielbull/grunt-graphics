'use strict';

var path = require('path');
var Item = require('../item/item');
var ConverionController = require('../conversion/conversion-controller');
var GimpDetector = require('../gimp/gimp-detector');
var GraphicsMagick = require('../graphicsmagick/graphicsmagick');
var ImageMagick = require('../imagemagick/imagemagick');

/**
 * @class ConversionProcessor
 * @constructor
 */
var ConversionProcessor = function (task, process, grunt, cache) {
    this._cache = cache;
    this._grunt = grunt;
    this._process = process;
    this._gimp = new GimpDetector(this._process, this._cache, this._grunt).createGimp();
    this._imageMagick = new ImageMagick(this._cache, this._grunt);
    this._graphicsMagick = new GraphicsMagick(this._cache, this._grunt);
    this._conversionController = new ConverionController(this._grunt, this._cache, this._gimp, this._imageMagick, this._graphicsMagick);
    this._processingTaskCount = 0;
    this._maxAsync = 3;
};

/**
 * @param {Array} queue
 * @param {Function} callback
 */
ConversionProcessor.prototype.process = function (queue, callback) {
    this._queue = queue;
    this._callback = callback;
    this.processBatch(this.getBatch());
};

/**
 * @returns {Array}
 */
ConversionProcessor.prototype.getBatch = function () {
    return this._queue.splice(0, this._maxAsync);
};

ConversionProcessor.prototype.processBatch = function (batch) {
    var root = this;
    this._processingTaskCount = batch.length;
    for (var i = 0, len = batch.length; i < len; ++i) {
        this.processConversion(batch[i], function () {
            root.onConversion();
        });
    }
};

ConversionProcessor.prototype.onConversion = function () {
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

ConversionProcessor.prototype.processConversion = function (conversion, callback) {
    var cache = this._cache;
    this._conversionController.convert(conversion, function () {
        cache.updateFileTimestamp(conversion);
        if (typeof callback !== 'undefined') {
            callback();
        }
    });
};

/* global module:false */
module.exports = ConversionProcessor;
