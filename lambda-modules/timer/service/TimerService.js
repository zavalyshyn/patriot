const Component = require('../../../core/Component');

class TimerService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "Timer"
    }

    enabling() {
        // if  (this.config) {
        //     let time = this.config.time;
        //     // send initial false event to configure downstream elements' input ports
        //     this.sendOutgoingEvent(false,"TimerExpiredPort");
        //     let that = this;
        //     setInterval(function () {
        //         console.log(`LOGGER: Timer Service sends an expired event to the element`);
        //         that.sendOutgoingEvent(true,"TimerExpiredPort");
        //     },time);
        // }
    }

    disabling() {
        this.stopPooling = true;
    }

    // service doesn't support incoming events
    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    };

    canHandleIncomingEventOnPortType(portType) {
        return false;
    };

}
module.exports = TimerService;