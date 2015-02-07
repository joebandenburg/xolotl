describe("db-service", function() {
    beforeEach(module('XolotlTextSecureStorageService', function($provide) {
        $provide.value("dbName", "test");
    }));

    var service;
    var dbService;

    beforeEach(inject(function(TextSecureStorageService, DatabaseService) {
        service = TextSecureStorageService;
        dbService = DatabaseService;
    }));

    afterEach(function() {
        return dbService.deleteDatabase();
    });

    describe("putContact", function() {
        it("adds a contact to the database", function() {
            return service.putContact("+44123", {
                a: 1,
                b: 2
            });
        });
    });
    describe("getContact", function() {
        it("returns previously added contact", function() {
            return service.putContact("+44123", {
                a: 1,
                b: 2
            }).then(function() {
                return service.getContact("+44123");
            }).then(function(contact) {
                assert.equal(contact.a, 1);
                assert.equal(contact.b, 2);
            });
        });
        it("stores ArrayBuffer values", function() {
            return service.putContact("+44123", {
                a: new Uint8Array([1, 2, 3]).buffer
            }).then(function() {
                return service.getContact("+44123");
            }).then(function(contact) {
                assert.equal(contact.a.byteLength, 3);
                var view = new Uint8Array(contact.a);
                assert.equal(view[0], 1);
                assert.equal(view[1], 2);
            });
        });
        it("returns undefined if key does not exist", function() {
            return service.getContact("+44123").then(function(contact) {
                assert.strictEqual(contact, undefined);
            });
        });
    });
    describe("hasContact", function() {
        it("returns true if contact exists", function() {
            return service.putContact("+44123", {
                a: 1,
                b: 2
            }).then(function() {
                return service.hasContact("+44123");
            }).then(function(result) {
                assert.strictEqual(result, true);
            });
        });
        it("returns false if contact does not exist", function() {
            return service.hasContact("+44123").then(function(result) {
                assert.strictEqual(result, false);
            });
        });
    });
});