'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: [
                '.tmp',
                'test/fixtures/images/.*.txt'
            ]
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
        'nodeunit',
        'clean'
    ]);

    grunt.registerTask('default', ['test', 'build-contrib']);
};
