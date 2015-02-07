(function() {
    "use strict";
    var module = angular.module("XolotlAddConversation", ["XolotlColorGenerator", "XolotlDataService"]);

    module.controller("AddConversationController",
        function($scope, $routeParams, $location, ColorGenerator, DataService) {

            $scope.data = $routeParams.data;

            $scope.contact = {
                name: "",
                number: ""
            };

            $scope.tryingToConfirm = false;
            $scope.invalidInput = "";

            var isNumber = function(data) {
                return !isNaN(parseFloat(data)) && isFinite(data);
            };

            if (isNumber($scope.data)) {
                $scope.contact.number = $scope.data;
            } else {
                $scope.contact.name = $scope.data;
            }

            $scope.openOptions = function() {
                $location.path("/options/" + $routeParams.number);
            };

            $scope.contactStyle = function(number) {
                return {
                    "background" : ColorGenerator.randomHslString(number)
                };
            };

            $scope.cancel = function() {
                $location.path("/contacts");
            };

            var isContactValid = function(contact) {
                if (!contact.name) {
                    $scope.invalidInput = contact.name;
                    return false;
                }
                if (!contact.number) {
                    $scope.invalidInput = contact.number;
                    return false;
                }
                if (!isNumber(contact.number)) {
                    $scope.invalidInput = contact.number;
                    return false;
                }
                return true;
            };

            $scope.isValidInput = function(input) {
                if (!$scope.tryingToConfirm) {
                    return false;
                } else {
                    return $scope.invalidInput === input;
                }
            };

            $scope.confirm = function() {
                $scope.tryingToConfirm = true;
                if (isContactValid($scope.contact)) {
                    DataService.addContact({
                        name: $scope.contact.name,
                        number: $scope.contact.number,
                        lastMessage: ""
                    }).then(function() {
                        console.log("successfully added a contact");
                        $scope.$apply(function() {
                            $location.path("/contacts");
                        });
                    }, function(error) {
                        console.error("failed to add a contact " + error);
                    });
                }
            };
        });
})();
