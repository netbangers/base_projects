module.exports = function(grunt) {
  grunt.config.set('concat', {
    extend: {
      options: {
        banner: '(function(Core) {\r\'use strict\';',
        separator: '\r',
        footer: '})(Core);'
      },
      src: [ 'source/js/core/extend/**/*.js' ],
      dest: 'source/js/core/core.extend.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};