module.exports = function(grunt) {
  grunt.config.set('watch', {
    js: {
      files: ['source/js/**/*.js'],
      tasks: ['concat', 'uglify']
    },
    handlebars: {
      files: ['source/handlebars/**/*.handlebars'],
      tasks: ['handlebars:compile', 'uglify']
    },
    sass: {
      files: ['source/sass/**/*.scss'],
      tasks: ['sass']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};