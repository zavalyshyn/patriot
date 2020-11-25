const Component = require('../../../core/Component');

class KVStoreService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "KVStore"
    }

    handleIncomingEvent(event,portType) {
        console.log(`LOGGER: KVStoreService received incoming event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="KVSGetPort") {
                // get the key value and return it
                let value = 32;
                resolve(value)
                // or reject("Key not found")
            }
            else if (portType==="KVSPutPort") {
                // put key and its value into the KVStore
                let success = true;
                resolve(success)
                // or reject("Failed to put kv pair")
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType === "KVSGetPort" || portType === "KVSPutPort"
    }
}
module.exports = KVStoreService;