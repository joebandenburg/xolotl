(function() {
    "use strict";
    var module = angular.module("XolotlDatabaseService", []);

    module.service("DatabaseService", function(dbName) {
        var self = this;
        var db;

        this.openDatabase = function() {
            return new Promise(function(resolve, reject) {
                var request = window.indexedDB.open(dbName);
                request.onsuccess = function(event) {
                    db = request.result;
                    resolve(db);
                };
                request.onupgradeneeded = function(event) {
                    self.createStore(event.target.result);
                };
                request.onerror = reject;
            });
        };

        this.getDatabaseConnection = function() {
            if (db) {
                return Promise.resolve(db);
            } else {
                return this.openDatabase();
            }
        };

        this.createStore = function(db) {
            var objectStore = db.createObjectStore("messageStore", {
                keyPath : "sentTime"
            });
            objectStore.createIndex("number", "number", {
                unique: false
            });

            var contactStore = db.createObjectStore("contactStore", {
                keyPath: "number"
            });
            contactStore.createIndex("name", "name", {
                unique: false
            });
        };

        this.getDataObjects = function(index, keyRange) {
            return new Promise(function(resolve, reject) {
                var objects = [];
                var request = index.openCursor(keyRange);
                request.onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        objects.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(objects);
                    }
                };
                request.onerror = reject;
            });
        };

        this.getSpecificObject = function(store, index, keyRange, matchingObject) {
            return new Promise(function(resolve, reject) {
                var request = index.openKeyCursor(keyRange);
                request.onsuccess = function() {
                    var cursor = request.result;
                    if (cursor) {
                        store.delete(cursor.primaryKey);
                        cursor.continue();
                    } else {
                        resolve();
                    }
                };
                request.onerror = reject;
            });
        };

        this.deleteDataObjects = function(store, index, keyRange) {
            return new Promise(function(resolve, reject) {
                var request = index.openKeyCursor(keyRange);
                request.onsuccess = function() {
                    var cursor = request.result;
                    if (cursor) {
                        store.delete(cursor.primaryKey);
                        cursor.continue();
                    } else {
                        resolve();
                    }
                };
                request.onerror = reject;
            });
        };

        /*
            Admin functionality
        */

        this.deleteDatabase = function() {
            if (db) {
                db.close();
            }
            return new Promise(function(resolve, reject) {
                var request = window.indexedDB.deleteDatabase(dbName);
                request.onsuccess = resolve;
                request.onerror = reject;
                request.onblocked = reject;
            });
        };
    });
})();
