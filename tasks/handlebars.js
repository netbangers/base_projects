module.exports = function(grunt) {
  grunt.config.set('handlebars', {
    compile: {
      options: {
        namespace: 'Handlebars.templates',
        processName: function(filePath) {
          return filePath.replace(/source\/handlebars\/(.*)(.handlebars)/, '$1').split('/').join('_').toLowerCase();
        }
      },
      files: {
       'source/handlebars/app.templates.js': [ 'source/handlebars/**/*.handlebars' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-handlebars');
};