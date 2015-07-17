'use strict';

var path = require('path');
var fs = require('fs');
var ItemState = require('./item-state');

/**
 * @class GraphicsController
 * @param {Item} item
 * @constructor
 */
var ItemValidator = function (item) {
    this._item = item;
};

/**
 * @method isProcessingRequired
 * @return {Boolean}
 */
ItemValidator.prototype.isProcessingRequired = function () {
    return (
        !this.exists() ||
        this.isConfigDifferent() ||
        (this._item.conversion() !== null && this.isTimestampNewer())
    );
};

/**
 * @method isSrcNewer
 * @return {Boolean}
 */
ItemValidator.prototype.isTimestampNewer = function () {
    return new ItemState().isTimestampNewer(
        this._item,
        new Date(fs.statSync(this._item.src()).mtime)
    );
};

/**
 * @method exists
 * @return {Boolean}
 */
ItemValidator.prototype.exists = function () {
    return fs.existsSync(this._item.dest());
};

/**
 * @method exists
 * @return {Boolean}
 */
ItemValidator.prototype.isConfigDifferent = function () {
    return new ItemState().isConfigDifferent(this._item);
};

/* global module:false */
module.exports = ItemValidator;
