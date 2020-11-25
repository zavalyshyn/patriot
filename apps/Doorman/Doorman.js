const AppElements = require("../../core/AppElements");

class Doorman extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="PersonLeftPort") {  // lock the door lock
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: Doorman's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            // check if everyone left
            port.CheckPresencePort.call()
                .then((resp) => {
                    let responseObject = resp[0];
                    if (!responseObject.value) {    // if false (i.e. everone left)
                        port.DoorLockClosePort.call()
                            .then(() => logger.timeLog('App','finish'))
                            .catch((err) => logger.errorLog.error("ERROR: App code received an error on door close" + err));
                    }
                })
                .catch((err) => logger.errorLog.error("ERROR: App code received an error" + err));
        }
        else if (portType==="PersonArrivedPort") {
            logger.timeLog('App','start');
            logger.infoLog.info(`LOGGER: Doorman's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);
            port.DoorLockOpenPort.call()
                .then(() => logger.timeLog('App','finish'))
                .catch((err) => logger.errorLog.error("ERROR: App code received an error on door open" + err));
        }
    }
}
module.exports = Doorman;