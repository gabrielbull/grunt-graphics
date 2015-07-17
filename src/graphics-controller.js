'use strict';

var path = require('path');
var Queue = require('./queue/queue');
var Processor = require('./processor/processor');

/**
 * @class GraphicsController
 * @constructor
 */
var GraphicsController = function (task, process, grunt) {
    this._task = task;
    this._process = process;
    this._grunt = grunt;
    global._cacheDir = path.join(__dirname, '..', '.cache');
};

GraphicsController.prototype.process = function (config) {
    var queue = new Queue(this._process).buildQueue(config);
    new Processor(this._task, this._process, this._grunt).process(queue);
};

/* global module:false */
module.exports = GraphicsController;
