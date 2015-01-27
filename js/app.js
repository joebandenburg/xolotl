(function() {
    'use strict';
    var app = angular.module('XolotlApp', ['ngRoute', 'XolotlContacts', 'XolotlConversation']);

    app.config(function($routeProvider) {
        $routeProvider.when('/contacts', {
            templateUrl: 'partials/contacts.html',
            controller: 'ContactsController'
        });
        $routeProvider.when('/conversation/:number', {
            templateUrl: 'partials/conversation.html',
            controller: 'ConversationController'
        });
        $routeProvider.otherwise({
            redirectTo: '/contacts'
        });
    });
})();