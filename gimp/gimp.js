'use strict';

var path = require('path');
var child_process = require('child_process');
var fs = require('fs');
var tmp = require('tmp');
var mkdirp = require("mkdirp");

/**
 * @class Gimp
 * @param {String} bin
 * @param {Cache} cache
 * @param {Object} grunt
 * @constructor
 */
var Gimp = function (bin, cache, grunt) {
    this._bin = bin;
    this._cache = cache;
    this._grunt = grunt;
};

/**
 * @method convertPsdToPng
 * @param {String} src
 * @param {String} dest
 * @param {Function} callback
 */
Gimp.prototype.convertPsdToPng = function (src, dest, callback) {
    var grunt = this._grunt;
    var root = this;

    tmp.tmpName(function _tempNameGenerated(err, tmpfile) {
        if (err) {
            throw err;
        }

        var dir = path.dirname(tmpfile);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        var command = root._createCommand('convert-psd-to-png.sh', [src, tmpfile]);
        grunt.log.writeln('Converting ' + path.basename(src));
        child_process.execSync(command);
        fs.renameSync(tmpfile, dest);
        callback();
    });
};

/**
 * @method convertPsdToPng
 * @param {String} src
 * @param {String} dest
 * @param {Function} callback
 */
Gimp.prototype.convertPsdToJpg = function (src, dest, callback) {
    var grunt = this._grunt;
    var root = this;

    tmp.tmpName(function _tempNameGenerated(err, tmpfile) {
        if (err) {
            throw err;
        }

        var dir = path.dirname(tmpfile);
        if (!fs.existsSync(dir)){
            mkdirp.sync(dir);
        }

        var command = root._createCommand('convert-psd-to-jpg.sh', [src, tmpfile]);
        child_process.execSync(command);
        fs.renameSync(tmpfile, dest);
        callback();
    });
};

/**
 * @method _createCommand
 * @param {String} command
 * @param {Array} args
 * @return {String}
 */
Gimp.prototype._createCommand = function (command, args) {
    command = this._getShellScript(command) + " \"" + this._bin + "\"";

    for (var i = 0, len = args.length; i < len; ++i) {
        command += " \"" + args[i] + "\"";
    }

    return command;
};

/**
 * @method _getShellScript
 * @param {String} command
 * @return {String}
 */
Gimp.prototype._getShellScript = function (command) {
    return path.join(__dirname, '..', 'bin', command);
};

/* global module:false */
module.exports = Gimp;
