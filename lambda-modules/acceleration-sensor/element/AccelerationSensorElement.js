const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const AccelerationDetectedPort = require('../ports/AccelerationDetectedPort');

class AccelerationSensorElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "AccelerationSensor"
    }

    getDescription() {
        return "An interface to an acceleration sensor"
    }

    getOutData() {
        return "output(el(acceleration), [boolean[accelerationdetected]])."
    }

    getNewElement() {
        return new AccelerationSensorElement()
    }

    getNumberInPorts() {
        return 0
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return null
    }

    getTypeOutPorts() {
        return ["AccelerationDetectedPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("AccelerationDetectedPort",AccelerationDetectedPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return false
    }

    handleLayoutEvent(sourceName,event,portType) {}

    handleGlobalEvent(event, portType) {
        if (portType==="AccelerationDetectedPort" && this.port.AccelerationDetectedPort) {
            console.log(`LOGGER: AccelerationSensor element sends layout event on ${portType} port`);
            this.port.AccelerationDetectedPort.call(event.value)
        }
    }

}
module.exports = AccelerationSensorElement;