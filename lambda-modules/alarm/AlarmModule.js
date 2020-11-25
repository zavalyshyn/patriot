const Module = require('../../core/Module');
const AlarmElement = require('./element/AlarmElement');
const AlarmService = require('./service/AlarmService');

class AlarmModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "Alarm"
    }

    getDescription() {
        return "Interface to an alarm device"
    }

    getServiceInstance() {
        return new AlarmService;
    }

    getElement() {
        return new AlarmElement;
    }
}
module.exports = AlarmModule;