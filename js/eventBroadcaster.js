var app = angular.module('XolotlAppEvents', []);

app.factory('eventBroadcaster', function eventBroadcasterFactory($rootScope) {
    chrome.runtime.onMessage.addListener(function(message) {
        // TODO: Is the $apply actually necessary?
        $rootScope.$apply(function() {
            $rootScope.$emit(message.name, message.body);
        });
    });

    var eventBroadcaster = {};
    eventBroadcaster.emit = function(name, body) {
        chrome.runtime.sendMessage({
            name: name,
            body: body
        });
    };
    return eventBroadcaster;
});