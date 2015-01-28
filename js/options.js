(function() {
    "use strict";
    var module = angular.module("XolotlOption", []);

    module.controller("OptionController", function($scope, $routeParams, $location) {

        console.log($routeParams.number);

        $scope.openConversation = function() {
            $location.path("/conversation/" + $routeParams.number);
        };

    });

})();
