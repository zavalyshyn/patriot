const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');

class EnergySaver extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        let measuredValue = event.value;

        if (measuredValue > 500) {
            port.TurnOffPort.call()
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                });
        }
    }
}
module.exports = EnergySaver;