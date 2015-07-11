'use strict';

var fs = require('fs');

exports.graphics = {
    psdWithTransparency: function (test) {
        test.expect(1);

        test.ok(fs.existsSync(".tmp/psd-with-transparency@1x.png"), 'file should exists psd-with-transparency@1x.png');

        test.done();
    },
    psdWithTransparencyGimp: function (test) {
        test.expect(1);

        test.ok(fs.existsSync(".tmp/psd-with-transparency-gimp@1x.png"), 'file should exists psd-with-transparency@1x.png');

        test.done();
    }
};
