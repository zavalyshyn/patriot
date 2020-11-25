const Module = require('../../core/Module');
const IntervalControllerElement = require('./element/IntervalControllerElement');
const IntervalControllerService = require('./service/IntervalControllerService');

class IntervalControllerModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "IntervalController";
    }

    getDescription() {
        return "Interval controller forwards input events at a specified interval";
    }

    getServiceInstance() {
        return new IntervalControllerService()
    }

    getElement() {
        return new IntervalControllerElement()
    }
}
module.exports = IntervalControllerModule;