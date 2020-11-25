const Component = require('../../../core/Component');

class SmsService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "Sms"
    }

    handleIncomingEvent(event,portType) {
        console.log(`LOGGER: SmsService received event ${JSON.stringify(event)} on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="SendSmsPort" && event) {
                // send sms
                resolve()
                // or
                // reject()
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="SendSmsPort"
    }
}
module.exports = SmsService;