'use strict';

module.exports = function (grunt) {
    //require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: ['.tmp']
        },
        graphics: {
            assets: {
                src: "test/fixtures/assets/**/*"
            }
        },
        nodeunit: {
            tests: ['test/test.js']
        }
    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', [
        'graphics:assets',
        'nodeunit'
    ]);

    grunt.registerTask('default', ['test', 'build-contrib']);
};
