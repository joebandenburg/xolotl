(function() {
    "use strict";
    var module = angular.module("XolotlConversationService", []);

    module.service("ConversationService", function($filter) {

        var conversations = {
            "123456789": [
            {
                body: "Hello, how are you?",
                self: false,
                status: "sending...",
                sentTime: 1422459294117
            },
            {
                body: "I'm, fine thanks. You?",
                self: true,
                status: "failed",
                sentTime: 1422459814117
            },
            {
                body: "no complaints",
                self: false,
                status: "sent",
                sentTime: 1422459894117
            },
            {
                body: "Hi, I'm Troy McCLure, you might remember me from such conversations as, are you free tonight?",
                self: false,
                status: "sent",
                sentTime: 1422559894117
            }],
            "+44277234223" : [
            {
                body: "I'm a teapot, short and stout. Here's my handle and here's my spout",
                self: false,
                status: "sending...",
                sentTime: 1423459294117
            },
            {
                body: "row row row your boat",
                self: true,
                status: "sent",
                sentTime: 1423469294117
            }],
            "4576455464564" : [
            {
                body: "Is that you?",
                self: false,
                status: "sending...",
                sentTime: 1423459294117
            }]
        };

        this.getConversation = function(number) {
            var conversation = conversations[number];
            if (!conversation) {
                conversations[number] = [];
            }
            return conversations[number];
        };

        this.addMessage = function(number, message, isSelf) {
            this.getConversation(number).push(
                {
                    body: message,
                    self: isSelf,
                    status: "sent",
                    sentTime: Date.now()
                });
        };

        this.deleteConversation = function(num) {
            conversations[num] = [];
        };
    });
})();
