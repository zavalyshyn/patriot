const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const PersonArrivedPort = require('../ports/PersonArrivedPort');
const PersonLeftPort = require('../ports/PersonLeftPort');
const CheckPresencePort = require('../ports/CheckPresencePort');
const logger = require('../../../utils/logger');

class PresenceSensorElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "PresenceSensor"
    }

    getDescription() {
        return "An interface to a presence sensor"
    }

    getOutData() {
        return "output(el(presencesensor), [boolean[presencedetected]])."
    }

    getNewElement() {
        return new PresenceSensorElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 2
    }

    getTypeInPorts() {
        return ["CheckPresencePort"]
    }

    getTypeOutPorts() {
        return ["PersonArrivedPort","PersonLeftPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("PersonArrivedPort",PersonArrivedPort);
        portClasses.set("PersonLeftPort",PersonLeftPort);
        portClasses.set("CheckPresencePort",CheckPresencePort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: Presence Sensor element received event on port ${portType} from ${sourceName}`);
        // logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        logger.timeLog(portType,'finish');
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    resolve(response)
                    logger.timeLog(portType,'finish');
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="PersonArrivedPort" && that.port.PersonArrivedPort) {
                logger.infoLog.info(`LOGGER: PresenceSensor element sends layout event on ${portType} port`);
                that.port.PersonArrivedPort.call()
                    .then(() => {
                        resolve();
                        logger.timeLog(that.getType(),'finish');
                    })
                    .catch((err)=>reject(err))
            }
            else if (portType==="PersonLeftPort" && that.port.PersonLeftPort) {
                logger.infoLog.info(`LOGGER: PresenceSensor element sends layout event on ${portType} port`);
                that.port.PersonLeftPort.call()
                    .then(()=> {
                        resolve();
                        logger.timeLog(that.getType(),'finish');
                    })
                    .catch((err)=>reject(err))
            }
        });
    }

}
module.exports = PresenceSensorElement;