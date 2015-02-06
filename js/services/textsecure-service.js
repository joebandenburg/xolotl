(function() {
    "use strict";
    var module = angular.module("XolotlTextSecureService", ["XolotlDataService"]);

    module.service("TextSecureService", function($rootScope) {
        var self = this;

        //var textSecure = new TextSecure();
        var textSecure = {
            sendMessage: function(number, message) {
                setTimeout(function() {
                    handleReceiveMessage(number, message);
                }, 2000);
                return new Promise(function(resolve, reject) {
                    setTimeout(resolve, 1000);
                });
            },
        };

        textSecure.onreceivemessage = handleReceiveMessage;

        var handleReceiveMessage = function(fromNumber, withMessage) {
            $rootScope.$broadcast("newMessageReceived", {
                number: fromNumber,
                body: withMessage,
                isSelf: false,
                sentTime: Date.now(),
                status: "success"
            });
        };

        this.sendMessage = function(number, message) {
            return textSecure.sendMessage(number, message);
        };
    });
})();
