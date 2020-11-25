const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const NOTInPort = require('../ports/NOTInPort');
const NOTOutPort = require('../ports/NOTOutPort');
const logger = require('../../../utils/logger');

class NOTElement extends NativeLayoutElement {
    constructor() {
        super();
    }

    getType() {
        return "NOT"
    }

    getDescription() {
        return "A logical NOT element"
    }

    getOutData() {
        return "output(el(and), [data[boolean])."
    }

    getNewElement() {
        return new NOTElement()
    }

    getNumberInPorts() {
        return 1;
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["NOTInPort"]
    }

    getTypeOutPorts() {
        return ["NOTOutPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("NOTInPort",NOTInPort);
        portsClasses.set("NOTOutPort",NOTOutPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        logger.timeLog("NOT",'start');
        logger.infoLog.info(`LOGGER: ${this.getName()} element received incoming layout event ${JSON.stringify(event)} on port ${portType} from ${sourceName}`);
        if (portType==="NOTInPort") {
            // this.port.inports[sourceName].setValue(event.value);
            if (event.value === true) {
                this.port.NOTOutPort.call(false);
            } else {
                this.port.NOTOutPort.call(true);
            }
        }
        logger.timeLog("NOT",'finish');
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = NOTElement;