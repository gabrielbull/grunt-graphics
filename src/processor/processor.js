'use strict';

var ItemProcessor = require('./item-processor');
var ConversionProcessor = require('./conversion-processor');

/**
 * @class Processor
 * @constructor
 */
var Processor = function (task, process, grunt, cache) {
    this._task = task;
    this._process = process;
    this._grunt = grunt;
    this._cache = cache;
};

Processor.prototype.process = function (queue, callback) {
    var root = this;

    var itemProcessor = new ItemProcessor(
        this._task,
        this._process,
        this._grunt,
        this._cache
    );

    var conversionProcessor = new ConversionProcessor(
        this._task,
        this._process,
        this._grunt,
        this._cache
    );

    this._task.start();

    conversionProcessor.process(queue.conversionQueue, function () {
        itemProcessor.process(queue.itemQueue, function () {
            root._task.end();
            if (typeof callback !== 'undefined') {
                callback();
            }
        });
    });
};

/* global module:false */
module.exports = Processor;
