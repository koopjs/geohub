module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [ './*.js' ],
      options: {
        globals: {
          node: true
        }
      }
    },

    vows: {
      all: {
        options: {
          reporter: 'spec',
          verbose: false,
          colors: true
        },
        src: [ 'tests/*.js' ]
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-vows')

  grunt.registerTask('default', [ 'jshint', 'vows' ])
}
