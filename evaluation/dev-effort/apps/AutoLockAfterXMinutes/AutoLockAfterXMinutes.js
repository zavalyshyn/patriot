const AppElements = require("../../core/AppElements");

class AutoLockAfterXMinutes extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==='DoorStatePort') {
            if (event.value === 'locked') {
                port.StopTimerPort.call()
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                    })
            }
            else {
                port.SetTimerPort.call()
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                    })
            }
        }

        if (portType === 'TimerExpiredPort') {
            port.LockDoorPort.call()
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                })
        }

    }
}
module.exports = AutoLockAfterXMinutes;