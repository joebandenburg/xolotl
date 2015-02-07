(function() {
    "use strict";
    var module = angular.module("XolotlMessageStatus", []);

    module.constant("MessageStatus", {
        "SAVED" : "saved",
        "SENT" : "sent",
        "RECEIVED" : "received",
        "FAILED" : "failed"
    });

})();
