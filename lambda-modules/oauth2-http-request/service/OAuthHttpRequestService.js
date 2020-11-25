const Component = require('../../../core/Component');
const http = require('http');
const logger = require('../../../utils/logger');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');

class OAuthHttpRequestService extends Component {
    constructor() {
        super();
        this.serviceActions = {
            dropbox: {
                'fileUpload': {
                    hostname: 'content.dropboxapi.com',
                    path: '/2/files/upload',
                    headers: {
                        'Authorization': 'Bearer '+this.readDropboxTokenFile(),
                        'Dropbox-API-Arg': JSON.stringify({
                            "path": "/camera-image.jpg",
                            "mode": "add",
                            "autorename": true,
                            "mute": false,
                            "strict_conflict": false
                        }),
                        'Content-Type': 'application/octet-stream'
                    }
                },
                'createFolder': {
                    hostname: 'api.dropboxapi.com',
                    path: '/2/files/create_folder_v2'
                },
                'deleteFileOrFolder': {
                    hostname: 'api.dropboxapi.com',
                    path: '/2/files/delete_v2'
                }
            }
        };
        this.serviceTokens = {
            dropbox: this.readDropboxTokenFile()
        }
    }

    getType() {
        return "OAuthHttpRequest"
    }

    handleIncomingEvent(event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: OAuthHttpRequest service received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="OAuthHttpPostPort" && event) {
                let action = event.action;
                // verify if the action was allowed by the user during the app configuration step
                // if (!that.config.allowedActions.includes(action)) reject('Action is not permitted');
                let service = that.config.service.toLowerCase();
                let hostname = that.serviceActions[service][action].hostname;
                let path = that.serviceActions[service][action].path;
                let headers = that.serviceActions[service][action].headers;
                // send post request
                let data = event.data;

                let options = {
                    hostname: hostname,
                    path: path,
                    port: 443,
                    method: 'POST',
                    headers: headers
                };

                const req = https.request(options, res => {
                    let responseData = [];
                    res.on('data', d => {
                        responseData.push(d);
                    });

                    res.on('end', function () {
                        let response = Buffer.concat(responseData);
                        // console.log("RESPONSE FROM DROPBOX: ",JSON.parse(response));
                        resolve(JSON.parse(response));
                    })
                });

                req.on('error', error => {
                    logger.errorLog.error(error);
                    reject(error)
                });

                req.write(data);
                req.end()
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="OAuthHttpGetPort" || "OAuthHttpPutPort" || "OAuthHttpDeletePort" || "OAuthHttpPostPort";
    }

    readDropboxTokenFile() {
        // read the Philips Hue Bridge Username
        let filePath = path.join(__dirname, '../../../keys/dropbox-api-token');
        return fs.readFileSync(filePath, 'utf-8').trim();
    }
}
module.exports = OAuthHttpRequestService;