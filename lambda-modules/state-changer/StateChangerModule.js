const Module = require('../../core/Module');
const StateChangerElement = require('./element/StateChangerElement');
const StateChangerService = require('./service/StateChangerService');

class StateChangerModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "StateChanger"
    }

    getDescription() {
        return "An interface for switching the states of the app"
    }

    getServiceInstance() {
        return new StateChangerService;
    }

    getElement() {
        return new StateChangerElement;
    }
}
module.exports = StateChangerModule;