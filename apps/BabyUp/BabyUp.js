const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class BabyUp extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        if (portType==='MotionDetectedPort' && event) {
            logger.timeLog('App','start');
            logger.infoLog.info(`LOGGER: BabyUp's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            port.GetFramePort.call()
                .then(function (frameEvent) {
                    let base64Image = frameEvent[0].value;    // we always receive an array of resolved promises
                    return port.SendPushWithImagePort.call("Baby woke up", base64Image)
                })
                .then(function () {
                    logger.infoLog.info("LOGGER: BabyUp App Finished");
                    logger.timeLog('App','finish');
                })
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                })
        }

    }
}
module.exports = BabyUp;