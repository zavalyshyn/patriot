const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const EncryptDataInPort = require('../ports/EncryptDataInPort');
const EncryptDataOutPort = require('../ports/EncryptDataOutPort');
const logger = require('../../../utils/logger');

class AESEncryptionElement extends NativeLayoutElement {
    constructor() {
        super();
    }

    getType() {
        return "AESEncryption"
    }

    getDescription() {
        return "An element encrypts a given data using an AES192 algorithm"
    }

    getOutData() {
        return "output(el(aesencryption), [cipher])."
    }

    getNewElement() {
        return new AESEncryptionElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["EncryptDataInPort"]
    }

    getTypeOutPorts() {
        return ["EncryptDataOutPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("EncryptDataInPort",EncryptDataInPort);
        portClasses.set("EncryptDataOutPort",EncryptDataOutPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {

        logger.timeLog(`AESEncryption`,'start');

        let that = this;
        logger.infoLog.info(`LOGGER: AESEncryption Element received event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(`AESEncryption`,'finish');
                    resolve();
                    return that.port.EncryptDataOutPort.call(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = AESEncryptionElement;