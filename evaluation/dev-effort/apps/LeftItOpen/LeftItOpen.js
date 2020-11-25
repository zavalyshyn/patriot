const AppElements = require("../../core/AppElements");

class LeftItOpen extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {

        if (portType === 'ContactOpenPort') {
            port.StartTimerPort.call()
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                });
        }

        if (portType === 'ContactClosedPort') {
            port.StopTimerPort.call()
                .catch(function (err) {
                    logger.errorLog.error("ERROR: " + err);
                });
        }

        if (portType === 'TimerExpiredPort') {
            notifyUser()
        }

        function notifyUser() {
            if (port.SendSMSPort) {
                port.SendSMSPort.call('Contact sensor has been left open for 1 minute.');
            }
            if (port.SendPushPort) {
                port.sendPushPort.call('Contact sensor has been left open for 1 minute.');
            }
        }
    }
}
module.exports = LeftItOpen;