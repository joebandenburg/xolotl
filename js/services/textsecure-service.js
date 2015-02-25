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
                    reader.onload = function() {
                        wrappedWebSocket.onmessage(reader.result);
                    };
                    reader.readAsArrayBuffer(event.data);
                };
                webSocket.onopen = function() {
                    if (wrappedWebSocket.onopen) {
                        wrappedWebSocket.onopen.apply(this, arguments);
                    }
                };
                webSocket.onclose = function() {
                    if (wrappedWebSocket.onclose) {
                        wrappedWebSocket.onclose.apply(this, arguments);
                    }
                };
                webSocket.onerror = function() {
                    if (wrappedWebSocket.onerror) {
                        wrappedWebSocket.onerror.apply(this, arguments);
                    }
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
            $rootScope.$broadcast("deliveryReceiptReceived", {
                number: fromNumber,
                sentTime: timestamp
            });
        };

        this.sendMessage = function(number, message, timestamp) {
            return textSecure.sendMessage(number, message, timestamp);
        };

        this.requestVerificationCode = textSecure.requestVerificationCode;
        this.registerFirstDevice = textSecure.registerFirstDevice;

        window.handleReceiveMessage = textSecure.onmessage;
    });
})();
