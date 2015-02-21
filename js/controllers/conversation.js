(function() {
    "use strict";
    var module = angular.module("XolotlConversation", ["XolotlColorGenerator", "XolotlDataService",
        "XolotlMessageStatus"]);

    module.controller("ConversationController", function($scope, $routeParams, $location, $filter,
        $rootScope, DataService, ColorGenerator, MessageStatus) {

        $scope.number = $routeParams.number;
        $scope.messages = [];

        DataService.getContact($scope.number).then(function(contact) {
            $scope.$apply(function() {
                $scope.contact = contact;
            });
        }, function(error) {
            console.error(error);
        }).then(function() {
            $scope.contact.lastReadMessage = $scope.contact.mostRecentMessage;
            DataService.updateContact($scope.contact);
        });

        $scope.$on("messagesUpdated", function(messageEvent, args) {
            if (args.number === $scope.number) {
                $scope.updateMessages();
            }
        });

        $scope.updateMessages = function() {
            DataService.getAllMessages($scope.number).then(function(results) {
                $scope.$apply(function () {
                    $scope.messages = results;
                });
            }, function(error) {
                console.error(error);
            }).then(function() {
                if ($scope.messages.length > 0) {
                    $scope.contact.mostRecentMessage = $scope.messages[0].sentTime;
                    $scope.contact.lastReadMessage = $scope.messages[0].sentTime;
                }
                DataService.updateContact($scope.contact);
            });
        };
        $scope.updateMessages();

        $scope.contactStyle = function(number) {
            return {
                "background" : ColorGenerator.randomHslString($scope.number)
            };
        };

        $scope.messageStyle = function(number, isSelf) {
            if (isSelf) {
                return {};
            } else {
                return {
                    "border-top" : "1px solid " + ColorGenerator.randomHslString($scope.number)
                };
            }
        };

        $scope.showStatus = function(message) {
            return message.isSelf &&
                (message.status !== MessageStatus.SENT || message.status !== MessageStatus.RECEIVED);
        };

        $scope.showTimestamp = function(message) {
            return message.status === MessageStatus.SENT || message.status === MessageStatus.RECEIVED;
        };

        $scope.showReceipt = function(message) {
            return message.isSelf && message.status === MessageStatus.RECEIVED;
        };

        $scope.status = function(message) {
            switch (message.status) {
                case MessageStatus.SAVED:
                    return "Sending...";
                case MessageStatus.FAILED:
                    return "Failed";
            }
        };

        $scope.sendMessage = function() {
            var message = {
                number: $scope.number,
                body: $scope.message,
                isSelf: true,
                sentTime: Date.now(),
                status: MessageStatus.SAVED
            };
            DataService.addMessage(message);
            $scope.message = "";
        };

        $scope.openOptions = function() {
            $location.path("/options/" + $routeParams.number);
            return false;
        };

        $scope.focus = function() {
            var el = document.getElementById("send-message");
            el.focus();
        };

        $scope.focus();
    });
})();
