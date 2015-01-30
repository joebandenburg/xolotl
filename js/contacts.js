(function() {
    "use strict";
    var module = angular.module("XolotlContacts", []);

    module.controller("ContactsController", function($scope, $rootScope, $location, $filter, ColorGenerator) {
        if (!$rootScope.contacts) {
            $rootScope.contacts = [
            {
                name: "Troy McClure",
                number: "123976976876",
                lastMessage: "Hi, I'm Troy McCLure, you might rlorem sdfsdfs sdf sdf sdf sdfsdf sdfs dfs dfsdfsdfs"
            },
            {
                name: "Joe Bandenburg",
                number: "+44277234223",
                lastMessage: "I'm a teapot, short and stout, here's my"
            },
            {
                name: "Sea Captain",
                number: "456786767867",
                lastMessage: "Arrrgh, that be true"
            },
            {
                name: "",
                number: "4576455464564",
                lastMessage: "Is that you?"
            }];
        }

        $scope.contextInput = "";

        $scope.$watch("contextInput", function(newValue, oldValue) {
            $scope.filteredContacts = $filter("filter")($rootScope.contacts, $scope.contextInput);
        });

        var isValidNumber = function(number) {
            // todo
            return true;
        };

        $scope.addContact = function() {
            console.log("adding contact " + $scope.contextInput);
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
