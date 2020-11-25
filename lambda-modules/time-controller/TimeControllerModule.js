const Module = require('../../core/Module');
const TimeControllerElement = require('./element/TimeControllerElement');
const TimeControllerService = require('./service/TimeControllerService');

class TimeControllerModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "TimeControllerModule";
    }

    getDescription() {
        return "An element send a true event when a predefined time range begins, and false event when it finishes.";
    }

    getServiceInstance() {
        return new TimeControllerService()
    }

    getElement() {
        return new TimeControllerElement()
    }
}
module.exports = TimeControllerModule;