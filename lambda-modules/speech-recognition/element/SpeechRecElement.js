const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const SpeechRecPort = require('../ports/SpeechRecPort');
const SpeechRecOutPort = require('../ports/SpeechRecOutPort');

class SpeechRecElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "SpeechRec"
    }

    getDescription() {
        return "An interface to a speech recognition service"
    }

    getOutData() {
        return "output(el(speechrec), [string[text]])."
    }

    getNewElement() {
        return new SpeechRecElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["SpeechRecPort"]
    }

    getTypeOutPorts() {
        return ["SpeechRecOutPort"];
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("SpeechRecPort",SpeechRecPort);
        portsClasses.set("SpeechRecOutPort",SpeechRecOutPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        console.log(`LOGGER: SpeechRec element received incoming layout event on port ${portType} from ${sourceName}`);
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType === "SpeechRecPort") {
                that.sendGlobalEvent(event,portType)
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(error => {
                        console.log(`ERROR: SpeechRec failed to process the incoming event. \n ${error}`);
                        reject(error);
                    })
            }
        })

    }

    handleGlobalEvent(event, portType) {}

}
module.exports = SpeechRecElement;