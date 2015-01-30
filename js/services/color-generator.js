(function() {
    "use strict";
    var module = angular.module("XolotlColorGenerator", []);

    module.service("ColorGenerator", function() {

        var hashCode = function(str) {
            var hash = 0;
            var i = 0;
            var chr = 0;
            var len = 0;
            if (str.length === 0) {
                return hash;
            }
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };

        this.randomHslString = function(seed) {
            return "hsl(" + (hashCode(seed) % 360) + ", 50%, 50%)";
        };
    });
})();
