const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const KVSPutPort = require('../ports/KVSPutPort');
const KVSGetPort = require('../ports/KVSGetPort');

class KVStoreElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "KVStore"
    }

    getDescription() {
        return "An interface to a Key-Value Store"
    }

    getOutData() {
        return "output(el(kvstore), [data[valueType],boolean[putsuccess]])."
    }

    getNewElement() {
        return new KVStoreElement()
    }

    getNumberInPorts() {
        return 2
    }

    getNumberOutPorts() {
        return 2
    }

    getTypeInPorts() {
        return ["KVSGetPort","KVSPutPort"]
    }

    getTypeOutPorts() {
        return ["KVSGetPort","KVSPutPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("KVSGetPort",KVSGetPort);
        portsClasses.set("KVSPutPort",KVSPutPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        console.log(`LOGGER: KVStore element received incoming layout event on port ${portType} from ${sourceName}`);
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType === "KVSGetPort" || "KVSPutPort") {
                that.sendGlobalEvent(event,portType)
                    .then(function (response) {
                        resolve(response)
                        // if (result.portType==="KVSGetPort") {
                        //     resolve(result)
                        // }
                        // else if (result.portType==="KVSPutPort") {
                        //     resolve(result)
                        // }
                    })
                    .catch(error => {
                        console.log(`ERROR: KVStore failed to process the incoming event. \n ${error}`);
                        reject(error);
                    })
            }
        })

    }

    handleGlobalEvent(event, portType) {}

}
module.exports = KVStoreElement;