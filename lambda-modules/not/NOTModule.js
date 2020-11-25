const Module = require('../../core/Module');
const NOTElement = require('./element/NOTElement');
const NOTService = require('./service/NOTService');

class NOTModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "NOT";
    }

    getDescription() {
        return "Logical NOT module.";
    }

    getServiceInstance() {
        return new NOTService()
    }

    getElement() {
        return new NOTElement()
    }
}
module.exports = NOTModule;