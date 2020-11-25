const Module = require('../../core/Module');
const FaceRecognitionElement = require('./element/FaceRecognitionElement');
const FaceRecognitionService = require('./service/FaceRecognitionService');

class FaceRecognitionModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "FaceRecognition";
    }

    getDescription() {
        return "Interface to the Face Recognition service.";
    }

    getServiceInstance() {
        return new FaceRecognitionService()
    }

    getElement() {
        return new FaceRecognitionElement()
    }
}
module.exports = FaceRecognitionModule;