const Module = require('../../core/Module');
const KVStoreElement = require('./element/KVStoreElement');
const KVStoreService = require('./service/KVStoreService');

class KVStoreModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "KVStore"
    }

    getDescription() {
        return "Interface to a Key-Value Store"
    }

    getServiceInstance() {
        return new KVStoreService;
    }

    getElement() {
        return new KVStoreElement;
    }
}
module.exports = KVStoreModule;