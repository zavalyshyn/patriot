const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const GraphVisPort = require('../ports/GraphVisPort');

class GraphVisElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "GraphVis"
    }

    getDescription() {
        return "An interface to a graph visualization API"
    }

    getOutData() {
        return "output(el(graphvis), [null])."
    }

    getNewElement() {
        return new GraphVisElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["GraphVisPort"]
    }

    getTypeOutPorts() {
        return null
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("GraphVisPort",GraphVisPort)
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        console.log(`LOGGER: GraphVisElement received event on port ${portType} from ${sourceName}`);
        console.log(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
        // if (portType==="GraphVisPort") {
        //     this.sendGlobalEvent(event,portType)
        // }
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = GraphVisElement;