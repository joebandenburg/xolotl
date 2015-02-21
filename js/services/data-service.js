(function() {
    "use strict";
    var module = angular.module("XolotlDataService", ["XolotlDatabaseService", "XolotlTextSecureService",
        "XolotlMessageStatus"]);

    module.service("DataService", function($rootScope, DatabaseService, TextSecureService, MessageStatus) {
        var self = this;

        $rootScope.$on("newMessageReceived", function(event, message) {
            DatabaseService.addEntity("messageStore", message).then(function() {
                $rootScope.$broadcast("messagesUpdated", {number: message.number});
                self.getContact(message.number).then(function(contact) {
                    if (!contact) {
                        contact = {
                            name: "",
                            number: message.number,
                            mostRecentMessage: message.sentTime,
                            lastReadMessage: 0
                        };
                    } else {
                        contact.mostRecentMessage = message.sentTime;
                    }
                    return self.updateContact(contact);
                });
            });
        });

        $rootScope.$on("deliveryReceiptReceived", function(event, data) {
            self.getMessage(data.number, data.sentTime).then(function(message) {
                message.status = MessageStatus.RECEIVED;
                self.updateMessage(message);
            });
        });

        /*
            message = {
                number: string,
                body: string,
                isSelf: boolean,
                sentTime: int,
                status: string
            };
        */
        this.getAllMessages = function(number) {
            return DatabaseService.inTransaction(["messageStore"], function(messageStore) {
                var index = messageStore.index("number");
                var singleKeyRange = IDBKeyRange.only(number);
                return DatabaseService.getDataObjects(index, singleKeyRange, "prev");
            });
        };

        this.getMessage = function(number, sentTime) {
            return DatabaseService.inTransaction(["messageStore"], function(messageStore) {
                var index = messageStore.index("number, sentTime");
                return DatabaseService.getDataObject(index, [number, sentTime]);
            });
        };

        this.addMessage = function(message) {
            return DatabaseService.addEntity("messageStore", message).then(function() {
                $rootScope.$broadcast("messagesUpdated", {number: message.number});
                return TextSecureService.sendMessage(message.number, message.body, message.sentTime);
            }).then(function() {
                message.status = MessageStatus.SENT;
                return self.updateMessage(message);
            }, function(error) {
                // update db with failed
                // show error in ui
                console.error(error);
                message.status = MessageStatus.FAILED;
                return self.updateMessage(message);
            });
        };

        /*
            contact = {
                name: string,
                number: string,
                mostRecentMessage: number,
                lastReadMessage: number
            }
        */
        this.getAllContacts = function() {
            return DatabaseService.inTransaction(["contactStore"], function(contactStore) {
                var index = contactStore.index("name");
                return DatabaseService.getDataObjects(index);
            });
        };

        this.getAllContactsByLatestMessage = function() {
            return DatabaseService.inTransaction(["contactStore"], function(contactStore) {
                var index = contactStore.index("mostRecentMessage");
                return DatabaseService.getDataObjects(index, null, "prev");
            });
        };

        this.getContact = function(number) {
            return DatabaseService.inTransaction(["contactStore"], function(contactStore) {
                return DatabaseService.getDataObject(contactStore, number);
            });
        };

        this.addContact = function(contact) {
            return DatabaseService.addEntity("contactStore", contact);
        };

        this.deleteContact = function(number) {
            return DatabaseService.inTransaction(["contactStore"], "readwrite", function(contactStore) {
                contactStore.delete(number);
            });
        };

        this.deleteMessages = function(number) {
            return DatabaseService.inTransaction(["messageStore"], "readwrite", function(messageStore) {
                var index = messageStore.index("number");
                var keyRange = IDBKeyRange.only(number);
                return DatabaseService.deleteDataObjects(messageStore, index, keyRange);
            });
        };

        this.updateContact = function(contact) {
            return DatabaseService.inTransaction(["contactStore"], "readwrite", function(contactStore) {
                contactStore.put(contact);
            }).then(function() {
                $rootScope.$broadcast("contactsUpdated", {number: contact.number});
            });
        };

        this.updateMessage = function(message) {
            return DatabaseService.inTransaction(["messageStore"], "readwrite", function(messageStore) {
                messageStore.put(message);
            }).then(function() {
                $rootScope.$broadcast("messagesUpdated", {number: message.number});
            });
        };

        /*
            item = {
                key: string,
                value: object
            }
        */
        this.putGeneralItem = function(item, key) {
            return DatabaseService.inTransaction(["generalStore"], "readwrite", function(generalStore) {
                generalStore.put(item, key);
            });
        };

        this.getGeneralItem = function(key) {
            return DatabaseService.inTransaction(["generalStore"], function(generalStore) {
                return DatabaseService.getDataObject(generalStore, key);
            });
        };
    });
})();
