'use strict';

var path = require('path');

/**
 * @class ConfigParser
 * @param {String} cwd
 * @param {Object} env
 * @constructor
 */
var ConfigParser = function (cwd, env) {
    this._cwd = cwd;
    this._env = env;
};

/**
 * @method parse
 * @param {Object} configCollection
 * @return {Array.<Object>}
 */
ConfigParser.prototype.parse = function (configCollection) {
    var retval = [];
    var items;
    for (var prop in configCollection) {
        if (configCollection.hasOwnProperty(prop)) {
            items = this.parseItemCollection(configCollection[prop], prop);
            for (var i = 0, len = items.length; i < len; ++i) {
                retval.push(items[i]);
            }
        }
    }

    return retval;
};

/**
 * @method parseItemCollection
 * @param {Array} itemCollection
 * @param {String} name
 * @return {Array}
 */
ConfigParser.prototype.parseItemCollection = function (itemCollection, name) {
    var retval = [];
    var items;
    for (var i = 0, len = itemCollection.length; i < len; ++i) {
        items = this.parseItem(itemCollection[i], name);
        for (var j = 0, jlen = items.length; j < jlen; ++j) {
            retval.push(items[j]);
        }
    }
    return retval;
};

/**
 * @method parseItem
 * @param {Object} item
 * @param {String} name
 * @return {Array}
 */
ConfigParser.prototype.parseItem = function (item, name) {
    var retval = [];
    var files = this.parseItemFiles(item.files);
    var src;
    var dest;

    for (var i = 0, len = files.length; i < len; ++i) {
        src = this.parseFilePath(files[i].src);
        dest = this.parseFilePath(files[i].dest);
        for (var j = 0, jlen = item.options.length; j < jlen; ++j) {
            retval.push({
                name: name,
                src: this.parseFilePath(src),
                dest: this.parseDestinationFilePath(this.parseFilePath(dest), item.options[j]),
                options: item.options[j]
            });
        }
    }

    return retval;
};

/**
 * @method parseDestinationFilePath
 * @param {String} filepath
 * @param {Object} options
 * @return {String}
 */
ConfigParser.prototype.parseDestinationFilePath = function (filepath, options) {
    if (typeof options.suffix === 'string') {
        filepath = filepath.replace(/(\.[a-zA-Z]*)$/, options.suffix + '$1');
    }
    if (typeof options.prefix === 'string') {
        filepath = filepath.replace(/([^\/]*)$/, options.prefix + '$1');
    }
    return filepath;
};

/**
 * @method parseItemFiles
 * @param {*} files
 * @return {Array}
 */
ConfigParser.prototype.parseItemFiles = function (files) {
    var retval = [];
    if (Object.prototype.toString.call(files) === '[object Array]') {
        for (var i = 0, len = files.length; i < len; ++i) {
            retval.push(this.parseItemFiles(files[i]));
        }
    } else if (typeof files === 'object' && typeof files.src !== 'undefined' && typeof files.dest !== 'undefined') {
        retval.push(files);
    } else if (typeof files === 'object') {
        for (var prop in files) {
            if (files.hasOwnProperty(prop)) {
                retval.push({src: files[prop], dest: prop});
            }
        }
    }

    return retval;
};

/**
 * @method parseFilePath
 * @param {String} file
 * @return {String}
 */
ConfigParser.prototype.parseFilePath = function (file) {
    if (file.indexOf("/") === 0) {
        return file;
    } else if (file.indexOf("~") === 0) {
        return file.replace('~', this._env.HOME);
    } else {
        return path.join(this._cwd, file);
    }
};

/* global module:false */
module.exports = ConfigParser;
