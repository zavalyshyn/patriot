const Component = require('../../../core/Component');

class ANDService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "AND"
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    }

    canHandleIncomingEventOnPortType(portType) {
        return false
    }
}
module.exports = ANDService;