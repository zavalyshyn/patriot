const Component = require('../../../core/Component');
const https = require('https');
const fs = require('fs');
const path = require('path');
const request = require('request');
const logger = require('../../../utils/logger');


class PushNotifierService extends Component {
    constructor() {
        super();
        this.pushBulletApiToken = this.readPushBulletAPIToken();
    }

    getType() {
        return "PushNotifier"
    }

    handleIncomingEvent(event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: PushNotifierService received incoming event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="SendPushMessagePort") {

                let messageText = event.message;

                let pushObject = JSON.stringify({
                    "body": messageText,
                    "title": 'PatrIoT Push Notification',
                    "type": 'note'
                });

                const postOptions = {
                    host: "api.pushbullet.com",
                    path: "/v2/pushes",
                    port: 443,
                    method: "POST",
                    headers: {
                        'Access-Token': that.pushBulletApiToken,
                        'Content-Type': 'application/json'
                    }
                };


                const req = https.request(postOptions, (res) => {
                    const chunks = [];
                    res.on('data', d => {
                        chunks.push(d)
                    });
                    res.on('end', () => {
                        let body = Buffer.concat(chunks);
                        resolve(JSON.parse(body));
                    });
                });
                req.on('error', reject);

                req.write(pushObject);
                req.end();
            }
            else if (portType === "SendPushWithImagePort" && event) {

                let messageText = event.message;
                let imageBase64 = event.imageBase64;

                console.log('IMAGE DATA: ',imageBase64);

                getUploadUrl();

                function getUploadUrl() {
                    let pushObject = JSON.stringify({
                        "file_name": "image.jpg",
                        "file_type":"image/jpg"
                    });

                    const postOptions = {
                        host: "api.pushbullet.com",
                        path: "/v2/upload-request",
                        port: 443,
                        method: "POST",
                        headers: {
                            'Access-Token': that.pushBulletApiToken,
                            'Content-Type': 'application/json'
                        }
                    };

                    const req = https.request(postOptions, (res) => {
                        const chunks = [];
                        res.on('data', d => {
                            chunks.push(d)
                        });
                        res.on('end', () => {
                            let respBody = JSON.parse(Buffer.concat(chunks));
                            let file_name = respBody.file_name;
                            let file_type = respBody.file_type;
                            let file_url = respBody.file_url;
                            let upload_url = respBody.upload_url;

                            uploadFile(upload_url,file_url,file_name,file_type)
                        });
                    });
                    req.on('error', (err) => reject(err));

                    req.write(pushObject);
                    req.end();
                }

                function uploadFile(uploadurl,fileurl,name,type) {
                    let secondReq = request.post(uploadurl, function (err, resp, body) {
                        if (err) {
                            reject(err);
                        } else {
                            sendPushwithImage(name,type,fileurl)
                        }
                    });
                    let form = secondReq.form();
                    form.append('file', new Buffer.from(imageBase64, 'base64'));
                }


                function sendPushwithImage(name,type,url) {
                    // now finally send a message and a photo as push
                    let finalPushObject = JSON.stringify({
                        "body": messageText,
                        "title": 'PatrIoT Push Notification',
                        "type": 'file',
                        "file_name": name,
                        "file_type": type,
                        "file_url": url
                    });

                    const finalPostOptions = {
                        host: "api.pushbullet.com",
                        path: "/v2/pushes",
                        port: 443,
                        method: "POST",
                        headers: {
                            'Access-Token': that.pushBulletApiToken,
                            'Content-Type': 'application/json'
                        }
                    };


                    const finalReq = https.request(finalPostOptions, (finalRes) => {
                        const finalChunks = [];
                        finalRes.on('data', d => {
                            finalChunks.push(d)
                        });
                        finalRes.on('end', () => {
                            let response = Buffer.concat(finalChunks);
                            resolve(JSON.parse(response));
                        });
                    });
                    finalReq.on('error', (err) => reject(err));

                    finalReq.write(finalPushObject);
                    finalReq.end();
                }

            }
            else if (portType==="SendPushWithFilePort" && event) {
                let messageText = event.message;
                let fileData = event.fileData;

                getUploadFileUrl();

                function getUploadFileUrl() {
                    let pushObject = JSON.stringify({
                        "file_name": "transferred-recording.raw",
                        "file_type": "audio/wav"
                    });

                    const postOptions = {
                        host: "api.pushbullet.com",
                        path: "/v2/upload-request",
                        port: 443,
                        method: "POST",
                        headers: {
                            'Access-Token': that.pushBulletApiToken,
                            'Content-Type': 'application/json'
                        }
                    };

                    const req = https.request(postOptions, (res) => {
                        const chunks = [];
                        res.on('data', d => {
                            chunks.push(d)
                        });
                        res.on('end', () => {
                            let respBody = JSON.parse(Buffer.concat(chunks));
                            let file_name = respBody.file_name;
                            let file_type = respBody.file_type;
                            let file_url = respBody.file_url;
                            let upload_url = respBody.upload_url;

                            uploadFile(upload_url,file_url,file_name,file_type)
                        });
                    });
                    req.on('error', (err) => reject(err));

                    req.write(pushObject);
                    req.end();
                }

                function uploadFile(uploadurl,fileurl,name,type) {
                    let secondReq = request.post(uploadurl, function (err, resp, body) {
                        if (err) {
                            reject(err);
                        } else {
                            sendPushwithFile(name,type,fileurl)
                        }
                    });
                    let form = secondReq.form();
                    // form.append('file', new Buffer.from(fileData, 'base64'));
                    form.append('file', new Buffer.from(fileData));
                }


                function sendPushwithFile(name,type,url) {
                    // now finally send a message and a photo as push
                    let finalPushObject = JSON.stringify({
                        "body": messageText,
                        "title": 'PatrIoT Push Notification',
                        "type": 'file',
                        "file_name": name,
                        "file_type": type,
                        "file_url": url
                    });

                    const finalPostOptions = {
                        host: "api.pushbullet.com",
                        path: "/v2/pushes",
                        port: 443,
                        method: "POST",
                        headers: {
                            'Access-Token': that.pushBulletApiToken,
                            'Content-Type': 'application/json'
                        }
                    };


                    const finalReq = https.request(finalPostOptions, (finalRes) => {
                        const finalChunks = [];
                        finalRes.on('data', d => {
                            finalChunks.push(d)
                        });
                        finalRes.on('end', () => {
                            let response = Buffer.concat(finalChunks);
                            resolve(JSON.parse(response));
                        });
                    });
                    finalReq.on('error', (err) => reject(err));

                    finalReq.write(finalPushObject);
                    finalReq.end();
                }
            }
        })
    }

    enabling() {
        if (this.ports.length > 0 && this.ports.includes("DismissReceivedPort")) {
            let interval = setInterval(dataPooler, 15*1000);    // every 15 sec
            let that = this;
            let numExperiment = 0;
            function dataPooler() {
                // if (numExperiment===33 && process.env.NODE_ENV === 'MEASUREMENT') {
                //     clearInterval(interval);    // stop the loop
                //     console.log();
                //     // console.log(JSON.stringify(logger.logHistory()));
                //     // console.log("AVERAGE DURATION FOR EACH ELEMENT: ");
                //     logger.printExperimentResults();
                // }
                // numExperiment += 1;
                logger.timeLog(`PushNotifierDismiss`,'start');
                if (this.stopPooling) {
                    logger.infoLog.info("\nLOGGER: Stopping PushNotifier service");
                    clearInterval(interval); // stop the loop
                }

                const options = {
                    hostname: 'api.pushbullet.com',
                    port: 443,
                    path: '/v2/pushes',
                    method: 'GET',
                    form: {
                        active: true,
                        modified_after: 1.4e+09
                    },
                    headers: {
                        'Access-Token': that.pushBulletApiToken
                    }
                };

                const req = https.request(options, (res) => {
                    // logger.infoLog.info('statusCode:', res.statusCode);
                    // logger.infoLog.info('headers:', res.headers);

                    let dataObject = '';
                    res.on('data', (d) => {
                        dataObject += d;
                    });

                    res.on("end", () => {
                        let lastMessageText = JSON.parse(dataObject).pushes[0].body;

                        if (lastMessageText && lastMessageText.includes("dismiss")) {
                            logger.timeLog(`PushNotifierDismiss`,'finish');
                            logger.infoLog.info("LOGGER: PushNotifier Service received 'dismiss' event");
                            logger.debugLog.debug("       DEBUG: PushNotifier Service calls sendOutgoingEvent");
                            let dismissEvent = {
                                "value": true
                            };
                            that.sendOutgoingEvent(dismissEvent,"DismissReceivedPort");
                        }
                        else {
                            logger.timeLog(`PushNotifierDismiss`,'finish');
                        }
                    })
                });

                req.on('error', (e) => {
                    logger.errorLog.error(e);
                });
                req.end();
            }
        }
    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType === "SendPushMessagePort"
    }


    readPushBulletAPIToken() {
        // read the PushBullet API Token
        let filePath = path.join(__dirname, '../../../keys/pushBulletAPIToken');
        let token = fs.readFileSync(filePath, 'utf-8').trim();
        return token;
    }
}
module.exports = PushNotifierService;