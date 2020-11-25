const AppElements = require("../../core/AppElements");

class HoneyImHome extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="PersonArrivedPort") {  // lock the door lock
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: HoneyImHome's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            // check if everyone left
            port.SendPushMessagePort.call("Someone arrived home")
                .then(() => {
                    logger.timeLog('App','finish')
                })
                .catch((err) => logger.errorLog.error("ERROR: App code received an error on door close" + err));
        }
    }
}
module.exports = HoneyImHome;