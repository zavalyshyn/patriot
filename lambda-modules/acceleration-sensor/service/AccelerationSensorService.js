const Component = require('../../../core/Component');

class AccelerationSensorService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "AccelerationSensor"
    }

    enabling() {
        let interval = setInterval(dataPooler, 10*1000);    // every 10 sec
        let that = this;
        function dataPooler() {
            console.log("\nLOGGER: AccelerationSensor Service detected an acceleration");
            let accelerationEvent = {
                "value": true
            };

            if (this.stopPooling) {
                console.log("\nLOGGER: Stopping AccelerationSensor service");
                clearInterval(interval); // stop the loop
            } else {
                console.log("LOGGER: AccelerationSensor Service sends new event");
                console.log("       DEBUG: AccelerationSensor Service calls sendOutgoingEvent");
                that.sendOutgoingEvent(accelerationEvent,"AccelerationDetectedPort");
            }
        }
    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    };

    canHandleIncomingEventOnPortType(portType) {
        return false;
    };

    getElementName() {
        return "AccelerationSensor"
    }

}
module.exports = AccelerationSensorService;