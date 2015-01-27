(function() {
    'use strict';
    var module = angular.module('XolotlContacts', ['XolotlAppEvents']);

    module.controller('ContactsController', function($scope) {
        $scope.contacts = [
        {
            name: "Troy McClure",
            number: "123976976876"
        },
        {
            name: "Sea Captain",
            number: "456786767867"
        },
        {
            name: "",
            number: "4576455464564"
        }];

        $scope.inputNumber = ""

        var isValidNumber = function(number) {
            // todo
            return true;
        };

        $scope.addContact = function() {
            var num = $scope.inputNumber;
            if (isValidNumber(num)) {
                $scope.contacts.push({name: "", number: num})
                $scope.inputNumber = "";
            }
        };

        $scope.openConversation = function(contact) {
            chrome.app.window.create('conversation.html', {
                'id': contact.number,
                innerBounds: {
                    width: 300,
                    height: 500,
                    minWidth: 300,
                    minHeight: 500
                }//,
            //    frame: "none"
              });
        };


    });
})();