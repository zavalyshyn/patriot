const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const UserInputPort = require('../ports/UserInputPort');
const CancelButtonPort = require('../ports/CancelButtonPort');

class UserInputElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "UserInput"
    }

    getDescription() {
        return "Provides access to user defined configs"
    }

    getOutData() {
        return "output(el(userinput), data[datatype])."
    }

    getNewElement() {
        return new UserInputElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["UserInputPort"]
    }

    getTypeOutPorts() {
        return ["CancelButtonPort"];
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("UserInputPort",UserInputPort);
        portsClasses.set("CancelButtonPort",CancelButtonPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        console.log(`LOGGER: UserInput element received event on port ${portType} from ${sourceName}`);
        return new Promise(function (resolve, reject) {
            if (portType === "UserInputPort") {
                that.sendGlobalEvent(event,portType)
                    .then(function (result) {
                        resolve(result)
                    })
                    .catch(error => {
                        console.log(`ERROR: User Input failed to process the incoming event. \n ${error}`);
                        reject(error);
                    })
            }
        })

    }

    handleGlobalEvent(event, portType) {
        if (portType==="CancelButtonPort") {
            console.log(`LOGGER: UserInput element sends layout event on ${portType} port`);
            this.port.CancelButtonPort.call(event);
        }
    }

}
module.exports = UserInputElement;