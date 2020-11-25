const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const SmokeDetectedPort = require('../ports/SmokeDetectedPort');
const logger = require('../../../utils/logger');

class SmokeSensorElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "SmokeSensor"
    }

    getDescription() {
        return "An interface to a smoke sensor"
    }

    getOutData() {
        return "output(el(smoke), [boolean[smokedetected]])."
    }

    getNewElement() {
        return new SmokeSensorElement()
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
        return ["SmokeDetectedPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("SmokeDetectedPort",SmokeDetectedPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return false
    }

    handleLayoutEvent(sourceName,event,portType) {}

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="SmokeDetectedPort" && that.port.SmokeDetectedPort) {
                logger.infoLog.info(`LOGGER: SmokeSensor element sends layout event ${JSON.stringify(event)} on ${portType} port`);
                logger.timeLog("SmokeSensor",'finish');
                that.port.SmokeDetectedPort.call(event.value)
                    .then(resolve)
                    .catch(reject);
            } else reject
        })
    }

}
module.exports = SmokeSensorElement;