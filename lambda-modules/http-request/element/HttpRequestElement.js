const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const HttpGetPort = require('../ports/HttpGetPort');
const HttpPutPort = require('../ports/HttpPutPort');
const HttpPostPort = require('../ports/HttpPostPort');
const HttpDeletePort = require('../ports/HttpDeletePort');
const logger = require('../../../utils/logger');


class HttpRequestElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "HttpRequest"
    }

    getDescription() {
        return "The element handles HTTP requests to remote endpoints (GET, POST, PUT, DELETE)."
    }

    getOutData() {
        return "output(el(httprequest), [data[valueType],boolean[putsuccess],boolean[deletesuccess])."
    }

    getNewElement() {
        return new HttpRequestElement()
    }

    getNumberInPorts() {
        return 4
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["HttpGetPort","HttpPutPort","HttpPostPort","HttpDeletePort"]
    }

    getTypeOutPorts() {
        return null
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("HttpGetPort",HttpGetPort);
        portClasses.set("HttpPutPort",HttpPutPort);
        portClasses.set("HttpPostPort",HttpPostPort);
        portClasses.set("HttpDeletePort",HttpDeletePort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: HttpRequest element received event on port ${portType} from ${sourceName}`);
        logger.timeLog("HttpRequest",'start');
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    resolve(response)
                    logger.timeLog("HttpRequest",'finish');
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = HttpRequestElement;