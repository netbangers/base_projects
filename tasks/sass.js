module.exports = function(grunt) {
  grunt.config.set('sass', {
    dev: {
      options: {
        sourcemap: 'none',
        style: 'compressed',
        debugInfo: true
      },
      files: {
        'assets/css/style.css': 'source/sass/style.scss'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
};