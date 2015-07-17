'use strict';

var fs = require('fs');
var Gimp = require('./gimp');

/**
 * @class GimpDetector
 * @param {Object} process
 * @param {Object} grunt
 * @constructor
 */
var GimpDetector = function (process, grunt) {
    this._process = process;
    this._grunt = grunt;
    this._darwinBin = [
        '/opt/homebrew-cask/Caskroom/lisanet-gimp/2.8.14p1/Gimp.app/Contents/MacOS/gimp-2.8',
        '/Applications/GIMP.app/Contents/MacOS/GIMP-bin',
        '/opt/homebrew-cask/Caskroom/gimp/2.8.14/GIMP.app/Contents/MacOS/GIMP-bin'
    ];
};

/**
 * @method createGimp
 * @return {Gimp}
 */
GimpDetector.prototype.createGimp = function () {
    return new Gimp(this.detectBin(), this._grunt);
};

/**
 * @method detectBin
 * @return {String}
 */
GimpDetector.prototype.detectBin = function () {
    switch (this._process.platform) {
        case 'darwin':
            for (var i = 0, len = this._darwinBin.length; i < len; ++i) {
                if (fs.existsSync(this._darwinBin[i])) {
                    return this._darwinBin[i];
                }
            }
            break;
        case 'linux':
            return 'gimp';
            break;
    }
    return null;
};

/* global module:false */
module.exports = GimpDetector;
