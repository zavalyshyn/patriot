const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const FitTrackerHRPort = require('../ports/FitTrackerHRPort');
const FitTrackerStepsPort = require('../ports/FitTrackerStepsPort');
const FitTrackerVibratePort = require('../ports/FitTrackerVibratePort');

class FitnessTrackerElement extends NativeLayoutElement {
    constructor(config) {
        super();
    }

    getType() {
        return "FitnessTracker"
    }

    getDescription() {
        return "An interface to a Fitness Tracker device"
    }

    getOutData() {
        return "output(el(fitnesstracker), [ data(stepCount) ])."
    }

    getNewElement() {
        return new FitnessTrackerElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 2
    }

    getTypeInPorts() {
        return ["FitTrackerVibratePort"]
    }

    getTypeOutPorts() {
        return ["FitTrackerHRPort","FitTrackerStepsPort"]
    }

    getPortsClasses() {
        let ports = new Map();
        ports.set("FitTrackerVibratePort", FitTrackerVibratePort);
        ports.set("FitTrackerHRPort",FitTrackerHRPort);
        ports.set("FitTrackerStepsPort",FitTrackerStepsPort);
        return ports;
    }


    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        console.log(`LOGGER: FitnessTracker element received an event on port ${portType} from ${sourceName}`);
        return new Promise(function (resolve, reject) {
            if (portType==="FitTrackerVibratePort") {
                that.sendGlobalEvent(event,portType)
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        console.log(`ERROR: ${that.getName()} failed to handle incoming layout event`);
                        reject(err);
                    })
            }
        })

    }

    handleGlobalEvent(event, portType) {
        if (portType==="FitTrackerHRPort" && this.downstream.getElementsOnPort(portType)) {
            console.log("LOGGER: FitnessTracker Element sending event to HR port");
            // port.FitTrackerHRPort.call(event)    // this seems to be a better way to handle events from service
            this.port.FitTrackerHRPort.call(event.timestamp,event.value.bpm,event.value.confidence)
        }
        else if (portType==="FitTrackerStepsPort" && this.downstream.getElementsOnPort(portType)) {
            console.log("LOGGER: FitnessTracker Element sending event to downstream elements on FitnessTrackerSteps port");
            // port.FitTrackerStepsPort.call(event)
            console.log("       DEBUG: FitnessTrackerElement's handleGlobalEvent calls port.FitTrackerStepsPort.call()");
            this.port.FitTrackerStepsPort.call(event.timestamp,event.value)
        }
    }
}
module.exports = FitnessTrackerElement;