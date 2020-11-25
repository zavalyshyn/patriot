const Component = require('../../../core/Component');

class SpeechRecService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "SpeechRec"
    }

    handleIncomingEvent(event,portType) {
        console.log(`LOGGER: SpeechRecService received incoming event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="SpeechRecPort") {
                // process audio file and return the transcript
                let audio = event.audio;
                let transcript = "Spotify play next track"; // dummy response
                let response = {
                    "transcript": transcript
                };
                resolve(response)
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType === "SpeechRecPort"
    }
}
module.exports = SpeechRecService;