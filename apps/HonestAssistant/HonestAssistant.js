const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class HonestAssistant extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        logger.timeLog('App','start');

        logger.infoLog.info(`LOGGER: HonestAssistant's App element received incoming layout event from ${source} element on ${portType} port`);

        let postData = {
            audio: event.audio
        };

        port.HttpPostPort.call(postData)
            .then(function (responseEvent) {
                if (responseEvent) { // if we received a response event then the tap was opened and we successfully posted the image
                    logger.infoLog.info("HonestAssistant App received this from the HttpRequest module: " + JSON.stringify(responseEvent[0]));
                    logger.infoLog.info("HonestAssistant has successfully send the audio to a remote cloud")
                    logger.timeLog('App','finish');
                }
            })
            .catch(function (err) {
                logger.errorLog.error("ERROR: " + err);
            })

    }
}
module.exports = HonestAssistant;