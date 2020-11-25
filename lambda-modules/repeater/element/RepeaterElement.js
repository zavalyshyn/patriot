const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const RepeaterControlSignalPort = require('../ports/RepeaterControlSignalPort');
const logger = require('../../../utils/logger');

class RepeaterElement extends NativeLayoutElement {
    constructor() {
        super();
    }

    getType() {
        return "Repeater"
    }

    getDescription() {
        return "Repeater sends control signal every N minutes defined in config"
    }

    getOutData() {
        return "output(el(repeater), [data[boolean])."
    }

    getNewElement() {
        return new RepeaterElement()
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
        return ["RepeaterControlSignalPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("RepeaterControlSignalPort",RepeaterControlSignalPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return false
    }

    handleLayoutEvent(sourceName,event,portType) {
    }

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="RepeaterControlSignalPort" && that.port.RepeaterControlSignalPort) { // if port was initialized
                logger.infoLog.info(`LOGGER: Repeater element sends layout event on ${portType} port`);
                that.port.RepeaterControlSignalPort.call()
                    .then(()=> {
                        logger.timeLog('Repeater','finish');
                        resolve();
                    })
                    .catch((err)=>reject(err))

            }
        })
    }

}
module.exports = RepeaterElement;