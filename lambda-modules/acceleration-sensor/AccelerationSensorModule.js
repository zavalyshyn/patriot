const Module = require('../../core/Module');
const AccelerationSensorElement = require('./element/AccelerationSensorElement');
const AccelerationSensorService = require('./service/AccelerationSensorService');

class AccelerationSensorModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "AccelerationModule";
    }

    getDescription() {
        return "Acceleration Sensor module.";
    }

    getServiceInstance() {
        return new AccelerationSensorService()
    }

    getElement() {
        return new AccelerationSensorElement()
    }
}
module.exports = AccelerationSensorModule;