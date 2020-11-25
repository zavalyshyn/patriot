const Component = require('../../../core/Component');

class FitnessTrackerService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "FitnessTracker"
    }

    enabling() {
        let interval = setInterval(dataPooler, 10*1000);    // every 30 sec
        let that = this;
        function dataPooler() {
            console.log("\nLOGGER: FitnessTracker Service obtained a new data sample from the tracker");
            let heartRateEvent = {
                "timestamp": "01/14/19 10:08:02",
                "value": {
                    "bpm": 84,
                    "confidence": 2
                }
            };
            let stepsCountEvent = {
                "timestamp" : "01/14/19 11:38:00",
                "value" : "4"
            };

            if (this.stopPooling) {
                console.log("\nLOGGER: Stopping FitnessTracker service");
                clearInterval(interval); // stop the loop
            } else {
                // send both events to the Fitness Tracker Element
                console.log("LOGGER: FitnessTrackerService sends new steps data samples to FitnessTracker element");
                // console.log("       DEBUG: FitnessTracker Service calls sendOutgoingEvent");
                // that.sendOutgoingEvent(heartRateEvent,"FitTrackerHRPort");
                console.log("       DEBUG: FitnessTracker Service calls sendOutgoingEvent");
                that.sendOutgoingEvent(stepsCountEvent,"FitTrackerStepsPort");
            }
        }
    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {
        return new Promise(function (resolve, reject) {
            if (portType==="FitTrackerVibratePort" && event) {
                // send a vibrate command to the fitness tracker device
                resolve()
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    };

    canHandleIncomingEventOnPortType(portType) {
        return portType === "FitTrackerVibratePort";
    };

    getElementName() {
        return "FitnessTracker"
    }

}
module.exports = FitnessTrackerService;