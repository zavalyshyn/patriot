const Module = require('../../core/Module');
const SmsElement = require('./element/SmsElement');
const SmsService = require('./service/SmsService');

class SmsModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "SmsModule";
    }

    getDescription() {
        return "SMS notification module.";
    }

    getServiceInstance() {
        return new SmsService()
    }

    getElement() {
        return new SmsElement()
    }
}
module.exports = SmsModule;