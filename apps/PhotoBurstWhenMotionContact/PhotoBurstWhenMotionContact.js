const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class PhotoBurstWhenMotionContact extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        logger.timeLog('App','start');

        logger.infoLog.info(`LOGGER: PhotoBurstWhenMotionContact's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

        // retrieve a camera frame
        port.GetFramePort.call()
            .then(function (frameEvent) {
                let base64Image = frameEvent[0].value;    // we always receive an array of resolved promises
                return port.SendPushWithImagePort.call("Something happened in the house!", base64Image)
            })
            .then(function () {
                logger.infoLog.info("LOGGER: PhotoBurstWhen App Finished");
                logger.timeLog('App','finish');
            })
            .catch(function (err) {
                logger.errorLog.error("ERROR: " + err);
            })
    }
}
module.exports = PhotoBurstWhenMotionContact;