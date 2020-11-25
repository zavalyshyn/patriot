const Module = require('../../core/Module');
const SmokeSensorElement = require('./element/SmokeSensorElement');
const SmokeSensorService = require('./service/SmokeSensorService');

class SmokeSensorModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "SmokeSensorModule";
    }

    getDescription() {
        return "Smoke Sensor module.";
    }

    getServiceInstance() {
        return new SmokeSensorService()
    }

    getElement() {
        return new SmokeSensorElement()
    }
}
module.exports = SmokeSensorModule;