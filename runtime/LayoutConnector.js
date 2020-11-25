class LayoutConnector {
    constructor() {
        this.portsConnections = new Map();  //key: portType String, value: array of elements on this port
        this.portModes = new Map(); // key: portType (e.g. CameraFramePort), value: portMode (simplex or duplex)
    }

    getElementsOnAllPorts() {
        let elements = [];
        for (let elementsArray of this.portsConnections.values()) {
            for (let el of elementsArray) {
                if (!elements.includes(el)) elements.push(el);
            }
        }
        return elements;
    }

    getElementsOnPort(portType) {
        return this.portsConnections.get(portType);
    }

    getElementNamesOnPort(portType) {
        let names = [];
        for (let el of this.getElementsOnPort(portType)) {
            names.push(el.getName());
        }
        return names
        // this.elements.forEach(function (el) {
        //     names.push(el.getName());
        // });
        // return names;
    }

    // addElementOnPort(portType,destElement,portMode) {
    //     if (this.portsConnections.has(portType)) {
    //         let existingElementsOnPort = this.portsConnections.get(portType);
    //         existingElementsOnPort.push(destElement);
    //         this.portsConnections.set(portType,existingElementsOnPort);
    //     }
    //     else {
    //         this.portsConnections.set(portType,[destElement])
    //         this.portModes.set(portType,portMode);  // we assume that ports of the same type have the same mode
    //     }
    // }

    addElementOnPort(outPort,destElement,inPort,portMode,adapter) {
        let connectedElement = {
            "element": destElement,
            "inport": inPort,
            "adapter": adapter
        };
        if (this.portsConnections.has(outPort)) {
            let existingElementsOnPort = this.portsConnections.get(outPort);
            existingElementsOnPort.push(connectedElement);
            this.portsConnections.set(outPort,existingElementsOnPort);
        }
        else {
            this.portsConnections.set(outPort,[connectedElement])
            this.portModes.set(outPort,portMode);  // we assume that ports of the same type have the same mode
        }
    }

    getPortTypes() {
        return this.portsConnections.keys()
    }

    getModeForPort(portType) {
        return this.portModes.get(portType);
    }

    getPortModes() {
        return this.portModes;
    }

    getSimplexPorts() {
        let simplexPorts = [];
        for (let [portType,portMode] of this.portModes) {
            if (portMode === "simplex") simplexPorts.push(portType)
        }
        return simplexPorts;
    }

    getDuplexPorts() {
        let duplexPorts = [];
        for (let [portType,portMode] of this.portModes) {
            if (portMode === "duplex") duplexPortsPorts.push(portType)
        }
        return duplexPorts;
    }

}
module.exports = LayoutConnector;