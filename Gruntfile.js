'use strict';
module.exports = function (grunt) {

    var mozjpeg = require('imagemin-mozjpeg');

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            options: {
                event: ['changed', 'added', 'deleted']
            },
            js: {
                files: ['js/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },
            icons: {
                files: ['images/svg/*.svg'],
                tasks: ['grunticon']
            },
            css: {
                files: 'scss/**/*.scss',
                tasks: ['sass:dist', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['newer:jshint:all']
            },
            grunticon: {
                files: 'images/svg/*.svg',
                tasks: ['grunticon']
            },
            images: {
                files: ['images/**/*.{png,jpg,gif,svg}', '!images/dist/**/*.{png,jpg,gif,svg}', '!images/svg/**/*.{png,jpg,gif,svg}', '!images/svg-fallback/**/*.{png,jpg,gif,svg}'],
                tasks: ['newer:imagemin:dist']
            }
        },


        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'js/{,*/}*.js'
                ]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            dist: {
                options: {
                    sourceMap: true,
                    outputStyle: 'expanded',
                    includePaths: ['bower_components/foundation/scss']
                },
                files: {
                    'css/global.css': 'scss/global.scss' // 'destination': 'source'
                }
            }
        },

        // Minify CSS
        cssmin: {
            dist: {
                expand: true,
                cwd: 'css/',
                src: ['production.css', '!*.min.css'],
                dest: 'css/',
                ext: '.min.css'
            }
        },

        // Minify images
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif,svg}', '!dist/**', '!svg/**', '!svg-fallback/**'],
                    dest: 'images/dist/'
                }]
            }
        },

        // Uglify js
        uglify: {
            dist: {
                src: [],
                dest: ''
            }
        },

        // Combine files
        concat: {
            dist: {
                src: ['css/global.css'],
                dest: 'css/production.css'
            }
        },

        // SVG Icons https://github.com/filamentgroup/grunticon
        grunticon: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'images/svg/',
                    src: ['*.svg'],
                    dest: 'css'
                }],
                options: {
                    pngfolder: 'images/svg-fallback',
                    cssprefix: '.Icon--',
                    preview: false
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 3 versions', 'ie 8', 'ie 9'],
                map: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: '{,*/}*.css',
                    dest: 'css'
                }]
            }
        },

    });


    grunt.registerTask('build', [
        'concat',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'watch'
    ]);


};
