(function() {
    "use strict";
    var module = angular.module("XolotlNotificationService", ["XolotlDataService"]);

    module.service("NotificationService", function($rootScope, $location, DataService) {
        var self = this;

        var windowId = "XolotlWindow";

        $rootScope.$on("newMessageReceived", function(event, message) {
            var appWindow = chrome.app.window.get(windowId);
            if (appWindow.isMinimized()) {
                DataService.getGeneralItem("flashingAttentionEnabled").then(function(config) {
                    if (config) {
                        appWindow.drawAttention();
                    }
                });
                DataService.getGeneralItem("notificationsEnabled").then(function(config) {
                    if (config) {
                        DataService.getContact(message.number).then(function(contact) {
                            if (contact) {
                                self.notify(contact.name, message);
                            } else {
                                self.notify(message.number, message);
                            }
                        }, function (error) {
                            console.error(error);
                        });
                    }
                });
            }
        });

        this.notify = function(name, message) {
            window.Notification.requestPermission(function(status) {
                var note = new window.Notification(name,
                    {
                        body: message.body
                    });
                note.onclick = function() {
                    var appWindow = chrome.app.window.get(windowId);
                    appWindow.show();
                    appWindow.clearAttention();
                    self.openConversation(message.number);
                };
            });
        };

        this.openConversation = function(number) {
            $rootScope.$apply(function() {
                $location.path("/contact/" + number);
            });
        };
    });
})();
