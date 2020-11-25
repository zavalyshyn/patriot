const Component = require('../../../core/Component');
const http = require('http');
const logger = require('../../../utils/logger');

class PresenceSensorService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "PresenceSensor"
    }

    enabling() {
        if (this.ports.length > 0 && (this.ports.includes("PersonArrivedPort") || this.ports.includes("PersonLeftPort"))) {
            let interval = setInterval(dataPooler, 5*1000);    // every 10 sec
            let that = this;
            let numExperiment = 0;
            function dataPooler() {
                if (numExperiment===33 && process.env.NODE_ENV === 'MEASUREMENT') {
                    clearInterval(interval);    // stop the loop
                    logger.printExperimentResults();
                }
                if (this.stopPooling) {
                    logger.infoLog.info("\nLOGGER: Stopping PresenceSensor service");
                    clearInterval(interval); // stop the loop
                } else {
                    logger.newRound();  // start a new round of experiments
                    numExperiment += 1;
                    logger.timeLog(that.getType(),'start');
                    http.get('http://192.168.1.173', (res) => {   // IP address of my phone
                    }).on('error', (e) => {
                        if (e.code==="ECONNREFUSED") {
                            let presenceEvent = {
                                "value": true
                            };
                            logger.infoLog.info("LOGGER: PresenceSensor Service detected the person presence");
                            logger.debugLog.debug("       DEBUG: PresenceSensor Service calls sendOutgoingEvent");
                            that.sendOutgoingEvent(presenceEvent,"PersonArrivedPort");
                            // that.sendOutgoingEvent(presenceEvent,"PersonLeftPort");  // EVALUATION: delete this line in production
                        } else if (e.code==="EHOSTUNREACH") {
                            let absentEvent = {
                                "value": true
                            };
                            logger.infoLog.info("LOGGER: PresenceSensor Service detected the person has left");
                            logger.debugLog.debug("       DEBUG: PresenceSensor Service calls sendOutgoingEvent");
                            that.sendOutgoingEvent(absentEvent,"PersonLeftPort");
                        }
                    });
                }
            }
        }
    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {
        logger.infoLog.info(`LOGGER: Presence Sensor Service received event on port ${portType}`);
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="CheckPresencePort" && event.query==="presence") {
                let presence = false;
                http.get('http://192.168.1.173', (res) => {   // IP address of my phone
                }).on('error', (e) => {
                    if (e.code==="ECONNREFUSED") {
                        presence = true;
                    }
                    let presenceEvent = {
                        "value": presence
                    };
                    resolve(presenceEvent);
                });
            }
        })
    }

    canHandleIncomingEvent() {
        return true;
    };

    canHandleIncomingEventOnPortType(portType) {
        return portType==="CheckPresencePort";
    };

    getElementName() {
        return "PresenceSensor"
    }

}
module.exports = PresenceSensorService;