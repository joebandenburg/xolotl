(function() {
    "use strict";
    var module = angular.module("XolotlContacts", ["XolotlColorGenerator", "XolotlDataService"]);

    module.controller("ContactsController", function($scope, $location, $rootScope, $filter,
        ColorGenerator, DataService) {

        $scope.contextInput = "";

        DataService.getAllContacts().then(function(data) {
            $scope.$apply(function() {
                $scope.contacts = data;
                $scope.filteredContacts = $filter("filter")($scope.contacts, $scope.contextInput);
            });
        }, function(error) {
            console.error(error);
        });

        $scope.$watch("contextInput", function(newValue, oldValue) {
            if ($scope.contacts) {
                $scope.filteredContacts = $filter("filter")($scope.contacts, $scope.contextInput);
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
