(function() {
    'use strict';
    var app = angular.module('XolotlApp', ['ngRoute', 'XolotlContacts', 'XolotlConversation', 'XolotlOption']);

    app.config(function($routeProvider) {
        $routeProvider.when('/contacts', {
            templateUrl: 'partials/contacts.html',
            controller: 'ContactsController'
        });
        $routeProvider.when('/conversation/:number', {
            templateUrl: 'partials/conversation.html',
            controller: 'ConversationController'
        });
        $routeProvider.when('/options/:number', {
            templateUrl: 'partials/options.html',
            controller: 'OptionController'
        });
        $routeProvider.otherwise({
            redirectTo: '/contacts'
        });
    });
})();