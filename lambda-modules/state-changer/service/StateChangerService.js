const Component = require('../../../core/Component');

class StateChangerService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "StateChanger"
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    }

    canHandleIncomingEventOnPortType(portType) {
        return false
    }
}
module.exports = StateChangerService;