'use strict';

var path = require('path');
var fs = require('fs');
var tmp = require('tmp');
var im = require('imagemagick');
var mkdirp = require("mkdirp");

/**
 * @class ImageMagick
 * @param {Object} grunt
 * @constructor
 */
var ImageMagick = function (grunt) {
    this._grunt = grunt;
};

/**
 * @param {String} src
 * @param {String} dest
 * @param {Function} callback
 */
ImageMagick.prototype.convertPsdToJpg = function (src, dest, callback) {
    this._convert(src, dest, 'jpg', callback);
};

/**
 * @param {String} src
 * @param {String} dest
 * @param {Function} callback
 */
ImageMagick.prototype.convertPsdToPng = function (src, dest, callback) {
    this._convert(src, dest, 'png', callback);
};

/**
 * @param {String} src
 * @param {String} dest
 * @param {String} format
 * @param {Function} callback
 */
ImageMagick.prototype._convert = function (src, dest, format, callback) {
    var grunt = this._grunt;

    tmp.tmpName(function _tempNameGenerated(err, tmpfile) {
        if (err) {
            throw err;
        }

        tmpfile = tmpfile + "." + format;

        var dir = path.dirname(tmpfile);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        dir = path.dirname(dest);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        im.convert([src, tmpfile],
            function (err, stdout, stderr) {
                if (err) {
                    grunt.fail.warn(stderr);
                    throw err;
                }

                try {
                    fs.accessSync(tmpfile);
                    fs.renameSync(tmpfile, dest);
                    callback();
                } catch (err) {
                    try {
                        tmpfile = tmpfile.replace(/\.(jpg|png)$/, '-0.' + format);
                        fs.accessSync(tmpfile);
                        fs.renameSync(tmpfile, dest);
                        callback();
                    } catch (err) {
                        grunt.fail.warn('Could not find tmp file');
                    }
                }
            }
        );
    });
};

/**
 * @param {Item} item
 * @param {Function} callback
 */
ImageMagick.prototype.resize = function (item, callback) {
    var grunt = this._grunt;

    tmp.tmpName(function _tempNameGenerated(err, tmpfile) {
        if (err) {
            throw err;
        }

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

        var options = {
            srcPath: src,
            dstPath: tmpfile,
            format: item.destFormat()
        };

        if (typeof item.options().width !== 'undefined') {
            options.width = item.options().width;
        }

        if (typeof item.options().height !== 'undefined') {
            options.height = item.options().height;
        }

        if (typeof item.options().quality !== 'undefined') {
            options.quality = item.options().quality;
        }

        im.resize(options,
            function (err, stdout, stderr) {
                if (err) {
                    console.log(err, stdout, stderr);
                    grunt.fail.warn('unknown error ImageMagick.prototype.resize');
                    throw err;
                }
                fs.renameSync(tmpfile, item.dest());
                callback();
            }
        );
    });
};

/* global module:false */
module.exports = ImageMagick;
