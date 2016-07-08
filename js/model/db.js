class Db {

    constructor() {
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        this.dbName = 'photoProject';
        this.dbVersion = 2;
    }

    logerr(err) {
        console.log(err);
    }

    connectDB(f) {
        var $this = this;
        var request = indexedDB.open($this.dbName, $this.dbVersion);
        request.onerror = $this.logerr;
        request.onsuccess = function(){
            f(request.result);
        }
        request.onupgradeneeded = function(e){
            console.log("openDb.onupgradeneeded");

            var storeAlbum = e.currentTarget.result.createObjectStore('album', {keyPath: 'id', autoIncrement: true});
            storeAlbum.createIndex('name', 'name', {unique: false});
            storeAlbum.createIndex('thumb', 'thumb', {unique: false});

            var storeFile = e.currentTarget.result.createObjectStore('file', {keyPath: 'id', autoIncrement: true});
            storeFile.createIndex('album_id', 'album_id', {unique: false});
            storeFile.createIndex('file_type', 'file_type', {unique: false});
            storeFile.createIndex('file', 'file', {unique: false});

            $this.connectDB(f);
        }
    }

    saveItem(item, f){
        var $this = this;
        $this.connectDB(function(db){
    		var request = db.transaction([$this.dbStore], "readwrite");
            var result = request.objectStore($this.dbStore).put(item);
            result.onerror = $this.logerr;
            result.onsuccess = function(e){
                f(e.target.result);
            };
    	});
    }

    deleteItem(id, f){
        var $this = this;
        $this.connectDB(function(db){

            var request = db.transaction([$this.dbStore], "readwrite");
            request.onerror = function (e) {
                alert('err');
            };

            var store = request.objectStore($this.dbStore);
            var storeRequest = store.delete(id);
            storeRequest.onsuccess = function (e) {
                f(e.target);
            };

    	});
    }

    getAll(f){
        var $this = this;
    	this.connectDB(function(db){
    		var rows = [],
    			store = db.transaction([$this.dbStore], "readonly").objectStore($this.dbStore);

            var request = store.getAll().onsuccess = function(e){
                f(e.target.result);
            };
    	});
    }

    getByCondition(field, value, f){
        var $this = this;
    	this.connectDB(function(db){
    		var rows = [],
    			store = db.transaction([$this.dbStore], "readonly").objectStore($this.dbStore);

            var keyRange = IDBKeyRange.only(value);
            store.index('album_id').get(keyRange);

            var request = store.index(field).getAll(keyRange).onsuccess = function(e){
                f(e.target.result);
            };

    	});
    }

}