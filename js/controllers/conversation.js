(function() {
    "use strict";
    var module = angular.module("XolotlConversation", ["XolotlColorGenerator", "XolotlDataService"]);

    module.controller("ConversationController", function($scope, $routeParams, $location, $filter,
        $rootScope, DataService, ColorGenerator) {

        $scope.number = $routeParams.number;
        $scope.messages = [];

        DataService.getAllContacts().then(function(contacts) {
            $scope.$apply(function() {
                $scope.contact = $filter("filter")(contacts, {number: $scope.number}, true)[0];
            });
        }, function(error) {
            console.error(error);
        });

        $rootScope.$on("messagesUpdated", function(messageEvent, args) {
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
                document.getElementById("end-of-message-anchor").scrollIntoView({
                    block: "end",
                    behavior: "smooth"
                });
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

        $scope.sendMessage = function() {
            var message = {
                number: $scope.number,
                body: $scope.message,
                isSelf: true,
                sentTime: Date.now(),
                status: "success"
            };
            DataService.addMessage(message);
            $scope.message = "";
        };

        $scope.openOptions = function() {
            $location.path("/options/" + $routeParams.number);
        };
    });
})();
