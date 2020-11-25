const Module = require('../../core/Module');
const MotionSensorElement = require('./element/MotionSensorElement');
const MotionSensorService = require('./service/MotionSensorService');

class MotionSensorModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "MotionSensorModule";
    }

    getDescription() {
        return "Motion Sensor module.";
    }

    getServiceInstance() {
        return new MotionSensorService()
    }

    getElement() {
        return new MotionSensorElement()
    }
}
module.exports = MotionSensorModule;