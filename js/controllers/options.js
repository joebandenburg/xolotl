(function() {
    "use strict";
    var module = angular.module("XolotlOption", []);

    module.controller("OptionController", function($scope, $routeParams, $location,
        ContactsService, ConversationService) {

        $scope.contactNumber = $routeParams.number;

        $scope.deleteConversation = function() {
            ConversationService.deleteConversation($scope.contactNumber);
            ContactsService.deleteContact($scope.contactNumber);
            $location.path("/contacts/");
        };

        $scope.openConversation = function() {
            $location.path("/contact/" + $scope.contactNumber);
        };

    });

})();
