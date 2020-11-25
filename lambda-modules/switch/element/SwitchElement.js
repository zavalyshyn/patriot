const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const SwitchOnPort = require('../ports/SwitchOnPort');
const SwitchOffPort = require('../ports/SwitchOffPort');
const SwitchOnStatePort = require('../ports/SwitchOnStatePort');
const SwitchOffStatePort = require('../ports/SwitchOffStatePort');
const GetSwitchOnStatePort = require('../ports/GetSwitchOnStatePort');
const GetSwitchOffStatePort = require('../ports/GetSwitchOffStatePort');

class SwitchElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "Switch"
    }

    getDescription() {
        return "An interface to a switch sensor and actuator"
    }

    getOutData() {
        return "output(el(switch), [boolean[switchon],boolean[switchoff]])."
    }

    getNewElement() {
        return new SwitchElement()
    }

    getNumberInPorts() {
        return 4
    }

    getNumberOutPorts() {
        return 2
    }

    getTypeInPorts() {
        return ["SwitchOnPort","SwitchOffPort","GetSwitchOnStatePort", "GetSwitchOffStatePort"]
    }

    getTypeOutPorts() {
        return ["SwitchOnStatePort","SwitchOffStatePort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("SwitchOnPort",SwitchOnPort);
        portClasses.set("SwitchOffPort",SwitchOffPort);
        portClasses.set("SwitchOnStatePort",SwitchOnStatePort);
        portClasses.set("SwitchOffStatePort",SwitchOffStatePort);
        portClasses.set("GetSwitchOnStatePort",GetSwitchOnStatePort);
        portClasses.set("GetSwitchOffStatePort",GetSwitchOffStatePort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true;
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        console.log(`LOGGER: Switch received event on port ${portType} from ${sourceName}`);
        console.log(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
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

    handleGlobalEvent(event, portType) {
        if (portType==="SwitchOnStatePort" && this.port.SwitchOnStatePort) {
            console.log(`LOGGER: Switch element sends layout event on ${portType} port`);
            this.port.SwitchOnStatePort.call(event.value)
        }
        else if (portType==="SwitchOffStatePort" && this.port.ContactClosedPort) {
            console.log(`LOGGER: Switch element sends layout event on ${portType} port`);
            this.port.ContactClosedPort.call(event.value)
        }
    }

}
module.exports = SwitchElement;