const AppRuntime = require("./AppRuntime");
const Component = require("../core/Component");
const logger = require('../utils/logger');

class Bus {
    
    constructor() {
        this.services = new Map();
        this.appRuntime = null;
        this.serviceToElementMatch = null;
        this.elementToServiceMatch = null;
    }

    registerService(serviceName, service) {
        this.services.set(serviceName,service);
    };

    registerAppRuntime(appRuntime) {
        this.appRuntime = appRuntime;
    };

    registerServiceToElementMatch(serv2elemMatch) {
        this.serviceToElementMatch = serv2elemMatch;
    }

    registerElementToServiceMatch(el2servMatch) {
        this.elementToServiceMatch = el2servMatch;
    }

    handleGlobalEvent(source, event, portType) {
        let that = this;
        if (source instanceof Component) {  // if event came from the service
            return new Promise(function (resolve, reject) {
                logger.debugLog.debug("       DEBUG: Bus's handleGlobalEvent calls appRuntime.emulateNewEvent()");
                that.appRuntime.emulateNewEvent(source.getName(),event,portType)
                    .then(resolve)
                    .catch(reject);
            })
            // original
            // logger.debugLog.debug("       DEBUG: Bus's handleGlobalEvent calls appRuntime.emulateNewEvent()");
            // this.appRuntime.emulateNewEvent(source.getName(),event,portType);
            // return;
        } else {    // the event came from the element
            logger.debugLog.debug("       DEBUG: Bus's handleGlobalEvent calls service.handleGlobalEvent()");
            return new Promise(function (resolve, reject) {
                // find the element's corresponding service name
                let destServiceName = that.elementToServiceMatch.get(source.getName());
                let destService = that.services.get(destServiceName);
                destService.handleGlobalEvent(event,portType)
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        logger.errorLog.error(`ERROR: ${destServiceName} returned error: ${err}`);
                        reject(err);
                    })
            })
        }

    };

    canHandleEventType(event) {
        return true;
    }
}
module.exports = Bus;