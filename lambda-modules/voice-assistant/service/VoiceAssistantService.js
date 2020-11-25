const Component = require('../../../core/Component');
const path = require('path');
const logger = require('../../../utils/logger');
const http = require('http');

class VoiceAssistantService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
    }

    getType() {
        return "VoiceAssistant"
    }

    enabling() {

        // only start the event checking loop if the app needs it (declared the respecting ports)
        if (this.ports.length > 0 && this.ports.includes("VoiceCommandPort" )) {
            let that = this;

            const options = {
                host: '192.168.1.189',  // hard-coded local IP address of my laptop acting as a voice assistant
                // host: '192.168.0.153',  // hard-coded local IP address of my laptop acting as a voice assistant
                port: 4000,
                path: '/command'
            };

            let interval = setInterval(checkContact, 10000);
            let numExperiment = 0;

            function checkContact() {
                if (numExperiment===33 && process.env.NODE_ENV === 'MEASUREMENT') {
                    clearInterval(interval);    // stop the loop
                    console.log();
                    logger.printExperimentResults();
                }
                if (this.stopPooling) {
                    logger.infoLog.info("\nLOGGER: Stopping VoiceAssistant service");
                    clearInterval(interval); // stop the loop
                } else {
                    logger.newRound();  // start a new round of experiments
                    numExperiment += 1;
                    logger.timeLog(that.getType(), 'start');
                    http.get(options, (resp) => {
                        let data = '';

                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        resp.on('end', () => {
                            // parse the response object
                            let commandObject = JSON.parse(data);
                            // if (commandObject.command) {
                            //     let command = commandObject.command;
                            if (commandObject) {    // EVALUATION: remove this line in normal situation
                                let command = '';   // EVALUATION: remove this line in normal situation
                                logger.infoLog.info("\nLOGGER: VoiceAssistant Service detected a new voice command");

                                let wakeWord = that.config.wakeword;

                                // if (command.includes(wakeWord)) {
                                if (!command.includes(wakeWord)) {  // EVALUATION: remove this line in normal situation
                                    logger.infoLog.info("LOGGER: VoiceAssistant Service sends new event");
                                    logger.debugLog.debug("       DEBUG: VoiceAssistant Service calls sendOutgoingEvent");
                                    that.sendOutgoingEvent(commandObject, "VoiceCommandPort");
                                } else {
                                    console.log("Command does not include an app's wake word");
                                }
                            } else {
                                logger.timeLog(that.getType(), 'finish');
                            }
                        });

                    }).on("error", (err) => {
                        logger.errorLog.error("Error: " + err.message);
                    });
                }
            }
        }


    }

    disabling() {}

    handleIncomingEvent(event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: VoiceAssistant Service received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="RecordAudioPort" && event) {

                let recordOptions = {
                    host: '192.168.1.189',  // hard-coded local IP address of my laptop acting as a voice assistant
                    // host: '192.168.0.153',  // hard-coded local IP address of my laptop acting as a voice assistant
                    port: 4000,
                    path: '/record'
                };

                http.get(recordOptions, (resp) => {
                    let data = '';

                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    resp.on('end', () => {
                        // parse the response object
                        let recordingObject = JSON.parse(data);
                        if (recordingObject.recording) {
                            let recording = recordingObject.recording;
                            logger.infoLog.info("LOGGER: VoiceAssistant Service recorded a new audio");
                            resolve(recordingObject)
                        } else {
                            logger.timeLog(portType, 'finish');
                        }
                    });

                }).on("error", (err) => {
                    logger.errorLog.error("Error: " + err.message);
                    reject(err);
                });
            }
            else if (portType==="SayTextPort" && event) {

                let hostname = '192.168.1.189';
                // let hostname = '192.168.0.153';
                let path = '/say';
                let data = JSON.stringify(event);

                let options = {
                    hostname: hostname,
                    path: path,
                    port: 4000,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.length
                    }
                };

                const req = http.request(options, res => {
                    let responseData = [];
                    res.on('data', d => {
                        responseData.push(d);
                    });

                    res.on('end', function () {
                        let response = Buffer.concat(responseData);
                        resolve(JSON.parse(response));
                    })
                });

                req.on('error', error => {
                    logger.errorLog.error(error);
                    reject(error)
                });

                req.write(data);
                req.end();

            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="RecordAudioPort" || "SayTextPort"
    }
}
module.exports = VoiceAssistantService;