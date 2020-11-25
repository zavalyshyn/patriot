const Module = require('../../core/Module');
const RepeaterElement = require('./element/RepeaterElement');
const RepeaterService = require('./service/RepeaterService');

class RepeaterModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "RepeaterModule";
    }

    getDescription() {
        return "Repeater sends control events at a specified interval";
    }

    getServiceInstance() {
        return new RepeaterService()
    }

    getElement() {
        return new RepeaterElement()
    }
}
module.exports = RepeaterModule;