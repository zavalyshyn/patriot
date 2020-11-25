const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class WatchMyHouse extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        logger.timeLog('App','start');
        // we received camera frame
        logger.infoLog.info(`LOGGER: WatchMyHouse's App element received incoming layout event from ${source} element on ${portType} port`);

        let frameBase64 = event.value;

        let postRequest = {
            action: 'fileUpload',
            data: new Buffer(frameBase64, "base64"),
            fileName: 'camera-image.jpg'
        };

        port.OAuthHttpPostPort.call(postRequest)  // event to be forwarded to HTTP Request module and its HttpPostPort
            .then(function (response) {
                if (response) { // if we received a response event then the tap was opened and we successfully posted the image
                    logger.debugLog.debug(`       DEBUG: Recieved a response from Dropbox: ${response}`);
                    logger.infoLog.info("WatchMyHouse has successfully send the frame to the remote storage")
                }
                logger.timeLog('App','finish');
            })
            .catch(function (err) {
                logger.errorLog.error("ERROR: " + err);
            })
    }
}
module.exports = WatchMyHouse;