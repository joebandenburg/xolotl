(function() {
    "use strict";
    var module = angular.module("XolotlRegistration", ["XolotlDataService", "XolotlTextSecureService"]);

    module.controller("RegistrationController", function($scope, $location,
        DataService, TextSecureService) {

        var phoneUtils = window.phoneUtils;
        $scope.countryCodes = _.sortBy([{
            id: "AT",
            label: "Austria"
        }, {
            id: "AU",
            label: "Australia"
        }, {
            id: "BE",
            label: "Belgium"
        }, {
            id: "CA",
            label: "Canada"
        }, {
            id: "CH",
            label: "Switzerland"
        }, {
            id: "CZ",
            label: "Czech Republic"
        }, {
            id: "DE",
            label: "Germany"
        }, {
            id: "DK",
            label: "Denmark"
        }, {
            id: "GB",
            label: "Great Britain"
        }, {
            id: "US",
            label: "United States"
        }, {
            id: "IE",
            label: "Ireland"
        }, {
            id: "FR",
            label: "France"
        }, {
            id: "ES",
            label: "Spain"
        }, {
            id: "IT",
            label: "Italy"
        }, {
            id: "NL",
            label: "Netherlands"
        }, {
            id: "PT",
            label: "Portugal"
        }, {
            id: "PL",
            label: "Poland"
        }, {
            id: "IS",
            label: "Iceland"
        }, {
            id: "NO",
            label: "Norway"
        }, {
            id: "SE",
            label: "Sweden"
        }, {
            id: "FI",
            label: "Finland"
        }, {
            id: "RU",
            label: "Russia"
        }], "label");

        $scope.userNumber = "";
        $scope.countryCode = "";
        $scope.currentError = "";
        $scope.status = "";

        var sendCode = function(number, country) {
            $scope.currentError = "";
            $scope.status = "verification";
            var fullNumber = isE164Number(number) ? number : phoneUtils.formatE164(number, country);
            TextSecureService.requestVerificationCode(fullNumber).then(function() {
                $scope.currentError = "";
                $scope.$apply(function() {
                    $scope.status = "success";
                });
            }, function() {
                $scope.currentError = "verification";
            });
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

        var isValid = function(number, country) {
            return isE164Number(number) || isValidNumberForRegion(number, country);
        };

        $scope.validateNumberAndSendCode = function() {
            var number = $scope.userNumber;
            var country = $scope.countryCode;
            if (isValid(number, country)) {
                $scope.currentError = "";
                sendCode(number, country);
            } else {
                $scope.currentError = "validation";
            }
        };

        $scope.verifyCodeAndRegister = function() {
            var code = $scope.secretCode;
            var number = $scope.userNumber;
            var country = $scope.countryCode;
            if (!isValid(number, country)) {
                $scope.currentError = "validation";
                return;
            }
            if (!code || code === "") {
                $scope.currentError = "nocode";
                return;
            }
            var internationalNumber = isE164Number(number) ? number : phoneUtils.formatE164(number, country);
            TextSecureService.registerFirstDevice(internationalNumber, code).then(function() {
                DataService.putGeneralItem(number, "userNumber");
                DataService.putGeneralItem(phoneUtils.getRegionCodeForNumber(internationalNumber), "userCountryCode");
                DataService.putGeneralItem(internationalNumber, "userFullNumber");
                $location.path("/contacts");
            }, function() {
                $scope.currentError = "registration";
            });
        };
    });
})();
