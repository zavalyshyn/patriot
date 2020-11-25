const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const MotionDetectedPort = require('../ports/MotionDetectedPort');
const logger = require('../../../utils/logger');

class MotionSensorElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "MotionSensor"
    }

    getDescription() {
        return "An interface to a motion sensor"
    }

    getOutData() {
        return "output(el(motion), [boolean[motiondetected]])."
    }

    getNewElement() {
        return new MotionSensorElement()
    }

    getNumberInPorts() {
        return 0
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return null
    }

    getTypeOutPorts() {
        return ["MotionDetectedPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("MotionDetectedPort",MotionDetectedPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return false
    }

    handleLayoutEvent(sourceName,event,portType) {}

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="MotionDetectedPort" && that.port.MotionDetectedPort) {
                logger.infoLog.info(`LOGGER: MotionSensor element sends layout event ${JSON.stringify(event)} on ${portType} port`);
                logger.timeLog("MotionSensor",'finish');
                that.port.MotionDetectedPort.call(event.value)
                    .then(resolve)
                    .catch(reject);
            } else reject
        })


        // original
        // if (portType==="MotionDetectedPort" && this.port.MotionDetectedPort) {
        //     logger.infoLog.info(`LOGGER: MotionSensor element sends layout event ${JSON.stringify(event)} on ${portType} port`);
        //     this.port.MotionDetectedPort.call(event.value)
        // }
    }

}
module.exports = MotionSensorElement;