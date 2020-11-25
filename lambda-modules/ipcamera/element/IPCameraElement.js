const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const CameraFramePort = require('../ports/CameraFramePort');
const GetFramePort = require('../ports/GetFramePort');
const logger = require('../../../utils/logger');

class IPCameraElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "IPCamera"
    }

    getDescription() {
        return "An interface to an IP camera device"
    }

    getOutData() {
        return "output(el(graphvis), [img[frame],boolean[motiondetected]])."
    }

    getNewElement() {
        return new IPCameraElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["GetFramePort"]
    }

    getTypeOutPorts() {
        return ["CameraFramePort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("CameraFramePort",CameraFramePort);
        portClasses.set("GetFramePort",GetFramePort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.timeLog(`IPCameraGetFrame`,'start');
        logger.infoLog.info(`LOGGER: IPCamera element received event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${that.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(`IPCameraGetFrame`,'finish');
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
            if (portType==="CameraFramePort" && that.port.CameraFramePort) { // if port was initialized
                logger.infoLog.info(`LOGGER: IPCamera element sends layout event on ${portType} port`);
                logger.timeLog(`IPCameraGettingAndSendingNewFrame`,'finish');
                // that.port.CameraFramePort.call(event.timestamp,event.frame)
                that.port.CameraFramePort.call(event.value)
                    .then(resolve)
                    .catch((err)=>reject(err))
            }
        })

    }

}
module.exports = IPCameraElement;