const Module = require('../../core/Module');
const PresenceSensorElement = require('./element/PresenceSensorElement');
const PresenceSensorService = require('./service/PresenceSensorService');

class PresenceSensorModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "PresenceSensorModule";
    }

    getDescription() {
        return "Presence Sensor module.";
    }

    getServiceInstance() {
        return new PresenceSensorService()
    }

    getElement() {
        return new PresenceSensorElement()
    }
}
module.exports = PresenceSensorModule;