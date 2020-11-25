const AppElements = require("../../core/AppElements");

class ThermostatWindowCheck extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==='ThermostatStatePort') {
            let thermoState = event.state;
            if (thermoState) {
                port.GetContactStatePort.call()
                    .then(function (response) {
                        let contactState = response.state;
                        if (contactState) { // if window is opened
                            notifyUser('Window is opened when thermostat is on');
                            return port.StartTimerPort.call()
                        }
                    })
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                    });
            }
            else {  // if thermostat if off
                port.StopTimerPort.call()
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                    });
            }
        }

        if (portType === 'ContactStatePort') {
            let contactState = event.state;
            if (contactState) { // if opened
                port.GetThermostatStatePort.call()
                    .then(function (response) {
                        let thermoState = response.state;
                        if (thermoState)  { // if it's on
                            notifyUser('Window is opened when thermostat is on');
                            return port.StartTimerPort.call()
                        }
                    })
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                    });
            }
            else {  // if contact is closed
                port.StopTimerPort.call()
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                    });
            }
        }

        if (portType==="TimerExpiredPort") {
            // turn off the thermostat
            port.TurnOffThermostatPort.call()
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                });
        }

        function notifyUser(msg) {
            if (port.SendSMSPort) {
                port.SendSMSPort.call(msg);
            }
            if (port.SendPushPort) {
                port.sendPushPort.call(msg);
            }
        }
    }
}
module.exports = ThermostatWindowCheck;