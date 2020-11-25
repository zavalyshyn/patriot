const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class VAWillItRain extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="VoiceCommandPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: WillItRain's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            const params = {
                id: id,
                appid: 'appid'
            };

            port.HttpGetPort.call(params)
                .then((response) => {
                    let responseObject = response[0];
                    logger.infoLog.info(`LOGGER: Received weather forecast ${responseObject}`);
                    let humidityLevel = responseObject.main.humidity;
                    logger.infoLog.info(`LOGGER: Humidity level (%): ${humidityLevel}`);
                    let willRainToday = false;
                    if (humidityLevel>50) willRainToday = true;
                    return port.SayTextPort.call(`It will ${(willRainToday) ? '' : 'not'} rain today`)
                })
                .then(() => logger.timeLog('App','finish'))
                .catch((err) => logger.errorLog.error("ERROR: App code received an error" + err));
        }
    }
}
module.exports = VAWillItRain;
