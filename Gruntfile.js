module.exports = function(grunt) {
  require('./tasks/handlebars.js')(grunt);
  require('./tasks/sass.js')(grunt);
  require('./tasks/concat.js')(grunt);
  require('./tasks/uglify.js')(grunt);

  grunt.registerTask('default', ['handlebars', 'uglify', 'sass', 'concat']);
};