const Component = require('../../../core/Component');

class UserInputService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "UserInput"
    }

    enabling() {
        // send initial false event to configure downstream elements' input ports
        this.sendOutgoingEvent(false,"CancelButtonPort");
        let that = this;
        let counter = setInterval(function () {
            console.log(`LOGGER: UserInput Service sends a cancel button event to the element`);
            that.sendOutgoingEvent(true,"CancelButtonPort");
        },10000);
    }

    disabling() {
        this.stopPooling = true;    // TODO: fix this to actually stop the enabling loop. For all other elements as well (e.g. Timer)
    }

    handleIncomingEvent(event,portType) {
        if (portType==="UserInputPort" && event) {
            return new Promise(function (resolve, reject) {
                // get the requested user input config and return it
                // let data = userInputData.get(event.request);
                console.log("LOGGER: UserInputService received event on port " + portType);
                let response = {
                    "request": event.request,
                    "response": 50
                };
                resolve(response);
                // or return error otherwise
                // reject("Couldn't find the requested user input config");
            })
        }
    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="UserInputPort"
    }
}
module.exports = UserInputService;