'use strict';

var path = require('path');
var fs = require('fs');
var mkdirp = require("mkdirp");

/**
 * @class Cache
 * @constructor
 */
var Cache = function () {
};

/**
 * @method cacheDir
 * @return {String}
 */
Cache.prototype.cacheDir = function () {
    return path.join(__dirname, '..', '..', '.cache');
};

/**
 * @method updateFileTimestamp
 * @param {Item} item
 * @todo move me to a item-validator/item-state object
 */
Cache.prototype.updateFileTimestamp = function (item) {
    var timestampFile = item.timestampFile();
    var dir = path.dirname(timestampFile);
    if (!fs.existsSync(dir)){
        mkdirp.sync(dir);
    }
    if (fs.existsSync(timestampFile)) {
        fs.unlinkSync(timestampFile);
    }
    fs.writeFileSync(timestampFile, "");
};

/**
 * @method saveItemConfig
 * @param {Item} item
 * @todo move me to a item-validator/item-state object
 */
Cache.prototype.saveItemConfig = function (item) {
    var cacheFile = path.join(this.cacheDir(), item.dest(), "config.json");
    var dir = path.dirname(cacheFile);
    if (!fs.existsSync(dir)){
        mkdirp.sync(dir);
    }
    if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
    }
    fs.writeFileSync(cacheFile, JSON.stringify({
        src: item.src(),
        options: item.options()
    }));
};

/* global module:false */
module.exports = Cache;
