const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const AudioPort = require('../ports/AudioPort');
const logger = require('../../../utils/logger');

class WakewordDetectionElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "WakewordDetection"
    }

    getDescription() {
        return "An element verifies if an audio recording contains a wakeword in it"
    }

    getOutData() {
        return "output(el(wakeworddetection), [audio])."
    }

    getNewElement() {
        return new WakewordDetectionElement()
    }

    getNumberInPorts() {
        return 0
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return null
    }

    getTypeOutPorts() {
        return ["AudioPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("AudioPort",AudioPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {}

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="AudioPort" && that.port.AudioPort) {
                logger.infoLog.info(`LOGGER: WakewordDetection element sends layout event on ${portType} port`);
                that.port.AudioPort.call(event)
                    .then(resolve)
                    .catch(reject);
            } else reject
        })
    }

}
module.exports = WakewordDetectionElement;