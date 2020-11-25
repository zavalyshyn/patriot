const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const logger = require('../../../utils/logger');
const RecordAudioPort = require('../ports/RecordAudioPort');
const SayTextPort = require('../ports/SayTextPort');
const VoiceCommandPort = require('../ports/VoiceCommandPort');

class VoiceAssistantElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "VoiceAssistant"
    }

    getDescription() {
        return "An interface to a voice assistant smart speaker"
    }

    getOutData() {
        return "output(el(vocieassistant), [null])."
    }

    getNewElement() {
        return new VoiceAssistantElement()
    }

    getNumberInPorts() {
        return 3
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["RecordAudioPort","SayTextPort"]
    }

    getTypeOutPorts() {
        return ["VoiceCommandPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("RecordAudioPort",RecordAudioPort);
        portClasses.set("SayTextPort",SayTextPort);
        portClasses.set("VoiceCommandPort",VoiceCommandPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.timeLog(portType, 'start');
        logger.infoLog.info(`LOGGER: Voice Assistant Element received event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(portType, 'finish');
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="VoiceCommandPort" && that.port.VoiceCommandPort) { // if port was initialized
                logger.infoLog.info(`LOGGER: VoiceAssistant element sends layout event on ${portType} port`);
                logger.timeLog(that.getType(),'finish');
                // that.port.CameraFramePort.call(event.timestamp,event.frame)
                that.port.VoiceCommandPort.call(event.command)
                    .then(resolve)
                    .catch((err)=>reject(err))
            }
        })

    }

}
module.exports = VoiceAssistantElement;