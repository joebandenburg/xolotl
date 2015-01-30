(function() {
    "use strict";
    var module = angular.module("XolotlOption", []);

    module.controller("OptionController", function($scope, $rootScope, $routeParams, $location) {

        $scope.contactNumber = $routeParams.number;

        $scope.deleteConversation = function() {
            var array = $rootScope.contacts;
            var length = array.length;
            for (var i = 0; i < length; i++) {
                if (array[i].number === $scope.contactNumber) {
                    $rootScope.contacts.splice(i, 1);
                }
            }
            $location.path("/contacts/");
        };

        $scope.openConversation = function() {
            $location.path("/contact/" + $scope.contactNumber);
        };

    });

})();
