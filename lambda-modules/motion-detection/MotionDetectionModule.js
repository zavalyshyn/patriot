const Module = require('../../core/Module');
const MotionDetectionElement = require('./element/MotionDetectionElement');
const MotionDetectionService = require('./service/MotionDetectionService');

class MotionDetectionModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "MotionDetection";
    }

    getDescription() {
        return "Interface to a motion detection service.";
    }

    getServiceInstance() {
        return new MotionDetectionService()
    }

    getElement() {
        return new MotionDetectionElement()
    }
}
module.exports = MotionDetectionModule;