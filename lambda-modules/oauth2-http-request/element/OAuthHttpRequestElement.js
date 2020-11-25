const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const OAuthHttpGetPort = require('../ports/OAuthHttpGetPort');
const OAuthHttpPutPort = require('../ports/OAuthHttpPutPort');
const OAuthHttpPostPort = require('../ports/OAuthHttpPostPort');
const OAuthHttpDeletePort = require('../ports/OAuthHttpDeletePort');
const logger = require('../../../utils/logger');


class OAuthHttpRequestElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "OAuthHttpRequest"
    }

    getDescription() {
        return "The element handles OAuth2-based HTTP requests to remote endpoints (GET, POST, PUT, DELETE)."
    }

    getOutData() {
        return "output(el(httprequest), [data[valueType],boolean[putsuccess],boolean[deletesuccess])."
    }

    getNewElement() {
        return new OAuthHttpRequestElement()
    }

    getNumberInPorts() {
        return 4
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["OAuthHttpGetPort","OAuthHttpPutPort","OAuthHttpPostPort","OAuthHttpDeletePort"]
    }

    getTypeOutPorts() {
        return null
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("OAuthHttpGetPort",OAuthHttpGetPort);
        portClasses.set("OAuthHttpPutPort",OAuthHttpPutPort);
        portClasses.set("OAuthHttpPostPort",OAuthHttpPostPort);
        portClasses.set("OAuthHttpDeletePort",OAuthHttpDeletePort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: HttpRequest element received event on port ${portType} from ${sourceName}`);
        logger.timeLog("OAuthHttpRequest",'start');
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    resolve(response)
                    logger.timeLog("OAuthHttpRequest",'finish');
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = OAuthHttpRequestElement;