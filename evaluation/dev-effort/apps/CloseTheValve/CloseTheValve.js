const AppElements = require("../../core/AppElements");

class CloseTheValve extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        port.ClosePort.call()
            .then(function () {
                return notifyUser();
            })
            .catch(function (err) {
                logger.errorLog.error("ERROR: " + err);
            });

       function notifyUser() {
           if (port.SendSMSPort) {
               port.SendSMSPort.call('We closed the valve because moisture was detected');
           }
           if (port.SendPush) {
               port.sendPushPort.call('We closed the valve because moisture was detected');
           }
       }
    }
}
module.exports = LightOnMotion;