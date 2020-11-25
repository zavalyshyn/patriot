const LayoutConnector = require('./LayoutConnector');

class LayoutElement {

    constructor() {
        this.dispatcher = null;
        this.downstream = null;
    }

    initialize(dispatcher, downstream, config) {
        this.dispatcher = dispatcher;
        this.downstream = downstream;
        this.port = config.ports;
        this.config = config;
        this.inports = config.ports.inports;
    };

    sendEventToPort(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let receivers = that.downstream.getElementsOnPort(portType);  // array of elements connected to that port
            if (receivers) {    // if there are elements connected to this port send an event to those
                let eventObject = {
                    "source": that.getName(),
                    "event": event,
                    "destination": receivers,
                    "portType": portType
                };
                // console.log(`       DEBUG: LayoutElement call dispatcher.dispatchLayoutEvent()`);
                that.dispatcher.dispatchLayoutEvent(eventObject)
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            }

        })
    };


    canHandleLayoutEvent() {}

    handleLayoutEvent(event) {}
}

module.exports = LayoutElement;

// function LayoutElement() {
//
//     // we need to make this vars private AND inheritable
//     // JS currently doesn't allow to do both. So for now
//     // they are public :(
//     this.dispatcher = null;
//     this.downstream = null;
//     this.id = null;
//
//
//     this.getName = function() {};
//
//     this.initialize = function (id, dispatcher, downstream) {
//         this.id = id;
//         this.dispatcher = dispatcher;
//         this.downstream = downstream;
//     };
//
//     this.sendEventToPort = function (event, portNo) {
//         event.setSource(this);
//
//         let receiver = new LayoutConnector;
//
//         let outPorts = this.downstream.getElements();
//         if (portNo >= outPorts.length || portNo < -1) {
//             console.log('Error: Event dropped - invalid port number');
//             return;
//         } else if (portNo === -1) {
//             // -1 to broadcast
//             receiver = this.downstream;
//         } else {
//             receiver.addElement(outPorts[portNo]);
//         }
//
//         event.setDestination(receiver);
//         this.dispatcher.dispatchLayoutEvent(event);
//     };
//
//     this.getId = function() {
//         return this.id;
//     };
//
//     this.canHandleLayoutEvent = function () {}
//
//     this.handleLayoutEvent = function(event) {
//         console.log('[LayoutElement] NOP')
//     }
// }
//
// module.exports = LayoutElement;