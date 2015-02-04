module.exports = function(config) {
    config.set({
        frameworks: ["mocha", "chai"],

        files: [
            "bower_components/angular/angular.js",
            "bower_components/angular-mocks/angular-mocks.js",
            "bower_components/lodash/lodash.js",
            "js/**/*.js",
            "test/**/*.js"
        ],
        exclude: ["js/background.js"],
        browsers: ["Firefox"],
        client: {
            mocha: {
                reporter: 'html', // change Karma's debug.html to the mocha web reporter
                ui: 'bdd'
            }
        },
        singleRun: true
    });
};