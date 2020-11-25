const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const ORInPort = require('../ports/ORInPort');
const OROutPort = require('../ports/OROutPort');
const logger = require('../../../utils/logger');

class ORElement extends NativeLayoutElement {
    constructor() {
        super();
    }

    getType() {
        return "OR"
    }

    getDescription() {
        return "A logical OR element"
    }

    getOutData() {
        return "output(el(or), [data[boolean])."
    }

    getNewElement() {
        return new ORElement()
    }

    getNumberInPorts() {
        return "N"
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["ORInPort"]
    }

    getTypeOutPorts() {
        return ["OROutPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("ORInPort",ORInPort);
        portsClasses.set("OROutPort",OROutPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        logger.timeLog("OR",'start');
        logger.infoLog.info(`LOGGER: OR element received incoming layout event ${JSON.stringify(event)} on port ${portType} from ${sourceName}`);
        if (portType==="ORInPort" && event) {
            this.port.OROutPort.setValue(event.value);
            this.port.OROutPort.call(event.value);
        }
        logger.timeLog("OR",'finish');
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = ORElement;