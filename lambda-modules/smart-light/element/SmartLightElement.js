const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const logger = require('../../../utils/logger');
const TurnOnLightPort = require('../ports/TurnOnLightPort');
const TurnOffLightPort = require('../ports/TurnOffLightPort');
const GetLightStatePort = require('../ports/GetLightStatePort');
const BlinkLightPort = require('../ports/BlinkLightPort');

class SmartLightElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "SmartLight"
    }

    getDescription() {
        return "An interface to a Phillips Hue Lights"
    }

    getOutData() {
        return "output(el(smartlight), [null])."
    }

    getNewElement() {
        return new SmartLightElement()
    }

    getNumberInPorts() {
        return 3
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["TurnOnLightPort","TurnOffLightPort","GetLightStatePort","BlinkLightPort"]
    }

    getTypeOutPorts() {
        return null
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("TurnOnLightPort",TurnOnLightPort);
        portClasses.set("TurnOffLightPort",TurnOffLightPort);
        portClasses.set("GetLightStatePort",GetLightStatePort);
        portClasses.set("BlinkLightPort",BlinkLightPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.timeLog(portType, 'start');
        logger.infoLog.info(`LOGGER: SmartLight Element received event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(portType, 'finish');
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = SmartLightElement;