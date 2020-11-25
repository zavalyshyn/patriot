const Component = require('../../../core/Component');
const http = require('http');
const logger = require('../../../utils/logger');

class ContactSensorService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "ContactSensor"
    }

    enabling() {

        let that = this;

        const options = {
            host: '192.168.1.216',  // hard-coded local IP address of the Motion Sensor (Arduino Yun)
            port: 1337,
            path: '/contact'
        };

        let interval = setInterval(checkContact, 5000);

        function checkContact() {
            if (this.stopPooling) {
                logger.infoLog.info("\nLOGGER: Stopping MotionSensor service");
                clearInterval(interval); // stop the loop
            } else {
                logger.timeLog("ContactSensor",'start');
                http.get(options, (resp) => {
                    let data = '';

                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    resp.on('end', () => {
                        // parse the response object
                        let contactEvent = JSON.parse(data);
                        if (contactEvent.value) {
                            logger.infoLog.info("\nLOGGER: ContactSensor Service detected a contact open");
                            logger.infoLog.info("LOGGER: ContactSensorService Service sends new event");
                            logger.debugLog.debug("       DEBUG: ContactSensorService Service calls sendOutgoingEvent");
                            that.sendOutgoingEvent(contactEvent,"ContactOpenPort");
                        } else {
                            logger.timeLog("ContactSensor",'finish',new Date().getTime());
                        }
                    });

                }).on("error", (err) => {
                    logger.errorLog.error("Error: " + err.message);
                });
            }
        }

        // generate just one event
        // sendOneEvent();
        // function sendOneEvent() {
        //     logger.infoLog.info("\nLOGGER: ContactSensor Service detected a contact open");
        //     let contactOpenEvent = {
        //         "value": true
        //     };
        //     logger.infoLog.info("LOGGER: ContactSensorService Service sends new event");
        //     logger.debugLog.debug("       DEBUG: ContactSensorService Service calls sendOutgoingEvent");
        //     that.sendOutgoingEvent(contactOpenEvent,"ContactOpenPort");
        // }

        // code for continuous event generation

        // let interval = setInterval(dataPooler, 10*1000);    // every 10 sec
        //
        // function dataPooler() {
        //     logger.infoLog.info("\nLOGGER: ContactSensorService Service detected a contact open");
        //     let contactOpenEvent = {
        //         "value": true
        //     };
        //
        //     logger.infoLog.info("LOGGER: ContactSensorService Service detected a contact closed");
        //     let contactClosedEvent = {
        //         "value": true
        //     };
        //
        //     if (this.stopPooling) {
        //         logger.infoLog.info("\nLOGGER: Stopping ContactSensorService service");
        //         clearInterval(interval); // stop the loop
        //     } else {
        //         logger.infoLog.info("LOGGER: ContactSensorService Service sends new event");
        //         logger.debugLog.debug("       DEBUG: ContactSensorService Service calls sendOutgoingEvent");
        //         that.sendOutgoingEvent(contactOpenEvent,"ContactOpenPort");
        //         that.sendOutgoingEvent(contactClosedEvent,"ContactClosedPort");
        //     }
        // }
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

    getElementName() {
        return "ContactSensor"
    }

}
module.exports = ContactSensorService;