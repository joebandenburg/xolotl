(function() {
    "use strict";
    var module = angular.module("XolotlDataService", ["XolotlDatabaseService", "XolotlTextSecureService",
        "XolotlMessageStatus"]);

    module.service("DataService", function($rootScope, DatabaseService, TextSecureService, MessageStatus) {
        var self = this;

        $rootScope.$on("newMessageReceived", function(event, message) {
            addEntity("messageStore", message).then(function() {
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
            return inTransaction(["messageStore"], function(messageStore) {
                var index = messageStore.index("number");
                var singleKeyRange = IDBKeyRange.only(number);
                return DatabaseService.getDataObjects(index, singleKeyRange);
            });
        };

        this.getMessage = function(number, sentTime) {
            return inTransaction(["messageStore"], function(messageStore) {
                var index = messageStore.index("number, sentTime");
                return DatabaseService.getDataObject(index, [number, sentTime]);
            });
        };

        this.addMessage = function(message) {
            return addEntity("messageStore", message).then(function() {
                $rootScope.$broadcast("messagesUpdated", {number: message.number});
                return TextSecureService.sendMessage(message.number, message.body);
            }).then(function() {
                message.status = MessageStatus.SENT;
                return self.updateMessage(message);
            }, function(error) {
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
            return inTransaction(["contactStore"], function(contactStore) {
                var index = contactStore.index("name");
                return DatabaseService.getDataObjects(index);
            });
        };

        this.getAllContactsByLatestMessage = function() {
            return inTransaction(["contactStore"], function(contactStore) {
                var index = contactStore.index("mostRecentMessage");
                return DatabaseService.getDataObjects(index, null, "prev");
            });
        };

        this.getContact = function(number) {
            return inTransaction(["contactStore"], function(contactStore) {
                return DatabaseService.getDataObject(contactStore, number);
            });
        };

        this.addContact = function(contact) {
            return addEntity("contactStore", contact);
        };

        this.deleteContact = function(number) {
            return inTransaction(["contactStore"], "readwrite", function(contactStore) {
                contactStore.delete(number);
            });
        };

        this.deleteMessages = function(number) {
            return inTransaction(["messageStore"], "readwrite", function(messageStore) {
                var index = messageStore.index("number");
                var keyRange = IDBKeyRange.only(number);
                return DatabaseService.deleteDataObjects(messageStore, index, keyRange);
            });
        };

        this.updateContact = function(contact) {
            return inTransaction(["contactStore"], "readwrite", function(contactStore) {
                contactStore.put(contact);
            }).then(function() {
                $rootScope.$broadcast("contactsUpdated", {number: contact.number});
            });
        };

        this.updateMessage = function(message) {
            return inTransaction(["messageStore"], "readwrite", function(messageStore) {
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
            return inTransaction(["generalStore"], "readwrite", function(generalStore) {
                generalStore.put(item, key);
            });
        };

        this.getGeneralItem = function(key) {
            return inTransaction(["generalStore"], function(generalStore) {
                return DatabaseService.getDataObject(generalStore, key);
            });
        };

        var inTransaction = function(stores, mode, callback) {
            if (!callback) {
                callback = mode;
                mode = undefined;
            }
            return DatabaseService.getDatabaseConnection().then(function(db) {
                var transaction = db.transaction(stores, mode);
                var storeObjects = stores.map(function(storeName) {
                    return transaction.objectStore(storeName);
                });
                var result = callback.apply(this, storeObjects);
                return promisify(transaction).then(function() {
                    return result;
                });
            });
        };

        var promisify = function(transaction) {
            return new Promise(function(resolve, reject) {
                transaction.oncomplete = resolve;
                transaction.onerror = function(e) {
                    e.preventDefault(); // Needed for Firefox (https://bugzilla.mozilla.org/show_bug.cgi?id=872873)
                    reject(e);
                };
            });
        };

        var addEntity = function(storeName, entity) {
            return inTransaction([storeName], "readwrite", function(store) {
                store.add(entity);
            });
        };
    });
})();
