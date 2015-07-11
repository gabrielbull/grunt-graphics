'use strict';

var Queue = require('./queue/queue');
var Processor = require('./processor/processor');
var Cache = require('./cache/cache');

/**
 * @class GraphicsController
 * @constructor
 */
var GraphicsController = function (task, process, grunt) {
    this._task = task;
    this._process = process;
    this._grunt = grunt;
    this._cache = new Cache();
};

GraphicsController.prototype.process = function (config) {
    var queue = new Queue(this._process, this._cache).buildQueue(config);
    new Processor(this._task, this._process, this._grunt, this._cache).process(queue);
};

/* global module:false */
module.exports = GraphicsController;
