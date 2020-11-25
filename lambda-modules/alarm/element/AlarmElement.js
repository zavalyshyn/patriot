const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const TriggerAlarmPort = require('../ports/TriggerAlarmPort');
const logger = require('../../../utils/logger');

class AlarmElement extends NativeLayoutElement {
    constructor() {
        super();
        this.expCounter = 0;
    }

    getType() {
        return "Alarm"
    }

    getDescription() {
        return "An interface to an alarm device"
    }

    getOutData() {
        return "output(el(alarm), [null])."
    }

    getNewElement() {
        return new AlarmElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["TriggerAlarmPort"]
    }

    getTypeOutPorts() {
        return null
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("TriggerAlarmPort",TriggerAlarmPort)
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {

        logger.timeLog(`Alarm`,'start');

        let that = this;
        logger.infoLog.info(`LOGGER: Alarm Element received event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(`Alarm`,'finish');
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = AlarmElement;