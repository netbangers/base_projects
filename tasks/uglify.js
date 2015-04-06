module.exports = function(grunt) {
  grunt.config.set('uglify', {
    dev: {
      options: { sourceMap: false },
      src: 'source/handlebars/app.templates.js',
      dest: 'assets/js/app/app.templates-min.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};