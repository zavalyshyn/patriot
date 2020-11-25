const Component = require('../../../core/Component');

class SwitchService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "Switch"
    }

    enabling() {
        let interval = setInterval(dataPooler, 10*1000);    // every 10 sec
        let that = this;
        function dataPooler() {
            console.log("\nLOGGER: Switch Service detected an acceleration");
            let switchOnEvent = {
                "value": true
            };
            let switchOffEvent = {
                "value": true
            };

            if (this.stopPooling) {
                console.log("\nLOGGER: Stopping Switch service");
                clearInterval(interval); // stop the loop
            } else {
                console.log("LOGGER: Switch Service sends new event");
                console.log("       DEBUG: Switch Service calls sendOutgoingEvent");
                that.sendOutgoingEvent(switchOnEvent,"SwitchOnStatePort");
                that.sendOutgoingEvent(switchOffEvent,"SwitchOffStatePort");
            }
        }
    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {
        return new Promise(function (resolve, reject) {
            if (event && portType==="SwitchOnPort") {
                // do switch on
                resolve();
            }
            else if (event && portType==="SwitchOffPort") {
                // do switch off
                resolve();
            }
            else if (event && portType==="GetSwitchOnStatePort") {
                let switchOnStateEvent = {
                    "value": true
                };
                resolve(switchOnStateEvent)
            }
            else if (event && portType==="GetSwitchOffStatePort") {
                let switchOffStateEvent = {
                    "value": true
                };
                resolve(switchOffStateEvent)
            }
        });
    }

    canHandleIncomingEvent() {
        return true;
    };

    canHandleIncomingEventOnPortType(portType) {
        return portType===("SwitchOnPort" || "SwitchOffPort" || "GetSwitchOnStatePort" || "GetSwitchOffStatePort");
    };

    getElementName() {
        return "Switch"
    }

}
module.exports = SwitchService;