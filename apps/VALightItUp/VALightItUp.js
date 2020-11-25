const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class VALightItUp extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="VoiceCommandPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: VALightItUp's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            // check the current lights state
            port.GetLightStatePort.call()
                .then(function (stateEvent) {
                    let state = stateEvent[0];  // true for on, false for off
                    if (!state) {
                        logger.infoLog.info("LOGGER: Lights are off. Turning them on");
                        port.TurnOnLightPort.call()
                            .then(function () {
                                logger.infoLog.info("LOGGER: LightMyPath App Finished");
                                // logger.timeLog('App','finish',new Date().getTime());
                            })
                            .catch(function (err) {
                                logger.errorLog.error("ERROR: " + err);
                            })
                    } else {
                        logger.infoLog.info("LOGGER: Lights are already on. Turning them off");
                        port.TurnOffLightPort.call()
                            .then(function () {
                                logger.infoLog.info("LOGGER: LightMyPath App Finished");
                                // logger.timeLog('App','finish',new Date().getTime());
                            })
                            .catch(function (err) {
                                logger.errorLog.error("ERROR: " + err);
                            })
                    }
                })
                .then(() => logger.timeLog('App','finish'))
                .catch((err) => logger.errorLog.error("ERROR: " + err))

        }
    }
}
module.exports = VALightItUp;