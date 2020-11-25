const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const TurnOnPort = require('../ports/TurnOnPort');
const TurnOffPort = require('../ports/TurnOffPort');
const GetPowerStatusPort = require('../ports/GetPowerStatusPort');
const RealTimeStatPort = require('../ports/RealTimeStatPort');
const GetCurrentUsageStatPort = require('../ports/GetCurrentUsageStatPort');

class SmartPlugElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "SmartPlug"
    }

    getDescription() {
        return "An interface to a TP-Link SmartPlug HS100"
    }

    getOutData() {
        return "output(el(smartplug), [null])."
    }

    getNewElement() {
        return new SmartPlugElement()
    }

    getNumberInPorts() {
        return 4
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["TurnOnPort","TurnOffPort","GetPowerStatusPort"]
    }

    getTypeOutPorts() {
        return ["RealTimeStatPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("TurnOnPort",TurnOnPort);
        portClasses.set("TurnOffPort",TurnOffPort);
        portClasses.set("GetPowerStatusPort",GetPowerStatusPort);
        portClasses.set("RealTimeStatPort",RealTimeStatPort);
        portClasses.set("GetCurrentUsageStatPort",GetCurrentUsageStatPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        console.log(`LOGGER: SmartPlugElement received event on port ${portType} from ${sourceName}`);
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
        if (portType==="RealTimeStatPort" && this.port.RealTimeStatPort) { // if port was initialized
            console.log(`LOGGER: SmartPlug element sends layout event on ${portType} port`);
            this.port.RealTimeStatPort.call(event);
        }
    }

}
module.exports = SmartPlugElement;