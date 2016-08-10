'use strict';
module.exports = function (grunt) {

    // var mozjpeg = require('imagemin-mozjpeg');

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
                tasks: ['babel:dist','newer:jshint:all']
            },
            css: {
                files: 'scss/**/*.scss',
                tasks: ['sass:dist', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['newer:jshint:all']
            },
            // grunticon: {
            //     files: 'images/svg/*.svg',
            //     tasks: ['grunticon']
            // },
            images: {
                files: ['images/**/*.{png,jpg,gif,svg}', '!images/dist/**/*.{png,jpg,gif,svg}', '!images/svg/**/*.{png,jpg,gif,svg}', '!images/svg-fallback/**/*.{png,jpg,gif,svg}'],
                tasks: ['newer:imagemin:dist']
            },
            copygrunticon: {
                files: ['.tmp/grunticon/*'],
                tasks: ['copy']
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'js/main.plain.js': 'js/main.js'
                }
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
                    'js/{,*/}*.js',
                    '!js/production.js',
                    '!js/production.min.js',
                    '!js/vendor/**/*.js',
                    '!js/main.plain.js'
                ]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            dist: {
                options: {
                    sourceMap: true,
                    outputStyle: 'expanded',
                    includePaths: ['node_modules/materialize-css/sass']
                },
                files: {
                    'css/global.css': 'scss/global.scss' // 'destination': 'source'
                }
            }
        },

        // Minify images
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }]
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif,svg}', '!dist/**', '!svg/**', '!svg-fallback/**'],
                    dest: 'images/dist/'
                }]
            }
        },

        // SVG Icons https://github.com/filamentgroup/grunticon
        grunticon: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'images/svg/',
                    src: ['*.svg'],
                    dest: '.tmp/grunticon/'
                }],
                options: {
                    pngpath: 'images/svg-fallback',
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

        // PHP server for local development
        php: {
            devel: {
                options: {
                    hostname: '0.0.0.0',
                    base: '',
                    port: 9000
                }
            }
        },

        // Live reload
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['*.html', 'css/**/*.css', 'js/**/*.js', '!js/main.js', '*.php']
                },
                options: {
                    proxy: '0.0.0.0:9000', //our PHP server
                    port: 9011, // our new port
                    open: true,
                    watchTask: true
                }
            }
        },

        // Minification, contcat, uglify
        useminPrepare: {
            html: 'index.php',
            options: {
                dest: 'dist'
            }
        },

        usemin:{
            html: ['dist/index.php', 'dist/views/**/*.php'],
            css: ['dist/css/{,*/}*.css'],
            options: {
                assetsDirs: [
                    'dist', 'dist/images/dist'
                ],
            }
        },

        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            dist: {
                src: [
                    'dist/images/dist/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    'dist/js/**/*.js',
                    'dist/css/**/*.css'
                ]
            }
        },

        clean: {
            build: ['dist']
        },

        // Parse html and generates above the fold css
        critical: {
            dist: {
                options: {
                    base: './',
                    css: [
                        'css/global.css'
                    ],
                    width: 1024,
                    height: 300,
                    minify: true
                },
                src: 'dist/index.php',
                dest: 'dist/index.php'
            }
        },



        // Copy stuff
        copy: {

            grunticonspng: {
                expand: true,
                flatten: true,
                src: '.tmp/grunticon/png/*.png',
                dest: 'images/svg-fallback/',
            },
            grunticonscss: {
                expand: true,
                flatten: true,
                src: '.tmp/grunticon/*.css',
                dest: 'css/',
            },
            build: {
                files: [
                    {
                        src: ['index.php', 'AltoRouter.php', '.htaccess', 'robots.txt'],
                        dest: 'dist/',
                    },
                    {
                        expand: true,
                        cwd: 'views/',
                        src: ['**'],
                        dest: 'dist/views',
                    },
                    {
                        expand: true,
                        cwd: 'data/',
                        src: ['**'],
                        dest: 'dist/data',
                    },
                    {
                        expand: true,
                        cwd: 'images/dist/',
                        src: ['**'],
                        dest: 'dist/images/dist',
                    },
                    {
                        expand: true,
                        cwd: 'favicons/',
                        src: ['**'],
                        dest: 'dist/favicons',
                    },
                    {
                        expand: true,
                        cwd: 'fonts/',
                        src: ['**'],
                        dest: 'dist/fonts',
                    }
                ]
            }

        }

    });


    grunt.registerTask('build', [
        'clean',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'copy:build',
        'filerev',
        'usemin',
        // 'critical:dist'
    ]);

    grunt.registerTask('default', [
        'php:devel', 'browserSync', 'watch'
    ]);


};
