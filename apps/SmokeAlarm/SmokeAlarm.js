const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class SmokeAlarm extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="SmokeDetectedPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: SmokeAlarm's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            // check the current lights state
            port.TriggerAlarmPort.call()
                .then( () => {
                    logger.infoLog.info("LOGGER: Alarm is on. Sending a push message");
                    return port.SendPushMessagePort.call("Alarm! Smoke detected!")
                })
                .then(() => {
                    logger.timeLog('App','finish');
                    logger.infoLog.info("LOGGER: SmokeAlarm App Finished");
                })
                .catch((err) => logger.errorLog.error("ERROR: " + err))
        }
    }
}
module.exports = SmokeAlarm;