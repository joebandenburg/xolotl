(function() {
    "use strict";
    var module = angular.module("XolotlOption", []);

    module.controller("OptionController", function($scope, $routeParams, $location,
        DatabaseService) {

        $scope.contactNumber = $routeParams.number;

        $scope.deleteConversation = function() {
            DatabaseService.deleteContact($scope.contactNumber)
            .then(function() {
                    console.log("contact deleted");
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
