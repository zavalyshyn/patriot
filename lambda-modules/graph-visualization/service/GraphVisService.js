const Component = require('../../../core/Component');

class GraphVisService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "GraphVis"
    }

    handleIncomingEvent(event,portType) {
        console.log(`LOGGER: GraphVisService received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="GraphVisPort" && event) {
                // create a graph using the event parameters
                resolve()
                // or
                // reject()
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="GraphVisPort"
    }
}
module.exports = GraphVisService;