const Component = require('../../../core/Component');
const http = require('http');
const logger = require('../../../utils/logger');

class SmokeSensorService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
        this.lastSmokeTime = 0;
    }

    getType() {
        return "SmokeSensor"
    }

    enabling() {

        let that = this;

        const options = {
            host: '192.168.1.216',  // hard-coded local IP address of the Motion Sensor (Arduino Yun)
            port: 1337,
            path: '/smoke'
        };

        let interval = setInterval(checkSmoke, 5000);
        let numExperiment = 0;

        function checkSmoke() {
            if (numExperiment===33 && process.env.NODE_ENV === 'MEASUREMENT') {
                clearInterval(interval);    // stop the loop
                logger.printExperimentResults();
            }
            if (this.stopPooling) {
                logger.infoLog.info("LOGGER: Stopping SmokeSensor service");
                clearInterval(interval); // stop the loop
            } else if (Date.now()-that.lastSmokeTime > 3000) {     // rate-limiting
                logger.newRound();  // start a new round of experiments
                numExperiment += 1;
                logger.timeLog("SmokeSensor",'start');
                http.get(options, (resp) => {
                    let data = '';

                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        // console.log(JSON.parse(data));
                        // parse the response object
                        let smokeEvent = JSON.parse(data);
                        if (smokeEvent.value) {
                            that.lastSmokeTime = Date.now();
                            logger.infoLog.info("\nLOGGER: SmokeSensor Service detected a smoke");
                            logger.infoLog.info("LOGGER: SmokeSensor Service sends new event");
                            logger.debugLog.debug("       DEBUG: SmokeSensor Service calls sendOutgoingEvent");
                            that.sendOutgoingEvent(smokeEvent,"SmokeDetectedPort");
                        }
                        else {
                            logger.timeLog("SmokeSensor",'finish');
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
        //     logger.infoLog.info("\nLOGGER: MotionSensor Service detected a motion");
        //     let motionEvent = {
        //         "value": true
        //     };
        //     logger.infoLog.info("LOGGER: MotionSensor Service sends new event");
        //     logger.debugLog.debug("       DEBUG: MotionSensor Service calls sendOutgoingEvent");
        //     that.sendOutgoingEvent(motionEvent,"MotionDetectedPort");
        // }

        // code for continuous event generation

        // let interval = setInterval(dataPooler, 10*1000);    // every 10 sec
        // function dataPooler() {
        //     logger.infoLog.info("\nLOGGER: MotionSensor Service detected a motion");
        //     let motionEvent = {
        //         "value": true
        //     };
        //
        //     if (this.stopPooling) {
        //         logger.infoLog.info("\nLOGGER: Stopping MotionSensor service");
        //         clearInterval(interval); // stop the loop
        //     } else {
        //         logger.infoLog.info("LOGGER: MotionSensor Service sends new event");
        //         logger.debugLog.debug("       DEBUG: MotionSensor Service calls sendOutgoingEvent");
        //         that.sendOutgoingEvent(motionEvent,"MotionDetectedPort");
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
        return "SmokeSensor"
    }

}
module.exports = SmokeSensorService;