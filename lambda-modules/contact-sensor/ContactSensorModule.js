const Module = require('../../core/Module');
const ContactSensorElement = require('./element/ContactSensorElement');
const ContactSensorService = require('./service/ContactSensorService');

class ContactSensorModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "ContactSensorModule";
    }

    getDescription() {
        return "Contact Sensor module.";
    }

    getServiceInstance() {
        return new ContactSensorService()
    }

    getElement() {
        return new ContactSensorElement()
    }
}
module.exports = ContactSensorModule;