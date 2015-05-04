'use strict';

var path = require('path');
var fs = require('fs');
var mkdirp = require("mkdirp");

/**
 * @class ConversionController
 * @param {Object} grunt
 * @param {Cache} cache
 * @param {Gimp} gimp
 * @param {ImageMagick} imageMagick
 * @param {GraphicsMagick} graphicsMagick
 * @constructor
 */
var ConversionController = function (grunt, cache, gimp, imageMagick, graphicsMagick) {
    this._grunt = grunt;
    this._cache = cache;
    this._gimp = gimp;
    this._imageMagick = imageMagick;
    this._graphicsMagick = graphicsMagick;
};

/**
 * @method convert
 * @param {Item} item
 * @param {Function} callback
 * @return {String}
 */
ConversionController.prototype.convert = function (item, callback) {
    this._grunt.log.writeln('Converting ' + path.basename(item.src()));
    switch (item.conversion()) {
        case 'convert-psd-to-png':
            return this.convertPsdToPng(item, callback);
            break;
        case 'convert-psd-to-jpg':
            return this.convertPsdToJpg(item, callback);
            break;
    }
    return null;
};

/**
 * @method convertPsdToPng
 * @param {Item} item
 * @param {Function} callback
 * @return {String}
 */
ConversionController.prototype.convertPsdToPng = function (item, callback) {
    var convertedFile = path.join(this._cache.cacheDir(), item.convertedSrc());
    var dir = path.dirname(convertedFile);
    if (fs.existsSync(convertedFile)) {
        fs.unlinkSync(convertedFile);
    }

    if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
    }

    return this._gimp.convertPsdToPng(item.src(), convertedFile, callback);
};

/**
 * @method convertPsdToPng
 * @param {Item} item
 * @param {Function} callback
 * @return {String}
 */
ConversionController.prototype.convertPsdToJpg= function (item, callback) {
    var convertedFile = path.join(this._cache.cacheDir(), item.convertedSrc());
    var dir = path.dirname(convertedFile);
    if (fs.existsSync(convertedFile)) {
        fs.unlinkSync(convertedFile);
    }

    if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
    }

    return this._imageMagick.convertPsdToJpg(item.src(), convertedFile, callback);
};

/* global module:false */
module.exports = ConversionController;
