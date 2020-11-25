const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');
const https = require('https');



class VAWhatsUp extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="VoiceCommandPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: VAWhatsUp's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            const params = {
                country: 'us',
                pageSize: 1,
                apiKey: 'apikey'
            };

            port.HttpGetPort.call(params)
                .then((response) => {
                    let responseObject = response[0];
                    logger.infoLog.info(`LOGGER: Received news headlines ${responseObject}`);
                    logger.infoLog.info(`LOGGER: Title: ${responseObject.articles[0].title}`);
                    return port.SayTextPort.call(responseObject.articles[0].title)
                })
                .then(() => logger.timeLog('App','finish'))
                .catch((err) => logger.errorLog.error("ERROR: App code received an error" + err));
        }
    }
}
module.exports = VAWhatsUp;
