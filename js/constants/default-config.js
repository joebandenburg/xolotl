(function() {
    "use strict";
    var module = angular.module("XolotlDefaultConfig", []);

    module.constant("DefaultConfig", {
        "notificationsEnabled" : true,
        "flashingAttentionEnabled" : true
    });

})();
