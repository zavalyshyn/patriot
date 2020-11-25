const Bus = require("./Bus");
const AppRuntime = require("./AppRuntime");
const https = require('https');
const express = require('express');
const fs = require('fs');
const logger = require('../utils/logger');

class Server {

    constructor() {
        this.bus = new Bus();
        this.components = [];
        this.appManifest = null;
        this.appRuntime = null;
        this.graphData = null;
    }

    initialize(registry, appManifest, graphData) {
        logger.timeLog('Setting up trusted elements services', 'start');
        this.appManifest = appManifest;
        this.graphData = graphData;
        for (let module of registry.getModules()) {
            let moduleName = module.getName();
            let service = module.getServiceInstance();
            service.setName(moduleName);    // same name for module/element/service
            let serviceConfig = this.appManifest.getElementConfig(moduleName);
            // send the list of ports that are used by the current app
            // this is important in order to know whether the service should
            // be enabled or not (optimization)
            let serviceConnections = this.appManifest.getConnectionsFromElement(moduleName);
            let ports = [];
            serviceConnections.forEach(function (con) {
                ports.push(con.outport);
            });
            service.initialize(serviceConfig, ports);
            service.initBus(this.bus);
            this.bus.registerService(service.getName(),service);    // TODO: should we register elements here as well?
            this.bus.registerServiceToElementMatch(registry.getServiceToElementMatch());    //TODO we don't need this anymore
            this.bus.registerElementToServiceMatch(registry.getElementToServiceMatch());    //TODO we don't need this anymore
            this.components.push(service);
        }
        logger.timeLog('Setting up trusted elements services', 'finish');

        this.appRuntime = new AppRuntime(this.bus, registry, appManifest);
        this.bus.registerAppRuntime(this.appRuntime);
        this.appRuntime.loadApp(this.appManifest.getAppName())
    };

    enable() {
        this.appRuntime.enable();
        this.components.forEach(function (service) {
            service.enable();
        })
    };

    startRESTServer() {

        /*
        Start an HTTPS REST server
         */

        const hostname = '0.0.0.0';
        const port = 3000;

        let that = this;

        const options = {
            key: fs.readFileSync(`${__dirname}/../keys/server-key.pem`),
            cert: fs.readFileSync(`${__dirname}/../keys/server-cert.pem`)
        };

        const app = express();

        // set up ejs template engine
        app.set('view engine', 'ejs');
        app.set('views', `${__dirname}/../views`);
        app.use(express.static(`${__dirname}/../public`));

        /*
         Start the HTTPS REST server
         */
        const server = https.createServer(options, app);

        app.get('/', function (req, res) {
            res.writeHead(200);
            res.end("Welcome to PatrIoT Server\n");
        });

        // process the request for a page with app's flowgraph
        app.get('/graph', function (req, res) {
            res.render('index', {options: that.graphData});
        });

        server.listen(port, hostname, () => {
            logger.infoLog.info(`LOGGER: Patriot Server running at https://${hostname}:${port}/\n`);
            logger.infoLog.info(`LOGGER: App dataflow graph is available at https://${hostname}:${port}/graph\n`);
        });
    }

    disable() {
        this.components.forEach(function (service) {
            service.disable();
        });
        logger.infoLog.info('Bye');
    };

}
module.exports = Server;