const Component = require('../../../core/Component');
const http = require('http');
const logger = require('../../../utils/logger');
const https = require('https');
const url = require('url');

class HttpRequestService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "HttpRequest"
    }

    handleIncomingEvent(event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: HttpRequest service received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="HttpPostPort" && event) {
                // send post request
                let hostname = that.config.hostname;
                let path = that.config.path;
                let data = JSON.stringify(event);

                let options = {
                    hostname: hostname,
                    path: path,
                    port: 3443,
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
                req.end()
            }
            else if (portType==="HttpPutPort" && event) {


                let hostname = that.config.hostname;
                let path = that.config.path;
                let data = event.body;

                let options = {
                    hostname: hostname,
                    port: 443,
                    path: path,
                    method: 'PUT',
                    headers: event.headers
                };

                const req = https.request(options, res => {
                    let responseData = [];
                    res.on('data', d => {
                        responseData.push(d);
                    });

                    res.on('end', function () {
                        let response = Buffer.concat(responseData);
                        // if (response) resolve(JSON.parse(response));
                        if (response) resolve(response);
                        else resolve();
                    })
                });

                req.on('error', error => {
                    logger.errorLog.error(error);
                    reject(error)
                });

                req.write(data);
                req.end()
            }
            else if (portType==="HttpGetPort" && event) {
                let hostname = that.config.hostname;
                let path = that.config.path;

                let  requestUrl = url.parse(url.format({
                    protocol: 'https',
                    hostname: hostname,
                    pathname: path,
                    query: event.params
                }));

                let options = {
                    hostname: requestUrl.hostname,
                    path: requestUrl.path,
                };

                const req = https.request(options, res => {
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

                req.end()
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="HttpGetPort" | "HttpPutPort" | "HttpDeletePort" | "HttpPostPort";
    }
}
module.exports = HttpRequestService;