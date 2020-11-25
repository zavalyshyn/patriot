const Module = require('../../core/Module');
const PushNotifierElement = require('./element/PushNotifierElement');
const PushNotifierService = require('./service/PushNotifierService');

class PushNotifierModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "PushNotifier";
    }

    getDescription() {
        return "PushNotifier sends push message to home owners phone.";
    }

    getServiceInstance() {
        return new PushNotifierService()
    }

    getElement() {
        return new PushNotifierElement()
    }
}
module.exports = PushNotifierModule;