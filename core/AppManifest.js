const GraphGenerator = require('../utils/GraphGenerator');
const logger = require('../utils/logger');

class AppManifest {
    constructor(manifestFile) {
        const appData = JSON.parse(JSON.stringify(manifestFile));
        if (appData) {
            this.name = appData.name;
            this.description = appData.description;
            this.states = appData.states;
            this.elements = appData.elements;
            this.connections = appData.connections;
        } else {
            logger.errorLog.error("ERROR: Couldn't parse the app manifest file");
        }
    }

    getAppName() {
        return this.name;
    }

    getAppDescription() {
        return this.description
    }

    getAppElements() {
        return this.elements
    }

    getElement(elementName) {
        for (let el of this.elements) {
            if (el.name===elementName) {
                return el;
            }
        }
    }

    getTypeOfElement(elementName) {
        for (let el of this.elements) {
            if (el.name===elementName) {
                return el.type;
            }
        }
    }

    getElementConfig(elementName) {
        let element = this.getElement(elementName);
        if (element.config) {
            return element.config;
        }
    }

    getTrustedElements() {
        let trustedElements = [];
        for (let el of this.elements) {
            if (el.type!=="untrusted") {
                trustedElements.push(el);
            }
        }
        return trustedElements;
    }

    getUntrustedElements() {
        let untrustedElements = [];
        for (let el of this.elements) {
            if (el.type==="untrusted") {
                untrustedElements.push(el);
            }
        }
        return untrustedElements;
    }

    getAppConnections() {
        return this.connections
    }

    getConnectionsFromElement(elementName) {
        let connections = [];
        for (let con of this.connections) {
            if (con.from===elementName) {
                connections.push(con);
            }
        }
        return connections;
    }

    getConnectionsToElement(elementName) {
        let connections = [];
        for (let con of this.connections) {
            if (con.to===elementName) {
                connections.push(con);
            }
        }
        return connections;
    }

    createLayoutGraphHtml() {
        const graphGenerator = new GraphGenerator();
        return graphGenerator.generateManifestGraph(this);
    }
}
module.exports = AppManifest;