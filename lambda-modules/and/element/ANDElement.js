const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const ANDInPort = require('../ports/ANDInPort');
const ANDOutPort = require('../ports/ANDOutPort');

class ANDElement extends NativeLayoutElement {
    constructor() {
        super();
        this.triggeredPorts = [];
    }

    getType() {
        return "AND"
    }

    getDescription() {
        return "A logical AND element"
    }

    getOutData() {
        return "output(el(and), [data[boolean])."
    }

    getNewElement() {
        return new ANDElement()
    }

    getNumberInPorts() {
        return "N";
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["ANDInPort"]
    }

    getTypeOutPorts() {
        return ["ANDOutPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("ANDInPort",ANDInPort);
        portsClasses.set("ANDOutPort",ANDOutPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        console.log(`LOGGER: AND element received incoming layout event ${JSON.stringify(event)} on port ${portType} from ${sourceName}`);
        if (portType==="ANDInPort") {
            this.port.inports[sourceName].setValue(event.value);
            if (event.value===false) {
                console.log(`LOGGER: AND element received incoming layout event ${JSON.stringify(event)} on port ${portType} from ${sourceName}`);
                this.port.ANDOutPort.call(false);
            }
            else {
                // check if we have true on all input ports
                let readyToSend = true;
                for (let field in this.port.inports) {
                    // this.port.inports.hasOwnProperty() is used to filter out properties from the object's prototype chain
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
                    if (this.port.inports.hasOwnProperty(field)) {
                        if (this.port.inports[field].getValue()===false) {
                            readyToSend = false;
                            break;
                        }
                    }
                }

                if (readyToSend) {
                    this.port.ANDOutPort.call(true);
                }
            }
        }


    }

    handleGlobalEvent(event, portType) {}

}
module.exports = ANDElement;