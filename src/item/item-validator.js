'use strict';

var path = require('path');
var fs = require('fs');

/**
 * @class GraphicsController
 * @param {Item} item
 * @constructor
 */
var ItemValidator = function (item) {
    this._newerResult = {};
    this._cache = null;
    this._item = item;
};

/**
 * @method isProcessingRequired
 * @return {Boolean}
 */
ItemValidator.prototype.isProcessingRequired = function () {
    return (
        !this.exists() ||
        this.isConfigNewer() ||
        this.isSrcNewer()
    );
};

/**
 * @method isSrcNewer
 * @return {Boolean}
 */
ItemValidator.prototype.isSrcNewer = function () {
    var file = this._item.src();

    if (typeof this._newerResult[file] !== 'undefined') {
        return this._newerResult[file];
    }

    var timestampFile = this._item.timestampFile();

    if (!fs.existsSync(timestampFile)) {
        this._newerResult[file] = true;
        return true;
    }

    var previous = fs.statSync(timestampFile).mtime;
    var newer = fs.statSync(file).mtime;
    if (previous < newer) {
        this._newerResult[file] = true;
        return true;
    }
    this._newerResult[file] = false;
    return false;
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
ItemValidator.prototype.isConfigNewer = function () {
    var file = path.join(this._cache.cacheDir(), this._item.dest(), 'config.json');
    if (!fs.existsSync(file)){
        return true;
    } else {
        var content = fs.readFileSync(file, "utf8");
        if (content !== JSON.stringify({
                src: this._item.src(),
                options: this._item.options()
            })) {
            return true;
        }
    }
    return false;
};

/**
 * @method cache
 * @return {Cache}
 */
ItemValidator.prototype.cache = function () {
    return this._cache;
};

/**
 * @method setCache
 * @param {Cache} cache
 * @return {ItemValidator}
 */
ItemValidator.prototype.setCache = function (cache) {
    this._cache = cache;
    return this;
};

/* global module:false */
module.exports = ItemValidator;
