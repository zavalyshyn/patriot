const Event = require("../core/Event");
// const Bus = require("./Bus");
const GlobalEvent = require("../core/GlobalEvent");
const LayoutEvent = require("../runtime/LayoutEvent");
const logger = require('../utils/logger');

function EventEngine() {

    // the bounded buffer where pending events are kept to be dispatched
    const MAX_PENDING_EVENTS = 100;
    let _eventQueue = new BoundedEventBuffer(MAX_PENDING_EVENTS);

    // the internal thread responsible for dispatching internal events
    let _running = false;

    // interface for sending outgoing global events
    let _outSource = null;		// the app runtime service
    // let _outDispatcher = new Bus();	// the global event bus
    let _outDispatcher;	// the global event bus
    let _inDispatcher = new LocalEventDispatcher();

    /*
     * synchronized bounded buffer for handling events
     */

    function BoundedEventBuffer(size) {
        const capacity = size;
        let buffer = [];

        // Add and Get Events from the buffer *WITHOUT* locks
        this.putEvent = function(event) {
            if (buffer.length === capacity) {
                return -1;
            }
            else {
                buffer.push(event);
                return 0;
            }
        };

        this.getEvent = function() {
            if (buffer.length === 0) return null;
            else {
                return buffer.shift();
            }
        };

        this.getBufferSize = function () {
            return buffer.length;
        }
    }


    /*
    *  allow elements to send internal layout events and outgoing global events
    */

    this.registerEventDispatcher = function(dispatcher) {
        _outDispatcher = dispatcher;
    };

    function LocalEventDispatcher() {

        this.dispatchLayoutEvent = function(eventObject) {
            // if (_eventQueue.putEvent(event) < 0) {
            //     logger.infoLog.info(`ERROR: Queue overflow: lost event ${event.getName()}.`);
            // }
            let that = this;
            return new Promise(function (resolve, reject) {
                let promises = [];
                let event = eventObject.event;
                let source = eventObject.source;
                let destElements = eventObject.destination;
                logger.debugLog.debug("       DEBUG: EventEngine's localEventDispatcher's dispatchLayoutEvent calls element.handleLayoutEvent() for each element in the downstream list");
                destElements.forEach(function (e) {
                    let elementClass = e.element;
                    let inport = e.inport;
                    let adapter = e.adapter;
                    if (adapter) {  // we need to modify the event to be compatible with the target element's expected input
                        let adaptedEvent = that.applyAdapter(event,adapter);
                        promises.push(elementClass.handleLayoutEvent(source, adaptedEvent, inport))
                    } else {
                        promises.push(elementClass.handleLayoutEvent(source, event, inport))
                    }
                });
                Promise.all(promises)
                    .then(function (result) {
                        resolve(result)
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            })

        };

        this.dispatchOutgoingGlobalEvent = function(source, event, portType) {
            let that = this;
            return new Promise(function (resolve,reject) {
                if (event!==null && _outDispatcher !== null) {
                    logger.debugLog.debug("       DEBUG: EventEngine's dispatchOutgoingGlobalEvent method calls _outDispatcher.handleGlobalEvent");
                    // _outDispatcher.handleGlobalEvent(_outSource, event, portType)
                    _outDispatcher.handleGlobalEvent(source, event, portType)
                        .then(function (response) {
                            resolve(response)
                        })
                        .catch(function (err) {
                            reject(`ERROR: received ${err} when dispatchOutgoingGlobalEvent`)
                        })
                } else {
                    reject(`ERROR: Failed to dispatchOutgoingGlobalEvent`)
                }
            })

        };

        this.applyAdapter = function (originalEvent,adapter) {
            let finalEvent = {};
            for (let field in adapter) {
                // adapter.hasOwnProperty() is used to filter out properties from the object's prototype chain
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
                if (adapter.hasOwnProperty(field)) {
                    let value = adapter[field];
                    // logger.infoLog.info("Current value: " + value);
                    // logger.infoLog.info("Value without the dollar: " + value.replace('$.', ''));
                    // logger.infoLog.info("Original event: " + JSON.stringify(originalEvent));
                    if (value.startsWith("$.")) {
                        finalEvent[field] = originalEvent[value.replace('$.','')];
                    } else { // just copy the values
                        finalEvent[field] = value;
                    }
                }
            return finalEvent;
            }
        }
    }

    // returns reference to local dispatcher to the layout elements
    this.getLocalEventDispatcher = function () {
        return _inDispatcher;
    };

    this.handleGlobalEvent = function (destElement, event, portType) {
        let that = this;

        return new Promise(function (resolve, reject) {
            logger.debugLog.debug("       DEBUG: EventEngine's handleGlobalEvent calls event.destination.handleGlobalEvent()");
            destElement.handleGlobalEvent(event,portType)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (err) {
                    logger.infoLog.info(`ERROR: received ${err} from ${destElement.getType()} when handleGlobalEvent()`);
                    reject(err)
                })
        })

        // original
        // return new Promise(function (resolve, reject) {
        //     logger.debugLog.debug("       DEBUG: EventEngine's handleGlobalEvent calls event.destination.handleGlobalEvent()");
        //     destElement.handleGlobalEvent(event,portType);
        //         // .then(function (response) {
        //         //     resolve(response)
        //         // })
        //         // .catch(function (err) {
        //         //     logger.infoLog.info(`ERROR: received ${err} from ${that.getName()} when handleGlobalEvent()`);
        //         //     reject(err)
        //         // })
        // })
    };

    this.canHandleEventType = function(event) {
        // for now, accept all global events directed toward the application server
        return true;
    };

    /*
     * event processing methods
     */

    this.startProcessingLoop = function (outSource) {

        // logger.infoLog.info("Started event processing loop\n");

        _outSource = outSource;
        _running = true;

        // let timer;
        //
        // function checkEvents(){
        //     // logger.infoLog.info("#### Checking for new events in the buffer");
        //     let event = _eventQueue.getEvent();
        //     // logger.infoLog.info("#### Here is what we have for now: " + event);
        //     if (event) {
        //         if (event.eventType==="layoutEvent") {
        //             let destElements = event.destination;
        //             destElements.forEach(function (e) {
        //                 e.handleLayoutEvent(event.event, event.portType);
        //             })
        //
        //             // let layOutElements = event.getDestination().getElements();
        //             // layOutElements.forEach(function (e) {
        //             //     e.handleLayoutEvent(null,event);
        //             // })
        //         } else if (event.eventType==="globalEvent") {
        //             // let globalReceivers = event.getReceivers();
        //             // globalReceivers.forEach(function (e) {
        //                 event.destination.handleGlobalEvent(event.event,event.portType);
        //             // })
        //         }
        //         // if (event instanceof LayoutEvent) {
        //         //     let layOutElements = event.getDestination().getElements();
        //         //     layOutElements.forEach(function (e) {
        //         //         e.handleLayoutEvent(event);
        //         //     })
        //         // } else if (event instanceof GlobalEvent) {
        //         //     let globalReceivers = event.getReceivers();
        //         //     globalReceivers.forEach(function (e) {
        //         //         e.handleGlobalEvent(null, event);
        //         //     })
        //         // }
        //     }
        //
        //     // loop stop condition
        //     if (_running) {
        //         timer = setTimeout(checkEvents, 200);   // check every 200 ms
        //     } else {
        //         clearTimeout(timer);
        //     }
        // }
        //
        // checkEvents();
    };
    
    
    this.stopProcessingLoop = function () {
        _running = false;
    }

}
module.exports = EventEngine;