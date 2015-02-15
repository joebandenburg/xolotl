(function() {
    "use strict";
    var module = angular.module("XolotlRegistrationFirstDevice", ["XolotlTextSecureService", "XolotlDataService"]);

    module.controller("RegistrationFirstDeviceController", function($scope, $location, TextSecureService, DataService) {
        $scope.pageClass = "registration-first-page dark";
        $scope.verificationCodeSent = false;

        var sendVerificationCode = function(method) {
            $scope.step1.$setSubmitted();
            if ($scope.step1.$valid) {
                $scope.loading = true;
                TextSecureService.requestVerificationCode($scope.phoneNumber, method).then(function() {
                    $scope.$apply(function() {
                        $scope.loading = false;
                        $scope.verificationCodeSent = true;
                    });
                });
            }
        };

        $scope.sendVerificationCodeCall = sendVerificationCode.bind("call");
        $scope.sendVerificationCodeSMS = sendVerificationCode.bind("sms");

        $scope.register = function() {
            $scope.step2.$setSubmitted();
            if ($scope.step2.$valid) {
                $scope.loading = true;
                $scope.verificationCodeSent = true;
                TextSecureService.registerFirstDevice($scope.phoneNumber, $scope.verificationCode).then(function() {
                    return DataService.putGeneralItem($scope.phoneNumber, "userNumber");
                }).then(function() {
                    $scope.$apply(function() {
                        $location.path("/contacts");
                    });
                });
            }
        };
    });

    module.directive("phoneNumber", function() {
        return {
            require: "ngModel",
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.phoneNumber = function(modelValue) {
                    try {
                        return window.phoneUtils.isValidNumber(modelValue);
                    } catch (e) {
                        return false;
                    }
                };
            }
        };
    });

    var verificationCodeRegexp = /^[0-9]{3}-?[0-9]{3}$/;
    module.directive("verificationCode", function() {
        return {
            require: "ngModel",
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.verificationCode = function(modelValue) {
                    return verificationCodeRegexp.test(modelValue);
                };
            }
        };
    });
})();
