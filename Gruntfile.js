 // global module:false

var LIVERELOAD_PORT = 35729,
	lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT}),
	mountFolder = function (connect, dir) {
		return connect.static(require('path').resolve(dir));
	};
module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var config = {
		dev: 'dev',
		dist: 'dist'
	};
	
	grunt.initConfig({
		config: config,
		compass: {
			dev: {
				options: {
					config: 'config.rb'
				}
			}
		},
		watch: {
			compass: {
				options: {

				},
				files: ['sass/**/*.scss'],
				tasks: ['compass:dev']
			},
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'<%= config.dev %>/*.html',
					'{.tmp,<%= config.dev %>}/assets/css/{,*/}*.css',
					'{.tmp,<%= config.dev %>}/assets/js/{,*/}*.js',
					'<%= config.dev %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},
		clean: {
			server: '.tmp'
		},
		concurrent: {
			server: [
				'compass:dev'
			]
		},
		connect: {
			options: {
				port: 9000,
				base: config.dev+'/',
				hostname: 'localhost'
			},
			livereload:{
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, config.dev)
						];
					}
				}
			}
		},
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
			}
		},
	});

	grunt.registerTask('default', ['compass:dev','watch:compass']);
	grunt.registerTask('server', [
		'compass:dev',
		'clean:server',
		'concurrent:server',
		'connect:livereload',
		'open',
		'watch'
	]);

};
