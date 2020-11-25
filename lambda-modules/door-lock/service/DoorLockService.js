const Component = require('../../../core/Component');
const Hue = require('philips-hue');
const fs = require('fs');
const path = require('path');
const logger = require('../../../utils/logger');
const http = require('http');

class DoorLockService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
        this.lastCheckTime = 0;
    }

    getType() {
        return "DoorLock"
    }

    enabling() {

        // only start the event checking loop if the app needs it (declared the respecting ports)
        if (this.ports.length > 0 && this.ports.includes("DoorOpenedPort" || "DoorClosedPort")) {
            let that = this;

            const options = {
                host: '192.168.1.216',  // hard-coded local IP address of the Motion Sensor (Arduino Yun)
                port: 1337,
                path: '/doorlock'
            };

            let interval = setInterval(checkDoorLock, 5000);
            let numExperiment = 0;

            function checkDoorLock() {
                if (numExperiment===33 && process.env.NODE_ENV === 'MEASUREMENT') {
                    clearInterval(interval);    // stop the loop
                    console.log();
                    // console.log(JSON.stringify(logger.logHistory()));
                    // console.log("AVERAGE DURATION FOR EACH ELEMENT: ");
                    logger.printExperimentResults();
                }
                if (this.stopPooling) {
                    logger.infoLog.info("LOGGER: Stopping DoorLock service");
                    clearInterval(interval); // stop the loop
                } else if (Date.now() - that.lastCheckTime > 3000) {     // rate-limiting
                    logger.newRound();  // start a new round of experiments
                    numExperiment += 1;
                    logger.timeLog("DoorLock", 'start');
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
                            // let doorState = JSON.parse(data).open;  // true for open, false for closed
                            let doorState = true;  // EVALUATION: delete this line in production
                            if (doorState) {
                                that.lastCheckTime = Date.now();
                                logger.infoLog.info("\nLOGGER: DoorLock Service detected a door opened event");
                                logger.infoLog.info("LOGGER: DoorLock Service sends new event");
                                logger.debugLog.debug("       DEBUG: DoorLock Service calls sendOutgoingEvent");
                                that.sendOutgoingEvent({value: true}, "DoorOpenedPort");
                            } else {
                                that.lastCheckTime = Date.now();
                                logger.infoLog.info("\nLOGGER: DoorLock Service detected a door closed event");
                                logger.infoLog.info("LOGGER: DoorLock Service sends new event");
                                logger.debugLog.debug("       DEBUG: DoorLock Service calls sendOutgoingEvent");
                                that.sendOutgoingEvent({value: true}, "DoorClosedPort");
                            }
                        });

                    }).on("error", (err) => {
                        logger.errorLog.error("Error: " + err.message);
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

        let that = this;
        logger.infoLog.info(`LOGGER: DoorLock Service received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="DoorLockOpenPort" && event) {
                makePostRequest(null,'/doorlock/open')
                    .then(resolve)
                    .catch((err)=>reject(err))
            }
            else if (portType==="DoorLockClosePort" && event) {
                makePostRequest(null,'/doorlock/close')
                    .then(resolve)
                    .catch((err)=>reject(err))
            }
            else if (portType==="GetDoorLockStatePort" && event) {
                makeGetRequest('/doorlock')
                    .then((resp) => {
                        resolve(resp)
                    })
                    .catch((err)=>reject(err))
            }
            else if (portType==="SetDoorLockCodePort" && event) {
                makePostRequest({code: event.code},'/doorlock/addcode')
                    .then(resolve)
                    .catch((err)=>reject(err))
            }
            else if (portType==="RemoveDoorLockCodePort" && event) {
                makePostRequest({code: event.code},'/doorlock/removecode')
                    .then(resolve)
                    .catch((err)=>reject(err))
            }

            function makePostRequest(reqData,path) {

                return new Promise((resolve2,reject2) => {
                    let data = (reqData) ? JSON.stringify(reqData) : JSON.stringify({});

                    let options = {
                        hostname: '192.168.1.216',
                        path: path,
                        port: 1337,
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
                            resolve2(JSON.parse(response));
                        })
                    });

                    req.on('error', error => {
                        logger.errorLog.error("Error while sending request to DoorLock device from doolock service");
                        reject2(error)
                    });

                    req.write(data);
                    req.end()
                })
            }

            function makeGetRequest(path) {
                return new Promise((resolve1, reject1) => {
                    let options = {
                        hostname: '192.168.1.216',
                        path: path,
                        port: 1337,
                        method: 'GET'
                    };

                    const req = http.request(options, res => {
                        let responseData = [];
                        res.on('data', d => {
                            responseData.push(d);
                        });

                        res.on('end', function () {
                            let response = Buffer.concat(responseData);
                            resolve1(JSON.parse(response));
                        })
                    });

                    req.on('error', error => {
                        logger.errorLog.error(error);
                        reject1(error)
                    });

                    req.end()
                })

            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="DoorLockOpenPort" || "DoorLockClosePort" || "GetDoorLockStatePort" || "SetDoorLockCodePort" || "RemoveDoorLockCodePort"
    }

}
module.exports = DoorLockService;