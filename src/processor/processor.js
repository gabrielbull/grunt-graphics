'use strict';

var ItemProcessor = require('./item-processor');
var ConversionProcessor = require('./conversion-processor');

/**
 * @class Processor
 * @constructor
 */
var Processor = function (task, process, grunt) {
    this._task = task;
    this._process = process;
    this._grunt = grunt;
};

Processor.prototype.process = function (queue, callback) {
    var root = this;

    var itemProcessor = new ItemProcessor(
        this._task,
        this._process,
        this._grunt
    );

    var conversionProcessor = new ConversionProcessor(
        this._task,
        this._process,
        this._grunt
    );

    this._task.start();

    var endCallback = function () {
        root._task.end();
        if (typeof callback !== 'undefined') {
            callback();
        }
    };

    if (queue.conversionQueue.length) {
        conversionProcessor.process(queue.conversionQueue, function () {
            itemProcessor.process(queue.itemQueue, endCallback);
        });
    } else if (queue.itemQueue.length) {
        itemProcessor.process(queue.itemQueue, endCallback);
    } else {
        this._task.end();
    }
};

/* global module:false */
module.exports = Processor;
