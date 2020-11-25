const Component = require('../../../core/Component');
const logger = require('../../../utils/logger');
const Motion = require('motion-detect').Motion;


class MotionDetectionService extends Component {
    constructor() {
        super();
        this.motion = new Motion();
    }

    getType() {
        return "MotionDetection"
    }

    enabling() {}

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {
        logger.infoLog.info(`LOGGER: MotionDetection Service received event on port ${portType}`);
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="CheckForMotionPort" && event.value) {

                // let cameraFrame = new Buffer.from(event.value, 'base64');
                // let oldCameraFrame = that.motion.getLastImage();
                // console.log("NEW: ",cameraFrame);
                // console.log("OLD: ",oldCameraFrame);
                let hasMotion = that.motion.detect(new Buffer.from(event.value, 'base64'));
                logger.debugLog.debug(`       DEBUG: Result of motion detection: ${hasMotion}`);
                // let encryptedData = that.cipher.update(event.value, 'base64', 'base64');
                // encryptedData += that.cipher.final('base64');

                if (hasMotion) {
                    resolve({value: true});
                    // logger.debugLog.debug('Encrypted data: ' + encryptedData);
                } else {
                    resolve({value: false})
                }
            }
        })
    }

    canHandleIncomingEvent() {
        return true;
    };

    canHandleIncomingEventOnPortType(portType) {
        return portType === "CheckForMotionPort";
    };

}
module.exports = MotionDetectionService;