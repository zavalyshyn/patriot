const Module = require('../../core/Module');
const FitnessTrackerElement = require('./element/FitnessTrackerElement');
const FitnessTrackerService = require('./service/FitnessTrackerService');

class FitnessTrackerModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "FitnessTracker";
    }

    getDescription() {
        return "Interface to the Fitness Tracker device.";
    }

    getServiceInstance() {
        return new FitnessTrackerService()
    }

    getElement() {
        return new FitnessTrackerElement()
    }

    getSupportedPorts() {
        return
    }
}
module.exports = FitnessTrackerModule;