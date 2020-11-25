const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class SmartSecurity extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        let frame = null;

        if (portType==="OROutPort") {
            logger.timeLog('AppOR','start');
            logger.infoLog.info(`LOGGER: SmartSecurity's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);
            // retrieve a camera frame
            logger.timeLog('AppGettingFrame','start');
            port.GetFramePort.call()
                .then(function (frameEvent) {
                    logger.timeLog('AppGettingFrame','finish');
                    frame = frameEvent[0].value;    // we always receive an array of resolved promises
                    // send push message with camera frame to the user
                    logger.timeLog('AppSendingPushImage','start');
                    return port.SendPushWithImagePort.call("Something happened in the house!", frame);
                })
                .then(function () {
                    logger.timeLog('AppSendingPushImage','finish');
                    // trigger alarm
                    logger.timeLog('AppTriggerAlarm','start');
                    return port.TriggerAlarmPort.call();
                })
                .then(function () {
                    logger.timeLog('AppTriggerAlarm','finish');
                    return tryToSendFrame(frame)
                })
                .then(function (responseEvent) {
                    if (responseEvent) {    // if we received a response event then the tap was opened and we successfully posted the image
                        logger.timeLog('AppSendingFrameToCloud','finish');
                        logger.infoLog.info("APP Received this from the Tap/HttpRequest modules: " + JSON.stringify(responseEvent[0]));
                        logger.infoLog.info("APP has successfully send the frame and message to the security agent");
                    }
                })
                .then(function () {
                    logger.timeLog('AppOR','finish');
                })
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                })
        }

        else if (portType==="CameraFramePort") {
            logger.timeLog('AppProcessingNewFrameWhenTapOpened','start');
            logger.infoLog.info(`LOGGER: SmartSecurity's App element received incoming layout event from ${source} element on ${portType} port`);
            let frame = event.value;
            tryToSendFrame(frame)
                .then(function (responseEvent) {
                    if (responseEvent) { // if we received a response event then the tap was opened and we successfully posted the image
                        logger.infoLog.info("APP Received this from the Tap/HttpRequest modules: " + JSON.stringify(responseEvent[0]));
                        logger.infoLog.info("APP has successfully send the frame to the security agent")
                        logger.timeLog('AppSendingFrameToCloud','finish');
                    }
                })
                .then(function () {
                    logger.timeLog('AppProcessingNewFrameWhenTapOpened','finish');
                })
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                })

        }

        function tryToSendFrame(frame) {
            return new Promise(function (resolve, reject) {
                // check the tap state
                logger.timeLog('AppCheckingTapState','start');
                port.GetTapStatePort.call()
                    .then(function (stateEvent) {
                        let tapState = stateEvent[0];
                        logger.infoLog.info("LOGGER: SmartSecurity got current Tap state: " + tapState);
                        logger.timeLog('AppCheckingTapState','finish');
                        if (tapState===true) { // if tap is opened (true) ... else - do nothing
                            // send a message to a security agent with a camera frame attached
                            let postData = {
                                msg: "Intrusion detected!",
                                cameraFrame: frame
                            };
                            logger.timeLog('AppSendingFrameToCloud','start');
                            return port.TapInPort.call(postData)  // event to be forwarded to HTTP Request module and its HttpPostPort
                        }
                    })
                    .then(function (responseEvent) {
                        resolve(responseEvent);
                    })
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                        reject(err);
                    })
            })
        }

    }
}
module.exports = SmartSecurity;