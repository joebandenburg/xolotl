module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");

    grunt.initConfig({
        jshint: {
            all: {
                src: ["Gruntfile.js", "js/**/*.js"],
                options: {
                    jshintrc: true
                }
            }
        },
        jscs: {
            all: {
                src: ["Gruntfile.js", "js/**/*.js"]
            }
        }
    });

    grunt.registerTask("test", ["jshint", "jscs"]);
    grunt.registerTask("default", ["test"]);
};
