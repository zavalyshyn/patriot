const Module = require('../../core/Module');
const AESEncryptionElement = require('./element/AESEncryptionElement');
const AESEncryptionService = require('./service/AESEncryptionService');

class AESEncryptionModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "AESEncryption"
    }

    getDescription() {
        return "A module encrypts a given data using an AES192 algorithm"
    }

    getServiceInstance() {
        return new AESEncryptionService;
    }

    getElement() {
        return new AESEncryptionElement;
    }
}
module.exports = AESEncryptionModule;