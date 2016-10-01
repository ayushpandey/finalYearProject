var fs = require('fs');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */',
        separator: ' ',
        sourceMap: true
      },
      bootstrap: {
        src: ['remote/js/*.js', 'remote/js/plugins/*.js'],
        dest: 'public/js/bootstrap.js'
      },
      vendor: {
        src: ['remote/js/vendor/jquery.min.js', 'remote/js/vendor/*.js'],
        dest: 'public/js/vendor.js'
      },
      background: {
        src: ['remote/background/js/uuid.min.js', 'remote/background/js/fdb-core+persist.min.js', 'remote/background/js/background.js'],
        dest: 'public/js/background.js'
      },
      vendorCss: {
        src: [
          'remote/css/vendor/font-awesome.min.css',
          'remote/css/vendor/datetimepicker.css',
          'remote/css/vendor/bootstrap.min.css',
          'remote/css/vendor/bootstrap-datepicker.css',
          'remote/css/vendor/todc-bootstrap.min.css',
          'remote/css/vendor/todc-datetimepicker.css'],
        dest: 'public/css/vendor.css'
      },
      css: {
        src: ['remote/css/*.css'],
        dest: 'public/css/emailTracking.css'
      }
    },
    uglify: {
      options : {
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      bootstrap: {
        files: {
          'public/js/bootstrap.js': ['public/js/bootstrap.js']
        }
      },
      background: {
        files: {
          'public/js/background.min.js': ['public/js/background.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['fonts/**', 'remote/**', 'package.json'],
        tasks: ['dev'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');


  grunt.registerTask('dev', function () {
    grunt.task.run(['concat:bootstrap', 'concat:background', 'concat:vendor', 'concat:vendorCss', 'concat:css']);

    fs.writeFileSync('public/html/background.html', '<html><head></head><body><script src="../js/background.js"></script></body></html>');

    grunt.task.run(['watch']);
  });

  grunt.registerTask('prod', function () {
    console.log('Creating production files..');

    grunt.task.run(['concat:bootstrap', 'uglify:bootstrap', 'concat:background', 'uglify:background', 'concat:vendor', 'concat:vendorCss', 'concat:css']);

});
}
