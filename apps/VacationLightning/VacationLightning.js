const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class VacationLightning extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="RepeaterControlSignalPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: VacationLightning's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            // check the current lights state
            port.GetLightStatePort.call()
                .then(function (stateEvent) {
                    let state = stateEvent[0];  // true for on, false for off
                    if (!state) {
                        let turnOn = Math.random() >= 0.5; // 50% probability of a true event
                        if (turnOn) {
                            logger.infoLog.info("LOGGER: Lights are off. Turning them on");
                            return port.TurnOnLightPort.call();
                        }
                    } else {
                        let turnOff = Math.random() >= 0.5; // 50% probability of a true event
                        if (turnOff) {
                            logger.infoLog.info("LOGGER: Lights are already on. Switching them off");
                            return port.TurnOffLightPort.call();
                        }
                    }
                })
                .then(() => {
                    logger.timeLog('App','finish');
                    logger.infoLog.info("LOGGER: VacationLightning App Finished");
                })
                .catch((err) => logger.errorLog.error("ERROR: " + err))

        }
    }
}
module.exports = VacationLightning;