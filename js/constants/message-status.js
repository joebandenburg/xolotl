(function() {
    "use strict";
    var module = angular.module("XolotlMessageStatus", []);

    module.constant("MessageStatus", {
        "saved" : {
            id: 0,
            value: "saved"
        },
        "sent" : {
            id: 1,
            value: "sent"
        },
        "received" : {
            id: 2,
            value: "received"
        },
        "failed" : {
            id: 3,
            value: "failed"
        }
    });

})();
