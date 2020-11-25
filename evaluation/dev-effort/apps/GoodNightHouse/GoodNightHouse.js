const AppElements = require("../../core/AppElements");

class GoodNightHouse extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        if (portType === 'AppTouchPort') {
            port.StartTimerPort.call()
                .then(function () {
                    return port.TurnOnLightPort.call();
                })
                .then(function () {
                    return port.LockDoorPort.call();
                })
                .then(function () {
                    return port.GetModePort.call();
                })
                .then(function (modeEvent) {
                    let currentMode = modeEvent.mode;
                    if (currentMode!=="night") {
                        return port.SetModePort.call('night');
                    }
                })
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                });
        }

        if (portType === 'TimerExpiredPort') {
            port.TurnOffLightPort.call()
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                });
        }
    }
}
module.exports = GoodNightHouse;