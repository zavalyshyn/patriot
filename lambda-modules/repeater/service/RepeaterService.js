const Component = require('../../../core/Component');
const logger = require('../../../utils/logger');

class RepeaterService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "Repeater"
    }

    enabling() {
        let numExperiment = 0;
        let that = this;

        // only start the event checking loop if the app needs it (declared the respecting ports)
        if (this.ports.length > 0 && this.ports.includes("RepeaterControlSignalPort")) {
            let interval = setInterval(dataPooler, that.config.repeatInterval);

            function dataPooler() {
                if (numExperiment===66 && process.env.NODE_ENV === 'MEASUREMENT') {
                    clearInterval(interval);    // stop the loop
                    logger.printExperimentResults();
                }
                logger.newRound();  // start a new round of experiments
                numExperiment += 1;

                logger.timeLog('Repeater','start');
                if (that.stopPooling) {
                    logger.infoLog.info("LOGGER: Stopping Repeater service");
                    clearInterval(interval); // stop the loop
                }

                logger.infoLog.info("LOGGER: Repeater service sending event on RepeaterControlSignalPort");
                that.sendOutgoingEvent(true,"RepeaterControlSignalPort");
            }
        }
    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    };

    canHandleIncomingEventOnPortType(portType) {
        return false;
    };

}
module.exports = RepeaterService;