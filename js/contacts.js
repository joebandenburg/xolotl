(function() {
    "use strict";
    var module = angular.module("XolotlContacts", []);

    module.controller("ContactsController", function($scope, $location) {
        $scope.contacts = [
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

        $scope.inputNumber = "";

        var isValidNumber = function(number) {
            // todo
            return true;
        };

        $scope.addContact = function() {
            var num = $scope.inputNumber;
            if (isValidNumber(num)) {
                $scope.contacts.push({name: "", number: num});
                $scope.inputNumber = "";
            }
        };

        var hashCode = function(str) {
          var hash = 0, i, chr, len;
          if (str.length == 0) return hash;
          for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
          }
          return hash;
        };

        var randomHslString = function(seed) {
            return "hsl(" + (hashCode(seed) % 360) + ", 50%, 50%)";
        };

        $scope.contactStyle = function(contact) {
            return { "background" : randomHslString(contact.number)}
        };

        $scope.openConversation = function(contact) {
            $location.path("/conversation/" + contact.number);
        };
    });
})();
