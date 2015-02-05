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
                }, 1000);
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
            // todo reject promise if failed
            return textSecure.sendMessage(number, message);
        };
    });
})();
