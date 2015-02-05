(function() {
    "use strict";
    var module = angular.module("XolotlDataService", ["XolotlDatabaseService", "XolotlTextSecureService"]);

    module.service("DataService", function($rootScope, DatabaseService, TextSecureService) {
        var self = this;

        $rootScope.$on("newMessageReceived", function(event, message) {
            addEntity("messageStore", message).then(function() {
                $rootScope.$broadcast("messagesUpdated", {number: message.number});
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

        this.addMessage = function(message) {
            return addEntity("messageStore", message).then(function() {
                $rootScope.$broadcast("messagesUpdated", {number: message.number});
            }).then(function() {
                TextSecureService.sendMessage(message.number, message.body);
            });
        };

        /*
            contact = {
                name: string,
                number: string
            }
        */
        this.getAllContacts = function() {
            return inTransaction(["contactStore"], function(contactStore) {
                var index = contactStore.index("name");
                return DatabaseService.getDataObjects(index);
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
