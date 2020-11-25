const Module = require('../../core/Module');
const ORElement = require('./element/ORElement');
const ORService = require('./service/ORService');

class ORModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "OR";
    }

    getDescription() {
        return "Logical OR module.";
    }

    getServiceInstance() {
        return new ORService()
    }

    getElement() {
        return new ORElement()
    }
}
module.exports = ORModule;