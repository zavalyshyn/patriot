const Module = require('../../core/Module');
const GraphVisElement = require('./element/GraphVisElement');
const GraphVisService = require('./service/GraphVisService');

class GraphVisModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "GraphVis"
    }

    getDescription() {
        return "Interface to a graph visualization UI"
    }

    getServiceInstance() {
        return new GraphVisService;
    }

    getElement() {
        return new GraphVisElement;
    }
}
module.exports = GraphVisModule;