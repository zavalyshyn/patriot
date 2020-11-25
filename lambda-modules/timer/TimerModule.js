const Module = require('../../core/Module');
const TimerElement = require('./element/TimerElement');
const TimerService = require('./service/TimerService');

class TimerModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "Timer"
    }

    getDescription() {
        return "Timer element sends expired (boolean true) event after a certain time"
    }

    getServiceInstance() {
        return new TimerService;
    }

    getElement() {
        return new TimerElement;
    }
}
module.exports = TimerModule;