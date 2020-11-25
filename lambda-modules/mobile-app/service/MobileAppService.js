const Component = require('../../../core/Component');

class MobileAppService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "MobileApp"
    }

    handleIncomingEvent(event,portType) {
        console.log(`LOGGER: MobileAppService received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="DisplayFramePort" && event) {
                // display frames in the mobile app
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
        return portType==="DisplayFramePort"
    }
}
module.exports = MobileAppService;