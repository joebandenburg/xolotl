(function() {
    "use strict";
    var module = angular.module("XolotlRegistration", ["XolotlDataService"]);

    module.controller("RegistrationController", function($scope, $location,
        DataService) {

        $scope.userNumber = "";

        $scope.register = function() {
            DataService.putGeneralItem($scope.userNumber, "userNumber");
            $location.path("/contacts");
        };
    });
})();
