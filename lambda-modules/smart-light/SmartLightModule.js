const Module = require('../../core/Module');
const SmartLightElement = require('./element/SmartLightElement');
const SmartLightService = require('./service/SmartLightService');

class SmartLightModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "SmartLight"
    }

    getDescription() {
        return "Interface to a Philips Hue smart lightbulb"
    }

    getServiceInstance() {
        return new SmartLightService;
    }

    getElement() {
        return new SmartLightElement;
    }
}
module.exports = SmartLightModule;