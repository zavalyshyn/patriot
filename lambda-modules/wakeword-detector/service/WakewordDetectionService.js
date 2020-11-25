const Component = require('../../../core/Component');
const logger = require('../../../utils/logger');
const wav = require('wav');
const http = require('http');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;
const Readable = require('stream').Readable;

class WakewordDetectionService extends Component {
    constructor() {
        super();
        this.stopPooling = false;

        this.models = new Models();
        this.models.add({
            file: './resources/models/alexa.umdl',
            sensitivity: '0.5',
            hotwords : 'alexa'
        });

        // this.detector = new Detector({
        //     resource: './resources/models/common.res',
        //     models: this.models,
        //     audioGain: 1.0,
        //     applyFrontend: false
        // });

        this.wakewordDetected = false;
    }

    getType() {
        return "WakewordDetection"
    }

    enabling() {

        let that = this;

        const options = {
            host: '192.168.1.216',  // hard-coded local IP address of the Motion Sensor (Arduino Yun)
            port: 1337,
            path: '/audio'
        };

        let interval = setInterval(checkAudio, 5000);
        let numExperiment = 0;

        process.setMaxListeners(0);

        function checkAudio() {

            let detector = new Detector({
                resource: './resources/models/common.res',
                models: that.models,
                audioGain: 1.0,
                applyFrontend: false
            });

            logger.infoLog.info("LOGGER: Started WakewordDetection service");

            if (that.stopPooling) {
                logger.infoLog.info("LOGGER: Stopping WakewordDetection service");
                clearInterval(interval); // stop the loop
            } else {
                // if (numExperiment===33 && process.env.NODE_ENV === 'MEASUREMENT') {
                //     clearInterval(interval);    // stop the loop
                //     console.log();
                //     logger.printExperimentResults();
                // }
                // numExperiment += 1;
                logger.timeLog('WakewordDetection','start');
                http.get(options, (resp) => {
                    let data = [];

                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data.push(chunk);
                    });

                    resp.pipe(detector);

                    resp.on('end',() => {
                        logger.infoLog.info("LOGGER: WakeworDetection Service freceived the full the audio");
                        let audioBuffer = Buffer.concat(data);

                        // convert audio binary to base64 string. Yeah, I know,
                        // but I don't have time to implement proper streaming
                        // and it's fairly easy to parse back
                        let audioEvent = {
                            audio: new Buffer.from(audioBuffer).toString('base64')
                        };

                        if (that.wakewordDetected) {
                            // if hotword detected forward the audio to the app
                            logger.infoLog.info("LOGGER: WakeworDetection Service forwards the audio");
                            logger.debugLog.debug("       DEBUG: WakeworDetection Service calls sendOutgoingEvent");
                            that.sendOutgoingEvent(audioEvent,"AudioPort");
                            logger.timeLog('WakewordDetection','finish');
                            that.wakewordDetected = false;

                        }
                        resp.unpipe(detector);
                    })

                }).once("error", (err) => {
                    logger.errorLog.error("Error: " + err.message);
                });

            }

            detector.once('hotword', function (index, hotword) {
                that.wakewordDetected = true;
                logger.infoLog.info(`LOGGER: WakeworDetection detected a wakeword ${hotword}`);
            });
        }



    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {}

    canHandleIncomingEvent() {
        return false;
    }

    canHandleIncomingEventOnPortType(portType) {
        return false
    }
}
module.exports = WakewordDetectionService;