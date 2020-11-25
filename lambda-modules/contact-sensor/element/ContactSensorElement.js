const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const ContactOpenPort = require('../ports/ContactOpenPort');
const ContactClosedPort = require('../ports/ContactClosedPort');
const logger = require('../../../utils/logger');

class ContactSensorElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "ContactSensor"
    }

    getDescription() {
        return "An interface to a contact sensor"
    }

    getOutData() {
        return "output(el(contact), [boolean[contactopened],boolean[contactclosed]])."
    }

    getNewElement() {
        return new ContactSensorElement()
    }

    getNumberInPorts() {
        return 0
    }

    getNumberOutPorts() {
        return 2
    }

    getTypeInPorts() {
        return null
    }

    getTypeOutPorts() {
        return ["ContactOpenPort","ContactClosedPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("ContactOpenPort",ContactOpenPort);
        portClasses.set("ContactClosedPort",ContactClosedPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return false
    }

    handleLayoutEvent(sourceName,event,portType) {}

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="ContactOpenPort" && that.port.ContactOpenPort) {
                logger.infoLog.info(`LOGGER: ContactSensor element sends layout event on ${portType} port`);
                logger.timeLog("ContactSensor",'finish');
                that.port.ContactOpenPort.call(event.value)
                    .then(resolve)
                    .catch(reject)
            }
            else if (portType==="ContactClosedPort" && that.port.ContactClosedPort) {
                logger.infoLog.info(`LOGGER: ContactSensor element sends layout event on ${portType} port`);
                that.port.ContactClosedPort.call(event.value)
                    .then(resolve)
                    .catch(reject)
            }
        });
    }

}
module.exports = ContactSensorElement;