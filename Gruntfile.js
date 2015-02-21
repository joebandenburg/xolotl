module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-karma");

    grunt.initConfig({
        sass: {
            all: {
                files: {
                    "css/main.css": "css/main.scss"
                },
                options: {
                    sourceMap: true
                }
            }
        },
        jshint: {
            all: {
                src: ["js/**/*.js"],
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

    grunt.registerTask("build", ["sass"]);
    grunt.registerTask("check", ["build", "jshint", "jscs"]);
    grunt.registerTask("test", ["check", "karma"]);
    grunt.registerTask("default", ["test"]);
};
