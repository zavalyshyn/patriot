const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const SendPushMessagePort = require('../ports/SendPushMessagePort');
const SendPushWithImagePort = require('../ports/SendPushWithImagePort');
const DismissReceivedPort = require('../ports/DismissReceivedPort');
const SendPushWithFilePort = require('../ports/SendPushWithFilePort');
const logger = require('../../../utils/logger');

class PushNotifierElement extends NativeLayoutElement {
    constructor() {
        super();
    }

    getType() {
        return "PushNotifier"
    }

    getDescription() {
        return "Sends a given push message to the mobile app"
    }

    getOutData() {
        return "output(el(pushnotifier), [data[string])."
    }

    getNewElement() {
        return new PushNotifierElement()
    }

    getNumberInPorts() {
        return 1;
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["SendPushMessagePort","SendPushWithImagePort","SendPushWithFilePort"]
    }

    getTypeOutPorts() {
        return ["DismissReceivedPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("SendPushMessagePort",SendPushMessagePort);
        portsClasses.set("SendPushWithImagePort",SendPushWithImagePort);
        portsClasses.set("DismissReceivedPort",DismissReceivedPort);
        portsClasses.set("SendPushWithFilePort",SendPushWithFilePort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.timeLog(`PushNotifierElement`,'start');
        logger.infoLog.info(`LOGGER: PushNotifier element received layout event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(`PushNotifierElement`,'finish');
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="DismissReceivedPort" && that.port.DismissReceivedPort) { // if port was initialized
                logger.infoLog.info(`LOGGER: PushNotifier element sends layout event on ${portType} port`);
                that.port.DismissReceivedPort.call()
                    .then(resolve)
                    .catch(reject)
            }
        })
    }

}
module.exports = PushNotifierElement;