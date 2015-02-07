(function() {
    "use strict";
    var module = angular.module("XolotlTextSecureStorageService", ["XolotlDatabaseService"]);

    module.service("TextSecureStorageService", function (DatabaseService) {
        var self = this;

        this.hasContact = function(number) {
            return self.getContact(number).then(function(contact) {
                return contact !== undefined;
            });
        };

        this.getContact = function(number) {
            return DatabaseService.inTransaction(["textSecureStore"], function(textSecureStore) {
                return new Promise(function(resolve, reject) {
                    var request = textSecureStore.get(number);
                    request.onsuccess = function() {
                        resolve(request.result);
                    };
                    request.onerror = reject;
                });
            });
        };

        this.putContact = function(number, contact) {
            return DatabaseService.inTransaction(["textSecureStore"], "readwrite", function(textSecureStore) {
                textSecureStore.put(contact, number);
            });
        };

        this.getLocalState = function() {
            return DatabaseService.inTransaction(["textSecureStore"], function(textSecureStore) {
                return DatabaseService.getDataObject(textSecureStore, "localState");
            });
        };

        this.putLocalState = function(state) {
            return DatabaseService.inTransaction(["textSecureStore"], "readwrite", function(textSecureStore) {
                textSecureStore.put(state, "localState");
            });
        };

        this.putLocalSignedPreKeyPair = function(id, preKeyPair) {
            return DatabaseService.inTransaction(["textSecureSignedPreKeyStore"], "readwrite", function(store) {
                store.put(preKeyPair, id);
            });
        };

        this.putLocalPreKeyPair = function(id, preKeyPair) {
            return DatabaseService.inTransaction(["textSecurePreKeyStore"], "readwrite", function(store) {
                store.put(preKeyPair, id);
            });
        };

        this.getLocalSignedPreKeyPair = function(id) {
            return DatabaseService.inTransaction(["textSecureSignedPreKeyStore"], "readwrite", function(store) {
                return DatabaseService.getDataObject(store, id);
            });
        };

        this.getLocalPreKeyPair = function(id) {
            return DatabaseService.inTransaction(["textSecurePreKeyStore"], "readwrite", function(store) {
                return DatabaseService.getDataObject(store, id);
            });
        };
    });
})();
