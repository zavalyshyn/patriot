const Module = require('../../core/Module');
const WakewordDetectionElement = require('./element/WakewordDetectionElement');
const WakewordDetectionService = require('./service/WakewordDetectionService');

class WakewordDetectionModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "WakewordDetectionModule";
    }

    getDescription() {
        return "Wakeword Detection module.";
    }

    getServiceInstance() {
        return new WakewordDetectionService()
    }

    getElement() {
        return new WakewordDetectionElement()
    }
}
module.exports = WakewordDetectionModule;