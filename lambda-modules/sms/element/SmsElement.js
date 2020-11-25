const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const SendSmsPort = require('../ports/SendSmsPort');

class SmsElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "Sms"
    }

    getDescription() {
        return "An interface to an SMS notifications service"
    }

    getOutData() {
        return "output(el(sms), [])."
    }

    getNewElement() {
        return new SmsElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["SendSmsPort"]
    }

    getTypeOutPorts() {
        return null;
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("SendSmsPort",SendSmsPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true;
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        console.log(`LOGGER: SmsElement received event on port ${portType} from ${sourceName}`);
        // console.log(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = SmsElement;