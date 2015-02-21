(function() {
    "use strict";
    var module = angular.module("XolotlContacts", ["XolotlColorGenerator", "XolotlDataService"]);

    module.controller("ContactsController", function($scope, $location, $rootScope,
        ColorGenerator, DataService) {

        $scope.contextInput = "";

        $scope.loadContacts = function() {
            DataService.getAllContactsByLatestMessage().then(function(contacts) {
                contacts.forEach(function(contact) {
                    if (contact.mostRecentMessage !== 0) {
                        DataService.getMessage(contact.number, contact.mostRecentMessage).then(function(message) {
                            if (message) {
                                $scope.$apply(function() {
                                    contact.lastMessage = message.body;
                                });
                            }
                        });
                    }
                });
                $scope.$apply(function() {
                    $scope.contacts = contacts;
                    $scope.filterContacts();
                });
            }, function(error) {
                console.error(error);
            });
        };

        $scope.$watch("contextInput", function() {
            if ($scope.contacts) {
                $scope.filterContacts();
            }
        });

        $scope.$on("contactsUpdated", function() {
            $scope.loadContacts();
        });

        $scope.filterContacts = function() {
            var matchingText = $scope.contextInput;
            $scope.filteredContacts = _.filter($scope.contacts, function(contact) {
                return matchingText === "" || contact.name.indexOf(matchingText) > -1;
            });
        };

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

        $scope.loadContacts();
    });
})();
