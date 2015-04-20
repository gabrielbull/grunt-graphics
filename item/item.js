'use strict';

var ItemValidator = require('./item-validator');
var fs = require('fs');

/**
 * @class Item
 * @constructor
 */
var Item = function (item) {
    this._name = item.name;
    this._src = item.src;
    this._dest = item.dest;
    this._options = item.options;
    this._validator = new ItemValidator(this);
    this._conversion = false;
    this._convertedSrc = null;
};

/**
 * @method deleteDest
 * @return {Item}
 */
Item.prototype.deleteDest = function () {
    if (fs.existsSync(this._dest)) {
        fs.unlinkSync(this._dest);
    }
    return this;
};

/**
 * @method conversion
 * @return {String}
 */
Item.prototype.conversion = function () {
    if (false !== this._conversion) {
        return this._conversion;
    }

    var src = this._src.replace(/.*\.([^\.]+)$/, '$1').toLowerCase();
    var dest = this._dest.replace(/.*\.([^\.]+)$/, '$1').toLowerCase();

    if (src === dest) {
        return this._conversion = null;
    }

    if (src === 'psd' && dest === 'png') {
        return this._conversion = 'convert-psd-to-png';
    }

    if (src === 'psd' && dest === 'jpg') {
        return this._conversion = 'convert-psd-to-jpg';
    }
    return this._conversion = null;
};

/**
 * @method isProcessingRequired
 * @return {Boolean}
 */
Item.prototype.isProcessingRequired = function () {
    return this._validator.isProcessingRequired();
};

/**
 * @method validator
 * @return {ItemValidator}
 */
Item.prototype.validator = function () {
    return this._validator;
};

/**
 * @method name
 * @return {String}
 */
Item.prototype.name = function () {
    return this._name;
};

/**
 * @method src
 * @return {String}
 */
Item.prototype.src = function () {
    return this._src;
};

/**
 * @method dest
 * @return {String}
 */
Item.prototype.dest = function () {
    return this._dest;
};

/**
 * @method options
 * @return {Object}
 */
Item.prototype.options = function () {
    return this._options;
};

/**
 * @method convertedSrc
 * @return {String}
 */
Item.prototype.convertedSrc = function () {
    if (null === this._convertedSrc) {
        var src = this.src().replace(/\.([^\.]+)$/, '.');
        switch (this.conversion()) {
            case 'convert-psd-to-png':
                this._convertedSrc = src + 'png';
                break;
            case 'convert-psd-to-jpg':
                this._convertedSrc = src + 'jpg';
                break;
        }
    }
    return this._convertedSrc;
};

/**
 * @method setConvertedSrc
 * @param {String} convertedSrc
 * @return {Item}
 */
Item.prototype.setConvertedSrc = function (convertedSrc) {
    this._convertedSrc = convertedSrc;
    return this;
};

/* global module:false */
module.exports = Item;
