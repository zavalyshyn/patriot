const AppElements = require("../../core/AppElements");

class DoorNotifier extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="DoorOpenedPort") {  // lock the door lock
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: DoorNotifier's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            // check if everyone left
            port.SendPushMessagePort.call("Door is opened")
                .then(() => {
                    logger.timeLog('App','finish')
                })
                .catch((err) => logger.errorLog.error("ERROR: App code received an error on door close" + err));
        }
        else if (portType==="DoorClosedPort") {
            logger.timeLog('App','start');
            logger.infoLog.info(`LOGGER: DoorNotifier's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);
            port.SendPushMessagePort.call("Door is closed")
                .then(() => {
                    logger.timeLog('App','finish')
                })
                .catch((err) => logger.errorLog.error("ERROR: App code received an error on door close" + err));
        }
    }
}
module.exports = DoorNotifier;