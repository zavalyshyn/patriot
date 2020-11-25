const Component = require('../../../core/Component');

class ORService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "OR"
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    }

    canHandleIncomingEventOnPortType(portType) {
        return false
    }
}
module.exports = ORService;