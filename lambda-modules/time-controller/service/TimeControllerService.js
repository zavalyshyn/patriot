const Component = require('../../../core/Component');
const logger = require('../../../utils/logger');

class TimeControllerService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "TimeController"
    }

    enabling() {
        // only start the event checking loop if the app needs it (declared the respecting ports)
        if (this.ports.length > 0 && this.ports.includes("ControlSignalPort")) {
            let interval = setInterval(dataPooler, 10*1000);    // every 1 min
            let that = this;

            function dataPooler() {
                logger.timeLog('TimeController','start');
                if (that.stopPooling) {
                    logger.infoLog.info("LOGGER: Stopping TimeController service");
                    clearInterval(interval); // stop the loop
                }

                let startDate = getDate(that.config.starttime); // UTC time
                let endDate = getDate(that.config.endtime); // UTC time

                if (startDate > endDate) { // check if start comes before end
                    var temp  = startDate; // if so, assume it's across midnight
                    startDate = endDate;   // and swap the dates
                    endDate   = temp;
                }

                let result = isWithinRange(startDate,endDate);

                if (result) {
                    logger.infoLog.info("LOGGER: TimeController service sending true event on ControlSignalPort");
                    that.sendOutgoingEvent(true,"ControlSignalPort");
                }
                else  {
                    logger.infoLog.info("LOGGER: TimeController service sending false event on ControlSignalPort");
                    that.sendOutgoingEvent(false,"ControlSignalPort");
                }
            }

            // return UTC date
            function getDate(time) {
                let startHour = time.split(':')[0];
                let startMin = time.split(':')[1];
                let date = new Date();
                date.setUTCHours(startHour,startMin);
                return date;
            }

            // Compares with current UTC time! Your timezone might be different!
            function isWithinRange(start,end) {
                let currentDate = new Date();
                return currentDate < end && currentDate > start;
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
module.exports = TimeControllerService;