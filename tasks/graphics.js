/* global module:false */
/* global process:false */
/** @param {Object} grunt Grunt. */
module.exports = function(grunt) {
    grunt.registerTask('graphics', function () {
        var done = this.async();
        var queue = 0;
        var task = {
            start: function () {
                queue++;
            },
            end: function () {
                queue--;
                if (queue <= 0) {
                    done();
                }
            }
        };

        var GraphicsController = require('./../src/graphics-controller');
        new GraphicsController(task, process, grunt).process(grunt.config.get('graphics')[this.args[0]].src);

        if (queue <= 0) {
            return done();
        }
    });
};
