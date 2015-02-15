(function() {
    "use strict";
    var module = angular.module("XolotlAddConversation", ["XolotlColorGenerator", "XolotlDataService"]);

    module.controller("AddConversationController",
        function($scope, $routeParams, $location, ColorGenerator, DataService) {
            $scope.contact = {
                name: "",
                number: ""
            };

            var isNumber = function(data) {
                return !isNaN(parseFloat(data)) && isFinite(data);
            };

            if (isNumber($routeParams.data)) {
                $scope.contact.number = $routeParams.data;
            } else {
                $scope.contact.name = $routeParams.data;
            }

            $scope.openOptions = function() {
                $location.path("/options/" + $routeParams.number);
            };

            $scope.contactStyle = function(number) {
                return {
                    "background" : ColorGenerator.randomHslString(number)
                };
            };

            $scope.confirm = function() {
                if ($scope.form.$valid) {
                    DataService.addContact({
                        name: $scope.contact.name,
                        number: $scope.contact.number,
                        mostRecentMessage: 0,
                        lastReadMessage: 0
                    }).then(function() {
                        $scope.$apply(function() {
                            $location.path("/contact/" + $scope.contact.number);
                        });
                    }, function(error) {
                        console.error("failed to add a contact ", error);
                    });
                }
            };
        });
})();
