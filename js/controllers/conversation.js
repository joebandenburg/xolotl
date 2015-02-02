(function() {
    "use strict";
    var module = angular.module("XolotlConversation", []);

    module.controller("ConversationController", function($scope, $routeParams, $location, $rootScope, ConversationService,
        ContactsService, ColorGenerator) {

        console.log($routeParams.number);

        $scope.number = $routeParams.number;

        $scope.contact = ContactsService.getContact($scope.number);

        $scope.messages = ConversationService.getConversation($scope.number);

        $scope.contactStyle = function(number) {
            return {
                "background" : ColorGenerator.randomHslString(number)
            };
        };

        $scope.messageStyle = function(number, isSelf) {
            if (isSelf) {
                return {};
            } else {
                return {
                    "border-top" : "1px solid " + ColorGenerator.randomHslString(number)
                };
            }
        };

        $scope.sendMessage = function() {
            $rootScope.$broadcast("newMessage", {
                message: $scope.message,
                number: $scope.number
            });
            $scope.messages.push({body: $scope.message, self: true, sentTime: Date.now()});
            $scope.message = "";
        };

        $scope.openOptions = function() {
            $location.path("/options/" + $routeParams.number);
        };
    });
})();
