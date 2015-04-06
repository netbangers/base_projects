module.exports = function(grunt) {
  grunt.config.set('uglify', {
    templates: {
      options: { sourceMap: false },
      src: 'source/handlebars/app.templates.js',
      dest: 'assets/js/app/app.templates-min.js'
    },
    core: {
      options: {
        sourceMap: true,
        drop_console: false
      },
      files: {
        'assets/js/app/app.core-min.js': ['source/js/core/core.js', 'source/js/core/core.extend.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};