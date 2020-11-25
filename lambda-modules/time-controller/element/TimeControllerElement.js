const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const ControlSignalPort = require('../ports/ControlSignalPort');
const logger = require('../../../utils/logger');

class TimeControllerElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "TimeController"
    }

    getDescription() {
        return "An element send a true event when a predefined time range begins, and false event when it finishes"
    }

    getOutData() {
        return "output(el(timecontroller), [boolean[controlsignal]])."
    }

    getNewElement() {
        return new TimeControllerElement()
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
        return ["ControlSignalPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("ControlSignalPort",ControlSignalPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return false
    }

    handleLayoutEvent(sourceName,event,portType) {}

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="ControlSignalPort" && that.port.ControlSignalPort) { // if port was initialized
                logger.infoLog.info(`LOGGER: TimeController element sends layout event on ${portType} port`);
                if (event===true) {
                    that.port.ControlSignalPort.call(true)
                        .then(resolve)
                        .catch((err)=>reject(err))
                } else {
                    that.port.ControlSignalPort.call(true)  // experiments. delete after
                    // that.port.ControlSignalPort.call(false)
                        .then(resolve)
                        .catch((err)=>reject(err))
                }
                logger.timeLog('TimeController','finish');
            }
        })

    }

}
module.exports = TimeControllerElement;