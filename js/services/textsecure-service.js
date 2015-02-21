(function() {
    "use strict";
    var module = angular.module("XolotlTextSecureService", [
        "XolotlDataService",
        "XolotlMessageStatus",
        "XolotlTextSecureStorageService"
    ]);

    module.service("TextSecureService", function($rootScope, MessageStatus, TextSecureStorageService) {
        var textSecure = window.textsecure(TextSecureStorageService, "textsecure-service-staging.whispersystems.org", {
            connect: function(url) {
                var webSocket = new WebSocket(url);
                var wrappedWebSocket = {
                    send: webSocket.send.bind(webSocket)
                };
                webSocket.onmessage = function(event) {
                    var reader = new FileReader();
                    reader.onload = function(data) {
                        wrappedWebSocket.onmessage(data);
                    };
                    reader.readAsArrayBuffer(event.data);
                };
                return wrappedWebSocket;
            }
        });

        textSecure.onmessage = function(fromNumber, withMessage, timestamp) {
            $rootScope.$broadcast("newMessageReceived", {
                number: fromNumber,
                body: withMessage,
                isSelf: false,
                sentTime: timestamp,
                status: MessageStatus.RECEIVED
            });
        };

        textSecure.onreceipt = function(fromNumber, timestamp) {
            console.log("Receipt yey!");
        };

        this.sendMessage = function(number, message) {
            return textSecure.sendMessage(number, message);
        };

        this.requestVerificationCode = textSecure.requestVerificationCode;
        this.registerFirstDevice = textSecure.registerFirstDevice;

        window.handleReceiveMessage = textSecure.onmessage;
    });
})();
