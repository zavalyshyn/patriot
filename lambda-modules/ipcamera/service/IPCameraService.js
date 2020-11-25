const Component = require('../../../core/Component');
const MjpegCamera = require('mjpeg-camera');
const logger = require('../../../utils/logger');

class IPCameraService extends Component {
    constructor() {
        super();
        this.stopPooling = false;
        // instantiate the camera object
        this.camera = new MjpegCamera ({
            // name: 'streetcam',
            // user: 'admin',
            // password: '56fh3478',
            // url: 'http://134.176.155.207/mjpg/video.mjpg',         // aquarium2
            url: 'http://82.64.237.163:8083/mjpg/video.mjpg',         // laundry in France
            // url: 'http://192.168.1.202:8080/?action=stream',         // ucl local usb camera
            // url: 'http://192.168.1.202:8080/?action=stream',         // ucl local usb camera
            // motion: false
        });
    }

    getType() {
        return "IPCamera"
    }

    enabling() {
        // only start the event checking loop if the app needs it (declared the respecting ports)
        if (this.ports.length > 0 && this.ports.includes("CameraFramePort")) {
            let numExperiment = 0;
            let interval = setInterval(dataPooler, 7*1000);    // every 10 sec
            let that = this;
            function dataPooler() {
                if (numExperiment===66 && process.env.NODE_ENV === 'MEASUREMENT') {
                    clearInterval(interval);    // stop the loop
                    logger.printExperimentResults();
                }
                numExperiment += 1;
                logger.timeLog(`IPCameraGettingAndSendingNewFrame`,'start');
                logger.infoLog.info("LOGGER: IPCamera Service obtained a new data sample from the camera");
                // send fromCameraEvent to all listening

                that.camera.getScreenshot(function (err, frame) {
                    if (err) {
                        console.error("ERROR: Error connecting to camera");
                    } else {
                        logger.infoLog.info("LOGGER: IPCamera Service got a camera frame of size: " + frame.length);
                        let frameBase64 = new Buffer.from(frame).toString('base64');
                        // let frameEvent = {
                        //     "timestamp": new Date().getTime(),
                        //     "frame": frameBase64
                        // };
                        let frameEvent = {
                            "value": frameBase64
                        };
                        if (that.stopPooling) {
                            logger.infoLog.info("LOGGER: Stopping IPCamera service");
                            clearInterval(interval); // stop the loop
                        } else {
                            that.sendOutgoingEvent(frameEvent,"CameraFramePort");
                        }
                    }
                });
            }
        }
    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {
        logger.infoLog.info(`LOGGER: IPCamera Service received event on port ${portType}`);
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="GetFramePort" && event.query==="frame") {

                that.camera.getScreenshot(function (err, frame) {
                    if (err) {
                        logger.errorLog.error("ERROR: Error connecting to camera");
                        reject(err);
                    } else {
                        logger.infoLog.info("LOGGER: IPCamera Service got a camera frame of size: " + frame.length);
                        let frameBase64 = new Buffer.from(frame).toString('base64');
                        // let frameEvent = {
                        //     "frame": frameBase64
                        // };
                        let frameEvent = {
                            "value": frameBase64
                        };
                        resolve(frameEvent)
                    }
                });
            }
        })
    }

    canHandleIncomingEvent() {
        return true;
    };

    canHandleIncomingEventOnPortType(portType) {
        return portType === "GetFramePort";
    };

}
module.exports = IPCameraService;
