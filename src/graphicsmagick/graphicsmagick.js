'use strict';

var path = require('path');
var fs = require('fs');
var tmp = require('tmp');
var gm = require('gm');
var mkdirp = require("mkdirp");

/**
 * @class GraphicsMagick
 * @param {Object} grunt
 * @constructor
 */
var GraphicsMagick = function (grunt) {
    this._grunt = grunt;
};

/**
 * @param {Item} item
 * @param {Function} callback
 */
GraphicsMagick.prototype.resize = function (item, callback) {
    var grunt = this._grunt;

    tmp.tmpName(function _tempNameGenerated(err, tmpfile) {
        if (err) {
            throw err;
        }

        tmpfile = tmpfile + "." + item.destFormat();

        var dir = path.dirname(tmpfile);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        dir = path.dirname(item.dest());
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        var src;
        if (item.convertedSrc()) {
            src = item.convertedSrc();
        } else {
            src = item.src()
        }

        gm(src)
            .resize(
            (typeof item.options().width !== 'undefined' ? item.options().width : null),
            (typeof item.options().height !== 'undefined' ? item.options().height : null)
            )
            .write(tmpfile, function (err) {
                if (err) {
                    console.log(err);
                    grunt.fail.warn('unknown error GraphicsMagick.prototype.resize');
                    throw err;
                }
                fs.renameSync(tmpfile, item.dest());
                callback();
            });
    });
};

/**
 * @param {String} src
 * @param {String} dest
 * @param {Function} callback
 */
GraphicsMagick.prototype.convertPsdToJpg = function (src, dest, callback) {
    var grunt = this._grunt;

    tmp.tmpName(function _tempNameGenerated(err, tmpfile) {
        if (err) {
            throw err;
        }

        var dir = path.dirname(tmpfile);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        dir = path.dirname(dest);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        gm(src)
            .write(tmpfile, function (err) {
                if (err) {
                    grunt.fail.warn('unknown error GraphicsMagick.prototype.convertPsdToJpg');
                    throw err;
                }
                fs.renameSync(tmpfile, dest);
                callback();
            });
    });
};

/**
 * @param {String} src
 * @param {String} dest
 * @param {Function} callback
 */
GraphicsMagick.prototype.convertPsdToPng = function (src, dest, callback) {
    var grunt = this._grunt;

    tmp.tmpName(function _tempNameGenerated(err, tmpfile) {
        if (err) {
            throw err;
        }

        var dir = path.dirname(tmpfile);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        dir = path.dirname(dest);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        tmpfile = tmpfile + ".png";

        gm(src)
            .write(tmpfile, function (err) {
                if (err) {
                    grunt.fail.warn('unknown error GraphicsMagick.prototype.convertPsdToPng');
                    throw err;
                }
                fs.renameSync(tmpfile, dest);
                callback();
            });
    });
};

/* global module:false */
module.exports = GraphicsMagick;
