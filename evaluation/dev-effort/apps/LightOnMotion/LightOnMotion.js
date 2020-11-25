const AppElements = require("../../core/AppElements");

class LightOnMotion extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        if (portType==='MotionDetectedPort') {
            port.TurnOnPort.call()
                .then(function () {
                    return port.StartTimerPort.call()
                })
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                });
        }

        if (portType === 'TimerExpiredPort') {
            port.TurnOffPort.call()
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                })
        }

    }
}
module.exports = LightOnMotion;