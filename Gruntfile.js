/*!
 * Netropolis Gruntfile
 * https://netropolis.io/
 */

'use strict';

var globalConfig = {
	css: {
		src: './src/css',
		dist: './css'
	},
	js: {
		src: './src/javascripts',
		dist: './js'
	},
	fonts: {
		dist: './fonts'
	},
	images: {
		src: './src/images',
		dist: './images'
	},
	build: './src/_build',
	maps: './src/maps'
};

module.exports = function(grunt) {
	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	// Displays the elapsed execution time
	require('time-grunt')(grunt);

	// Load NPM Tasks
	require('jit-grunt')(grunt);

	grunt.initConfig({
		globalConfig: globalConfig,

		// Load the Package file so we can reference its info if necessary
		pkg: grunt.file.readJSON('package.json'),

		// CONFIG ===================================/
		copy: {
			fontawesomefontsdist: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				src: './node_modules/font-awesome/fonts/**',
				dest: '<%= globalConfig.fonts.dist %>'
			}
		},

		postcss: {
			options: {
				map: {
					inline: false
				},
				processors: [
					require('postcss-import')(),
					require('postcss-at-rules-variables')(),
					require('postcss-each')(),
					require('postcss-for')(),
					require('postcss-input-range')(),
					require('postcss-cssnext')({
						browsers: 'last 2 versions, IE >= 10, iOS >= 7, Android >= 4'
					}),
					require('postcss-url')({
						url: function(url) {
							url = url.replace('../../..', '..');
							url = url.replace('../..', '..');
							return url;
						}
					}),
					require('lost')(),
					require('postcss-single-charset')()
				]
			},
			all: {
				files: {
					'<%= globalConfig.build %>/<%= pkg.name %>.css' : '<%= globalConfig.css.src %>/<%= pkg.name %>.css'
				}
			}
		},

		cssmin: {
			options: {
				report: 'min',
				keepSpecialComments: 0,
				sourceMap: true
			},
			target: {
				files: [{
					expand: true,
					cwd: '<%= globalConfig.build %>',
					src: [
						'**/*.css',
						'!**/*.min.css'
					],
					dest: '<%= globalConfig.css.dist %>',
					ext: '.min.css'
				}]
			}
		},

		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 4,
					progressive: true,
					interlaced: true
				},
				files: [{
					expand: true,
					cwd: '<%= globalConfig.images.src %>',
					src: '**/*.{png,jpg,gif}',
					dest: '<%= globalConfig.images.dist %>'
				}]
			}
		},

		jshint: {
			all: [
				'<%= globalConfig.js.src %>/**/*.js'
			]
		},

		browserify: {
			options: {
				transform: [
					["babelify", {
						presets: "es2015"
					}]
				]
			},
			all: {
				files: {
					'<%= globalConfig.build %>/<%= pkg.name %>.js': [
						'<%= globalConfig.js.src %>/<%= pkg.name %>.js'
					]
				}
			}
		},

		uglify: {
			options: {
				report: 'min',
				preserveComments: false,
				sourceMap: true,
				sourceMapIncludeSources: true
			},
			all: {
				files: {
					'<%= globalConfig.js.dist %>/<%= pkg.name %>.min.js': '<%= globalConfig.build %>/<%= pkg.name %>.js'
				}
			}
		},

		watch: {
			postcss: {
				files: '<%= globalConfig.css.src %>/**/*.css',
				tasks: [
					'postcss',
					'cssmin'
				]
			},
			js: {
				files: '<%= globalConfig.js.src %>/**/*.js',
				tasks: [
					'jshint',
					'browserify',
					'uglify'
				]
			},
			imagemin: {
				files: '<%= globalConfig.images.src %>/**/*.{png,jpg,gif}',
				tasks: 'newer:imagemin'
			},
			configFiles: {
				files: [
					'Gruntfile.js',
					'package.json'
				],
				options: {
					reload: true
				},
				tasks: [
					'copy',
					'postcss',
					'cssmin',
					'newer:imagemin',
					'jshint',
					'browserify',
					'uglify',
					'watch'
				]
			}
		}
	});

	// TASKS =====================================/
	grunt.registerTask('default', [
		'copy',
		'postcss',
		'cssmin',
		'newer:imagemin',
		'jshint',
		'browserify',
		'uglify'
	]);
	grunt.registerTask('dev', [
		'newer:copy',
		'newer:postcss',
		'newer:cssmin',
		'newer:imagemin',
		'jshint',
		'newer:browserify',
		'newer:uglify',
		'watch'
	]);
};
