const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class LightMyPath extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="MotionDetectedPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: LightMyPath's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            // check the current lights state
            port.GetLightStatePort.call()
                .then(function (stateEvent) {
                    let state = stateEvent[0];  // true for on, false for off
                    if (!state) {
                        logger.infoLog.info("LOGGER: Lights are off. Turning them on and setting the timer");
                        port.TurnOnLightPort.call()
                            .catch(function (err) {
                                logger.errorLog.error("ERROR: " + err);
                            })
                    } else {
                        logger.infoLog.info("LOGGER: Lights are already on. Setting/Updating the timer");
                    }
                })
                .then(() => {
                    logger.timeLog('App','finish');
                    logger.infoLog.info("LOGGER: LightMyPath App Finished");
                })
                .catch((err) => logger.errorLog.error("ERROR: " + err))

        }
        else if (portType==="TimerExpiredPort") {
            logger.infoLog.info(`LOGGER: LightMyPath's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);
            logger.infoLog.info("LOGGER: LightMyPath App Turning Off the lights");
            logger.timeLog('App2','start');
            port.TurnOffLightPort.call()
                .then(function () {
                    logger.infoLog.info("LOGGER: LightMyPath App Finished");
                    logger.timeLog('App2','finish');
                })
        }
    }
}
module.exports = LightMyPath;