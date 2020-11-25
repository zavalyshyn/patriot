const AppElements = require("../../core/AppElements");

class NotifyIfItsTooCold extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        let currentTemp = event.temp;

        if (currentTemp < 0) {
            notifyUser("It's too cold. Stay home");
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
module.exports = NotifyIfItsTooCold;