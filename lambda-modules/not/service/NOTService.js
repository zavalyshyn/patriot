const Component = require('../../../core/Component');

class NOTService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "NOT"
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    }

    canHandleIncomingEventOnPortType(portType) {
        return false
    }
}
module.exports = NOTService;