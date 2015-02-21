(function() {
    "use strict";
    var app = angular.module("XolotlApp",
        ["ngRoute", "ngAnimate", "XolotlContacts", "XolotlConversation", "XolotlOption",
        "XolotlAddConversation", "XolotlNotificationService",
        "XolotlAppOption", "XolotlRegistration", "XolotlDataService", "XolotlRegistrationFirstDevice"]);

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
        $routeProvider.when("/registration", {
            templateUrl: "partials/registration.html",
            controller: "RegistrationController"
        });
        $routeProvider.when("/registration/first", {
            templateUrl: "partials/registration-first-device.html",
            controller: "RegistrationFirstDeviceController"
        });
        $routeProvider.otherwise({
            redirectTo: "/contacts"
        });
    });
    app.value("dbName", "XolotlDatabase");

    app.run(function(NotificationService, DataService, $location) {
        //causes an instance of the notification service to be created

        // early check to see if registration is required
        DataService.getGeneralItem("userNumber").then(function(userNumber) {
            if (!userNumber) {
                $location.path("/registration");
            }
        });
    });

})();
