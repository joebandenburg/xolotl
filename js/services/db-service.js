(function() {
    "use strict";
    var module = angular.module("XolotlDatabaseService", []);

    module.service("DatabaseService", function($filter, $rootScope) {

        var dbName = "XolotlDatabase";
        var db;

        /*
            Private functionality
        */
        var openDatabase = function() {
            return new Promise(function(resolve, reject) {
                var request = window.indexedDB.open(dbName);
                request.onsuccess = resolve;
                request.onerror = reject;
            });
        }

        var getDatabaseConnection = function() {
            return new Promise(function(resolve, reject) {
                if (db) {
                    resolve(db);
                } else {
                    openDatabase().then(function(event) {
                        resolve(event.target.result);
                    }, function(error) {
                        console.error("failed to open db");
                        console.error(error);
                        reject(error);
                    });
                }
            });
        };

        var createStore = function(db) {
            return new Promise(function(resolve, reject) {
                console.log("creating store");

                var storesCreated = 0;

                var resolveTransaction = function() {
                    storesCreated++;
                    if (storesCreated === 2) {
                        resolve();
                    }
                };

                var objectStore = db.createObjectStore("messageStore", { autoIncrement : true });
                objectStore.createIndex("number", "number", { unique: false });
                objectStore.transaction.oncomplete = resolveTransaction;
                objectStore.transaction.onerror = reject;

                var contactStore = db.createObjectStore("contactStore", { keyPath: "number" });
                contactStore.createIndex("name", "name", { unique: false });
                contactStore.transaction.oncomplete = resolveTransaction;
                contactStore.transaction.onerror = reject;
            });
        };

        var getDataObjects = function(index, keyRange) {
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

        /*
            Admin functionality
        */
        this.upgradeDatabase = function() {
            console.log("updating database");
            return new Promise(function(resolve, reject) {
                var request = window.indexedDB.open(dbName);
                request.onerror = reject;
                request.onsuccess = function(event) {
                    console.log("onsuccess");
                };
                request.onupgradeneeded = function(event) {
                    console.log("onupgradeneeded");
                    var db = event.target.result;
                    resolve(db);
                };
            }).then(createStore(db));
        };

        this.deleteDatabase = function() {
            console.log("deleting databse");
            return new Promise(function(resolve, reject) {
                var request = window.indexedDB.deleteDatabase(dbName);
                request.onsuccess = resolve;
                request.onerror = reject;
            });
        };

        /*
            API functionality - CRUD like
        */
        this.getAllMessages = function(number) {
            return getDatabaseConnection().then(function(db) {
                return new Promise(function(resolve, reject) {
                    var transaction = db.transaction(["messageStore"]);
                    var objectStore = transaction.objectStore("messageStore");

                    var index = objectStore.index("number");
                    var singleKeyRange = IDBKeyRange.only(number);
                    getDataObjects(index, singleKeyRange).then(resolve, reject);
                });
            });
        };
        
        this.addMessage = function(message) {
            return getDatabaseConnection().then(function(db) {
                return new Promise(function(resolve, reject) {
                    var transaction = db.transaction(["messageStore"], "readwrite");
                    var objectStore = transaction.objectStore("messageStore");

                    var request = objectStore.add(message);
                    request.onsuccess = function() {
                        $rootScope.$broadcast("newMessage", {number: message.number});
                        resolve();
                    };
                    transaction.onerror = reject;
                });    
            });
        };

        this.getAllContacts = function() {
            return getDatabaseConnection().then(function(db) {
                return new Promise(function(resolve, reject) {
                    var transaction = db.transaction(["contactStore"]);
                    var objectStore = transaction.objectStore("contactStore");

                    var index = objectStore.index("name");
                    getDataObjects(index).then(resolve, reject);
                });
            });
        };

        this.addContact = function (contact) {
            return getDatabaseConnection().then(function(db) {
                return new Promise(function(resolve, reject) {
                    var transaction = db.transaction(["contactStore"], "readwrite");
                    var objectStore = transaction.objectStore("contactStore");

                    var request = objectStore.add(contact);
                    request.onsuccess = resolve;
                    transaction.onerror = reject;
                });    
            });
        };

        this.deleteMessages = function(number) {
            var self = this;
            return getDatabaseConnection().then(function(db) {
                return new Promise(function(resolve, reject) {
                    var transaction = db.transaction(["messageStore"], "readwrite");
                    var objectStore = transaction.objectStore("messageStore");

                    var index = objectStore.index("number");
                    var keyRange = IDBKeyRange.only(number);
                    var destroy = index.openKeyCursor(keyRange);
                    destroy.onsuccess = function() {
                        var cursor = destroy.result;
                        if (cursor) {
                            objectStore.delete(cursor.primaryKey);
                            cursor.continue();
                        }
                    };
                    transaction.onerror = reject;
                    transaction.oncomplete = resolve;
                });
            });
        };

        this.deleteContact = function(number) {
            var self = this;
            return getDatabaseConnection().then(function(db) {
                return new Promise(function(resolve, reject) {
                    var request = db.transaction(["contactStore"], "readwrite")
                        .objectStore("contactStore")
                        .delete(number);
                    request.onsuccess = resolve;
                    request.onerror = reject;
                });
            }).then(function() {
                return self.deleteMessages(number);
            });
        };



        // var self = this;
        // self.deleteDatabase().then(function() {
        //     console.log("deleted database");
        //     return self.upgradeDatabase();
        // }).then(function(event) {
        //     console.log("database was deleted and recreated")
        // }, function(error) {
        //     console.log("It didn't work.");
        //     console.log(error);
        // });

    });
})();
