const Event = require("./Event");
const Bus = require("../runtime/Bus");
const logger = require('../utils/logger');

class Component {

    constructor() {
        // the internal thread responsible for dispatching internal events
        this.running = false;

        // interface for sending outgoing global events
        this.bus = null;	// the global event bus

        this.name = null;
    }

    initialize(config, ports) {
        this.config = config;
        this.ports = ports;
    }

    initBus(bus) {
        this.bus = bus;
    };


    /*
    *  allow elements to send internal layout events and outgoing global events
    */

    sendOutgoingEvent(event,portType) {
        if (event!==null && this.bus!==null) {
            logger.debugLog.debug(`       DEBUG: ${this.getName()} Component's sendOutgoingEvent calls bus.handleGlobalEvent()`);
            this.bus.handleGlobalEvent(this, event, portType);
        }
    };

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.handleIncomingEvent(event,portType)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    };

    enable() {
        this.running = true;
        this.enabling();
    };


    disable() {
        this.running = false;
        this.disabling();
    };

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }


    /*
    * methods to be overridden by subclasses
    */

    enabling() {};

    handleIncomingEvent(event,portType) {};

    canHandleIncomingEvent() {};

    canHandleIncomingEventOnPortType(portType) {};

    disabling() {}

    getElementName() {}

}
module.exports = Component;