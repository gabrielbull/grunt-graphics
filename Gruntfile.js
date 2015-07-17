'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: [
                '.tmp',
                '.cache',
                'test/fixtures/images/.*.json'
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
