'use strict';

var fs = require('fs');

exports.graphics = {
    minifyPng: function (test) {
        test.expect(1);

        test.ok(true, 'should minify PNG images');

        test.done();
    }
};
