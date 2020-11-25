const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class VADoorCheck extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="VoiceCommandPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: DoorCheck's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            // check the current lights state
            port.GetDoorLockStatePort.call()
                .then(function (stateEvent) {
                    let state = stateEvent[0];
                    let doorState = state.opened; // true for open, false for closed
                    logger.infoLog.info(`LOGGER: APP RECEIVED: ${JSON.stringify(state)}`);
                    if (doorState) {
                        logger.infoLog.info("LOGGER: Door is opened");
                        return port.SayTextPort.call("Door is opened")
                    } else {
                        logger.infoLog.info("LOGGER: Door is closed");
                        return port.SayTextPort.call("Door is closed")
                    }
                })
                .then(() => logger.timeLog('App','finish'))
                .catch((err) => logger.errorLog.error("ERROR: " + err))

        }
    }
}
module.exports = VADoorCheck;