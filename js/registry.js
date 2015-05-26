export class MultipleValuesRegistry {
    constructor () {
        this._registries = {};
    }
    add (id, value) {
        if (!this._registries[id]) {
            this._registries[id] = [];
        }
        if (this._registries[id].indexOf(value) === -1) {
            this._registries[id].push(value);
        }
    }
    get (id) {
        return this._registries[id] || [];
    }
    findByValue (value) {
        //TODO: check if keys and find is added to the browser with babeljs
        var keys = Object.keys(this._registries).filter(function (key) {
            return this._registries[key].indexOf(value) !== -1;
        });

        return keys;
    }
    remove(key, value) {
        if (!this._registries[key]) { return; }

        var index = this._registries[key].indexOf(value);

        if (index < 0) { return; }
        return this._registries[key].splice(index, 1);
    }
    removeByKey (id) {
        let old = this._registries[id];
        delete this._registries[id];
        return old;
    }
    removeByValue (value) {
        let keys = this.findByValue(value);
        return keys.map(function (key) {
            return this.destroy(key, value);
        });
    }
    removeAll() {
        let old = this._registries;
        this._registries = {};
        return old;
    }
    size() {
        return Object.keys(this._registries).length;
    }
}

export class SingleValueRegistry {
    constructor () {
        this._registries = {};
    }
    add (id, value) {
        this._registries[id] = value;
    }
    get (id) {
        return this._registries[id];
    }
    findByValue (value) {
        //TODO: check if keys and find is added to the browser with babeljs
        var key = Object.keys(this._registries).filter(function (key) {
            return this._registries[key] === value;
        });

        return key;
    }
    remove (id) {
        let old = this._registries[id];
        delete this._registries[id];
        return old;
    }
    removeByValue (value) {
        let keys = this.findByValue(value);
        return keys.map(function (key) {
            return this.destroy(key);
        });
    }
    removeAll() {
        let old = this._registries;
        this._registries = {};
        return old;
    }
    size() {
        return Object.keys(this._registries).length;
    }
}

