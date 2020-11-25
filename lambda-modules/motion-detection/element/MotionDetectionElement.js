const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const CheckForMotionPort = require('../ports/CheckForMotionPort');
const MotionDetectedPort = require('../ports/MotionDetectedPort');
const logger = require('../../../utils/logger');

class MotionDetectionElement extends NativeLayoutElement {
    constructor() {
        super();
    }

    getType() {
        return "MotionDetection"
    }

    getDescription() {
        return "An element compares the images it receives and emits a motion detected event if it detects motion"
    }

    getOutData() {
        return "output(el(motiondetected), [motion-detected])."
    }

    getNewElement() {
        return new MotionDetectionElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["CheckForMotionPort"]
    }

    getTypeOutPorts() {
        return ["MotionDetectedPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("CheckForMotionPort",CheckForMotionPort);
        portClasses.set("MotionDetectedPort",MotionDetectedPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {

        logger.timeLog(`MotionDetection`,'start');

        let that = this;
        logger.infoLog.info(`LOGGER: MotionDetection Element received event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(`MotionDetection`,'finish');
                    resolve();
                    if (response.value) return that.port.MotionDetectedPort.call()
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = MotionDetectionElement;