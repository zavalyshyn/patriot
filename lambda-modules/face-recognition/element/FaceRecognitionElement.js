const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const ImageDataPort = require('../ports/ImageDataPort');
const RecognitionResultPort = require('../ports/RecognitionResultPort');
const logger = require('../../../utils/logger');

class FaceRecognitionElement extends NativeLayoutElement {
    constructor() {
        super();
    }

    getType() {
        return "FaceRecognition"
    }

    getDescription() {
        return "An element performs a facial recognition on a given face image"
    }

    getOutData() {
        return "output(el(facerecognition), [namestring])."
    }

    getNewElement() {
        return new FaceRecognitionElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["ImageDataPort"]
    }

    getTypeOutPorts() {
        return ["RecognitionResultPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("ImageDataPort",ImageDataPort);
        portClasses.set("RecognitionResultPort",RecognitionResultPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {

        logger.timeLog(`FaceRecognition`,'start');

        let that = this;
        logger.infoLog.info(`LOGGER: FaceRecognition Element received event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(`FaceRecognition`,'finish');
                    resolve();
                    return that.port.RecognitionResultPort.call(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = FaceRecognitionElement;