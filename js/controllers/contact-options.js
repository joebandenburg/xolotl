(function() {
    "use strict";
    var module = angular.module("XolotlOption", ["XolotlDataService"]);

    module.controller("OptionController", function($scope, $routeParams, $location,
        DataService) {

        $scope.contactNumber = $routeParams.number;

        DataService.getContact($scope.contactNumber).then(function(contact) {
            $scope.$apply(function() {
                $scope.contact = contact;
            });
        }, function(error) {
            console.error(error);
        });

        $scope.deleteConversation = function() {
            DataService.deleteContact($scope.contactNumber)
            .then(function() {
                return DataService.deleteMessages($scope.contactNumber);
            })
            .then(function() {
                $scope.$apply(function() {
                    $location.path("/contacts/");
                });
            },
            function(error) {
                console.error(error);
            });
        };

        $scope.openConversation = function() {
            $location.path("/contact/" + $scope.contactNumber);
        };
    });
})();
