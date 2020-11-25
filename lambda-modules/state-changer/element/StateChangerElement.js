const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const StateChangePort = require('../ports/StateChangePort');

class StateChangerElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "StateChanger"
    }

    getDescription() {
        return "An element performing a switch from one app's state to another"
    }

    getOutData() {
        return "output(el(statechanger), [null])."
    }

    getNewElement() {
        return new StateChangerElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["StateChangePort"]
    }

    getTypeOutPorts() {
        return null;
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("StateChangePort",StateChangePort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        console.log(`LOGGER: StateChanger element received incoming layout event on port ${portType} from ${sourceName}`);
        console.log("LOGGER: Switching app's state");
        // let that = this;
        // return new Promise(function (resolve, reject) {
        //     if (portType === "SpeechRecPort") {
        //         that.sendGlobalEvent(event,portType)
        //             .then(function (response) {
        //                 resolve(response)
        //             })
        //             .catch(error => {
        //                 console.log(`ERROR: SpeechRec failed to process the incoming event. \n ${error}`);
        //                 reject(error);
        //             })
        //     }
        // })

    }

    handleGlobalEvent(event, portType) {}

}
module.exports = StateChangerElement;