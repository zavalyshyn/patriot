const fs = require('fs');

function GraphGenerator() {


    this.generateManifestGraph = function(appManifest) {
        let nodes = appManifest.getAppElements();
        let edges = appManifest.getAppConnections();
        let appName = appManifest.getAppName();

        let graphData = {nodes: [], edges: [], appName: appName};

        // add nodes data
        let id = 1;
        let nodesMap = new Map();

        for (let i=0; i<nodes.length; i++) {
            let node = {
                id: id,
                label: nodes[i].name
            };
            if (nodes[i].type==="untrusted") {
                node.color = {background: 'lightgray', border: 'black'};
            }
            nodesMap.set(nodes[i].name,id);
            graphData.nodes.push(node);
            id++;
        }

        // add edges data
        for (let i=0; i<edges.length; i++) {
            let edgeSourceId = nodesMap.get(edges[i].from);
            let edgeTargetId = nodesMap.get(edges[i].to);
            let edgeLabel = edges[i].outport;
            if (edges[i].outport!==edges[i].inport) {
                // edgeLabel = edges[i].outport + "/" + edges[i].inport;
                edgeLabel = edges[i].outport + "\n" + edges[i].inport;
            }
            let edge = {
                from: edgeSourceId,
                to: edgeTargetId,
                label: edgeLabel
            };
            if (edges[i].mode==="duplex") {
                edge.arrows = 'to, from'
            }
            graphData.edges.push(edge);
        }

        return graphData;
    }
}
module.exports = GraphGenerator;