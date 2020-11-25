const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class SmartCameraWEncryption extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        logger.timeLog('App','start');
        // we received camera frame
        logger.infoLog.info(`LOGGER: SmartCameraWEncryption's App element received incoming layout event from ${source} element on ${portType} port`);

        let frameBase64 = event.value;

        // check the tap state
        port.GetTapStatePort.call()
            .then(function (stateEvent) {
                let tapState = stateEvent[0];
                logger.infoLog.info("LOGGER: SmartCameraWEncryption got current Tap state: " + tapState);
                if (tapState) { // if tap is opened (true) ... else - do nothing
                    // send a message to a security agent with a camera frame attached
                    let postData = {
                        cameraFrame: frameBase64
                    };
                    return port.TapInPort.call(postData)  // event to be forwarded to HTTP Request module and its HttpPostPort
                }
            })
            .then(function (responseEvent) {
                if (responseEvent) { // if we received a response event then the tap was opened and we successfully posted the image
                    logger.infoLog.info("SmartCameraWEncryption App received this from the Tap/HttpRequest modules: " + JSON.stringify(responseEvent[0]));
                    logger.infoLog.info("SmartCameraWEncryption has successfully sent the frame to the remote storage")
                }
                logger.timeLog('App','finish');
            })
            .catch(function (err) {
                logger.errorLog.error("ERROR: " + err);
            })
    }
}
module.exports = SmartCameraWEncryption;