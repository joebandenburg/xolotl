(function() {
    "use strict";
    var app = angular.module("XolotlApp",
        ["ngRoute", "XolotlContacts", "XolotlConversation", "XolotlOption",
        "XolotlAddConversation", "XolotlEnter", "XolotlNotificationService",
        "XolotlAppOption"]);

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
            templateUrl: "partials/contact-options.html",
            controller: "OptionController"
        });
        $routeProvider.when("/app-options", {
            templateUrl: "partials/app-options.html",
            controller: "AppOptionController"
        });
        $routeProvider.otherwise({
            redirectTo: "/contacts"
        });
    });
    app.value("dbName", "XolotlDatabase");

    app.run(function(NotificationService) {
        //causes an instance of the service to be created
    });

})();
