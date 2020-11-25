const Component = require('../../../core/Component');

class TapService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "Tap"
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    }

    canHandleIncomingEventOnPortType(portType) {
        return false
    }
}
module.exports = TapService;