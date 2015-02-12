(function() {
    "use strict";
    var module = angular.module("XolotlAddConversation", ["XolotlColorGenerator", "XolotlDataService"]);

    module.controller("AddConversationController",
        function($scope, $routeParams, $location, ColorGenerator, DataService) {

            $scope.contact = {
                name: "",
                number: ""
            };

            $scope.location = "";

            var phoneUtils = window.phoneUtils;

            DataService.getGeneralItem("userCountryCode").then(function(countryCode) {
                $scope.$apply(function() {
                    $scope.location = countryCode;
                });
            });

            var isNumber = function(data) {
                return !isNaN(parseFloat(data)) && isFinite(data);
            };

            if (isNumber($routeParams.data)) {
                $scope.contact.number = $routeParams.data;
            } else {
                $scope.contact.name = $routeParams.data;
            }

            $scope.contactStyle = function(number) {
                return {
                    "background" : ColorGenerator.randomHslString(number)
                };
            };

            $scope.cancel = function() {
                $location.path("/contacts");
            };

            var isPhoneNumberValid = function(number) {
                return number && isE164Number(number) || isValidNumberForRegion(number, $scope.location);
            };

            var isNameValid = function(name) {
                return name && name !== "";
            };

            var isE164Number = function(input) {
                try {
                    return phoneUtils.isValidNumber(input) && (phoneUtils.formatE164(input) === input);
                } catch (e) {
                    return false;
                }
            };

            var isValidNumberForRegion = function(number, region) {
                try {
                    return phoneUtils.isValidNumberForRegion(number, region);
                } catch (e) {
                    return false;
                }
            };

            $scope.confirm = function() {
                $scope.tryingToConfirm = true;
                if (!isNameValid($scope.contact.name)) {
                    $scope.currentError = "nameError";
                    return;
                }
                if (!isPhoneNumberValid($scope.contact.number)) {
                    $scope.currentError = "phoneNumberError";
                    return;
                }
                DataService.addContact({
                    name: $scope.contact.name,
                    number: $scope.contact.number,
                    mostRecentMessage: 0,
                    lastReadMessage: 0
                }).then(function() {
                    $scope.$apply(function() {
                        $location.path("/contact/" + $scope.contact.number);
                    });
                }, function() {
                    $scope.currentError = "dbError";
                });
            };
        });
})();
