(function() {
    "use strict";
    var module = angular.module("XolotlAppOption", ["XolotlDataService"]);

    module.controller("AppOptionController", function($scope, $routeParams, $location,
        DataService) {

        $scope.contactNumber = $routeParams.number;

        $scope.loadConfig = function() {
            $scope.loadItem("notificationsEnabled");
            $scope.loadItem("flashingAttentionEnabled");
        };

        $scope.loadItem = function(item) {
            DataService.getGeneralItem(item).then(function(config) {
                console.log("config loaded");
                $scope.$apply(function() {
                    $scope[item] = config;
                });
            }).then(function() {
                $scope.$watch(item, function(newValue, oldValue) {
                    console.log("caught change");
                    DataService.putGeneralItem(newValue, item);
                });
            });
        };

        $scope.back = function() {
            $location.path("/contacts");
        };
    });

})();
