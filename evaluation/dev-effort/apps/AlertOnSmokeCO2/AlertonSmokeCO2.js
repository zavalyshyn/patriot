const AppElements = require("../../core/AppElements");

class AlertonSmokeCO2 extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        if (portType==='CO2Port') {
            let message = '';
            if (event.value === 'tested') {
                message = 'C02 test completed';
            } else if (event.value === 'clear') {
                message = 'Clear of CO2';
            } else if (event.value === 'detected') {
                message = 'Detected C02!'
            }
            notifyUser(message);
        }

        if (portType==='SmokePort') {
            let message = '';
            if (event.value === 'tested') {
                message = 'Smoke test completed';
            } else if (event.value === 'clear') {
                message = 'Clear of smoke';
            } else if (event.value === 'detected') {
                message = 'Detected smoke!'
            }
            notifyUser(message);
        }

        if (portType==='BatteryPort') {
            let batLevel = event.level;
            if (batLevel < 10) {
                let message = `SmokeDetector has low battery level: ${batLevel}`;
                notifyUser(message)
            }
        }

        function notifyUser(msg) {
            if (port.sendPushPort) {
                port.PushNotifier.sendPush(msg)
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                    })
            }

            if (port.sendSMSPort) {
                port.SMSNotifier.sendSMS(msg)
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: " + err);
                    })
            }
        }
    }
}
module.exports = AlertonSmokeCO2;