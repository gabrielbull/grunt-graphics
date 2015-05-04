'use strict';

var path = require('path');
var fs = require('fs');
var tmp = require('tmp');
var im = require('imagemagick');
var mkdirp = require("mkdirp");

/**
 * @class ImageMagick
 * @param {Cache} cache
 * @param {Object} grunt
 * @constructor
 */
var ImageMagick = function (cache, grunt) {
    this._cache = cache;
    this._grunt = grunt;
};

/**
 * @param {String} src
 * @param {String} dest
 * @param {Function} callback
 */
ImageMagick.prototype.convertPsdToJpg = function (src, dest, callback) {
    var grunt = this._grunt;

    tmp.tmpName(function _tempNameGenerated(err, tmpfile) {
        if (err) {
            throw err;
        }

        tmpfile = tmpfile + ".jpg";

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
                    grunt.fail.warn('unknown error ImageMagick.prototype.convertPsdToJpg');
                    throw err;
                }

                try {
                    fs.accessSync(tmpfile);
                    fs.renameSync(tmpfile, dest);
                    callback();
                } catch (err) {
                    try {
                        tmpfile = tmpfile.replace(/\.jpg$/, '-0.jpg');
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

/* global module:false */
module.exports = ImageMagick;
