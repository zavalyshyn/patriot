const Module = require('../../core/Module');
const SmartPlugElement = require('./element/SmartPlugElement');
const SmartPlugService = require('./service/SmartPlugService');

class SmartPlugModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "SmartPlug"
    }

    getDescription() {
        return "Interface to a smart plug"
    }

    getServiceInstance() {
        return new SmartPlugService;
    }

    getElement() {
        return new SmartPlugElement;
    }
}
module.exports = SmartPlugModule;