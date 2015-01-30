(function() {
    "use strict";
    var module = angular.module("XolotlContactsService", []);

    module.service("ContactsService", function($filter) {

        var contacts = [
            {
                name: "Troy McClure",
                number: "123456789",
                lastMessage: "Hi, I'm Troy McCLure, you might remember me from such conversations as," +
                "are you free tonight?"
            },
            {
                name: "Joe Bandenburg",
                number: "+44277234223",
                lastMessage: "I'm a teapot, short and stout, here's my"
            },
            {
                name: "Professor Frink",
                number: "456786767867",
                lastMessage: "axiomatic"
            },
            {
                name: "",
                number: "4576455464564",
                lastMessage: "Is that you?"
            }];

        this.addContact = function(contact) {
            contacts.push(contact);
        };

        this.getAllContacts = function() {
            return contacts;
        };

        this.getContact = function(num) {
            return $filter("filter")(contacts, {number: num}, true)[0];
        };

        this.getMatchingContacts = function(keyword) {
            return $filter("filter")(contacts, keyword);
        };

        this.deleteContact = function(num) {
            var array = contacts;
            var length = array.length;
            for (var i = 0; i < length; i++) {
                if (array[i].number === num) {
                    contacts.splice(i, 1);
                    return;
                }
            }
        };
    });
})();
