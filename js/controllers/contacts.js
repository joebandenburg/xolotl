(function() {
    "use strict";
    var module = angular.module("XolotlContacts", []);

    module.controller("ContactsController", function($scope, $location, $filter, $rootScope, ColorGenerator, ContactsService) {

        $scope.contextInput = "";

        $scope.$watch("contextInput", function(newValue, oldValue) {
            $scope.filteredContacts = ContactsService.getMatchingContacts($scope.contextInput);
        });

        $rootScope.$on("newMessage", function(messageEvent, args) {
            var obj = ContactsService.getContact(args.number)
            if (obj) {
                obj.lastMessage = args.message;
            }
        });

        $scope.addContact = function() {
            var data = $scope.contextInput ? $scope.contextInput : "";
            $location.path("/conversation/add/" + data);
        };

        $scope.contactStyle = function(number) {
            return {
                "background" : ColorGenerator.randomHslString(number)
            };
        };

        $scope.openConversation = function(contact) {
            $location.path("/contact/" + contact.number);
        };

        $scope.handleContext = function() {
            if ($scope.filteredContacts.length === 0) {
                $scope.addContact();
            } else {
                $scope.openConversation($scope.filteredContacts[0]);
            }
        };
    });
})();
