const Module = require('../../core/Module');
const SwitchElement = require('./element/SwitchElement');
const SwitchService = require('./service/SwitchService');

class SwitchModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "SwitchModule";
    }

    getDescription() {
        return "Switch module.";
    }

    getServiceInstance() {
        return new SwitchService()
    }

    getElement() {
        return new SwitchElement()
    }
}
module.exports = SwitchModule;