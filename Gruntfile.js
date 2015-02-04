module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-karma");

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
        },
        karma: {
            unit: {
                configFile: "karma.conf.js"
            }
        }
    });

    grunt.registerTask("test", ["jshint", "jscs", "karma"]);
    grunt.registerTask("default", ["test"]);
};
