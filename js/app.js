(function() {
    "use strict";
    var app = angular.module("XolotlApp",
        ["ngRoute", "XolotlContacts", "XolotlConversation", "XolotlOption",
        "XolotlAddConversation", "XolotlColorGenerator",
        "XolotlEnter", "XolotlDatabaseService",]);

    app.config(function($routeProvider) {
        $routeProvider.when("/contacts", {
            templateUrl: "partials/contacts.html",
            controller: "ContactsController"
        });
        $routeProvider.when("/conversation/add/:data", {
            templateUrl: "partials/add-conversation.html",
            controller: "AddConversationController"
        });
        $routeProvider.when("/contact/:number", {
            templateUrl: "partials/conversation.html",
            controller: "ConversationController"
        });
        $routeProvider.when("/options/:number", {
            templateUrl: "partials/options.html",
            controller: "OptionController"
        });
        $routeProvider.otherwise({
            redirectTo: "/contacts"
        });
    });

})();
