const Component = require('../../../core/Component');

class IntervalControllerService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "IntervalController"
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    }

    canHandleIncomingEventOnPortType(portType) {
        return false
    }
}
module.exports = IntervalControllerService;