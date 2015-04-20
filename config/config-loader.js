'use strict';

var glob = require('glob');
var fs = require('fs');
var path = require('path');

/**
 * @class ConfigLoader
 * @param {String} cwd
 * @param {String} src
 * @constructor
 */
var ConfigLoader = function (cwd, src) {
    this._cwd = cwd;
    this._src = src;
};

/**
 * @method load
 * @return {Object}
 */
ConfigLoader.prototype.load = function () {
    var root = this;
    var directories = this._parseSrc(this._src);
    for (var i = 0, len = directories.length; i < len; ++i) {
        var object = {};
        var module;
        glob.sync(directories[i], {cwd: this._cwd}).forEach(
            function (file) {
                if (file.indexOf(".js") > -1) {
                    module = file.replace(/\.js$/, '');
                    object[module] = require(path.join(root._cwd, module));
                }
            }
        );
    }

    return object;
};

/**
 * @method _parseSrc
 * @param {*} src
 * @return {Array.<String>}
 */
ConfigLoader.prototype._parseSrc = function (src) {
    var directories = [];
    if (Object.prototype.toString.call(src) === '[object Array]') {
        directories = src;
    } else if (typeof src === 'object') {
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                directories.push(src[prop]);
            }
        }
    } else if (typeof src === 'string') {
        directories.push(src);
    }
    return directories;
};

/* global module:false */
module.exports = ConfigLoader;
