'use strict';

var path = require('path');
var fs = require('fs');
var mkdirp = require("mkdirp");

/**
 * @class ItemState
 * @constructor
 */
var ItemState = function () {
};

/**
 * @param {Item} item
 */
ItemState.prototype.updateItemConfig = function (item) {
    var stateInfo = this.getStateInfo(item);

    stateInfo[item.dest()] = JSON.stringify({
        src: item.src(),
        options: item.options()
    });

    this.saveStateInfo(item, stateInfo);
};

/**
 * @param {Item} item
 * @return {Boolean}
 */
ItemState.prototype.isConfigDifferent = function (item) {
    var stateInfo = this.getStateInfo(item);

    if (typeof stateInfo[item.dest()] === 'undefined') {
        return true;
    }

    var newConfig = JSON.stringify({
        src: item.src(),
        options: item.options()
    });

    return newConfig !== stateInfo[item.dest()];
};

/**
 * @param {Item} item
 */
ItemState.prototype.updateTimestamp = function (item) {
    var stateInfo = this.getStateInfo(item);
    stateInfo.timestamp = this.formatDate(new Date());
    this.saveStateInfo(item, stateInfo);
};

/**
 * @param {Item} item
 * @param {Date} date
 * @return {Boolean}
 */
ItemState.prototype.isTimestampNewer = function (item, date) {
    var stateInfo = this.getStateInfo(item);

    if (typeof stateInfo.timestamp === 'undefined') {
        return true;
    }

    return stateInfo.timestamp < this.formatDate(date);
};

/**
 * @param {Item} item
 * @return {Object}
 */
ItemState.prototype.getStateInfo = function (item) {
    var stateFile = item.stateFile();

    if (!fs.existsSync(stateFile)) {
        return {};
    } else {
        return JSON.parse(fs.readFileSync(stateFile));
    }
};

/**
 * @param {Item} item
 * @param {Object} stateInfo
 * @return {Object}
 */
ItemState.prototype.saveStateInfo = function (item, stateInfo) {
    var stateFile = item.stateFile();
    fs.writeFileSync(stateFile, JSON.stringify(stateInfo));
};

/**
 * @param {Date} date
 * @return {String}
 */
ItemState.prototype.formatDate = function (date) {
    function pad2(n) {  // always returns a string
        return (n < 10 ? '0' : '') + n;
    }

    return date.getFullYear() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        pad2(date.getSeconds());
};

/* global module:false */
module.exports = ItemState;
