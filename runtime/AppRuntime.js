const fs = require('fs');

const LayoutElement = require("./LayoutElement");
const LayoutConnector = require("./LayoutConnector");
const EventEngine = require("./EventEngine");
const AppLayoutElement = require("./AppLayoutElement");
const logger = require('../utils/logger');

class AppRuntime {
    
    constructor(bus, registry, appManifest) {
        this.bus = bus;
        this.registry = registry;
        this.appManifest = appManifest;
        this.elements = new Map();
        this.appDeployed = false;
        this.engine = new EventEngine();
    }

    loadApp(appName) {

        let that = this;

        logger.timeLog("Instantiating and registering untrusted app elements", 'start');

        // instantiate the app class name (if it is provided)
        let appClassPath = `./apps/${appName}/${appName}.js`;
        let app = null;
        try {
            fs.accessSync(appClassPath, fs.constants.F_OK);
            const App = require(`../apps/${appName}/${appName}`);
            app = new App;
        } catch (err) {
            logger.errorLog.error('LOGGER: No App class provided! Assuming app without untrusted elements');
        }

        /*
        * instantiate the layout into the graph of interconnected elements
        */

        // look for the methods of the application that are annotated to be elements
        let handlerTable = new Map();
        let declaredElements = this.appManifest.getUntrustedElements();
        declaredElements.forEach(function (element) {
            if (element && app) {
                let elementHandler = app[element.name];
                if (elementHandler) {
                    handlerTable.set(element.name, elementHandler);
                } else {
                    logger.errorLog.error(`ERROR: couldn't find a method ${element.name} in ${appName} file`);
                }

            }
        });

        // instantiate objects for each element
        let appElements = this.appManifest.getAppElements();

        appElements.forEach(function (element) {
            let el = null;
            if (that.registry.isNativeElement(element.name)) {
                el = that.registry.getElement(element.name);
            } else if (handlerTable.has(element.name)) {
                el = new AppLayoutElement(element.name, handlerTable.get(element.name));
                // this.elements.set(el.getName(), el);
            } else {
                logger.errorLog.error(`ERROR: Element ${element.name} was not found`);
                return -1;
            }
            that.elements.set(el.getName(), el);
        });

        logger.timeLog("Instantiating and registering untrusted app elements", 'finish');

        // set up the connections between elements of the layout

        // logger.timeLog(new Date().getTime(), "Started Setting up connections between the layout elements");

        // logger.infoLog.info("LOGGER: PatrioT is running at the " + _runtimeType);
        logger.infoLog.info("LOGGER: Setting connections between the app elements");
        logger.timeLog("Setting connections between the app elements",'start');

        for (let [elementName,element] of this.elements) {
            let outConnections = this.appManifest.getConnectionsFromElement(elementName);
            let downstream = new LayoutConnector;
            if (outConnections!==null) {
                outConnections.forEach(function (outCon) {
                    // downstream.addElementOnPort(connection.type, that.elements.get(connection.to), connection.mode);
                    if (outCon.adapter) {
                        downstream.addElementOnPort(outCon.outport, that.elements.get(outCon.to), outCon.inport, outCon.mode, outCon.adapter);
                    } else {
                        downstream.addElementOnPort(outCon.outport, that.elements.get(outCon.to), outCon.inport, outCon.mode, outCon.adapter);
                    }
                })
            }

            // prepare element's config
            let config = {};

            // get element's config from app manifest file
            let elementConfig = this.appManifest.getElementConfig(elementName);
            if (elementConfig) {
                config = elementConfig;
            }

            // set up and configure ports for app elements
            let ports = {};  // list of all elements' supported portType:portInstance pairs

            // set up input ports
            let inputPorts = {};
            let inConnections = this.appManifest.getConnectionsToElement(elementName);
            if (inConnections) {
                inConnections.forEach(function (inCon) {
                    let inPortConfig = {
                        "source": null,
                        "mode": inCon.mode
                    };
                    let inPortClass = that.registry.getPortClass(inCon.inport);
                    inputPorts[inCon.from] = new inPortClass(inPortConfig);
                })
            }
            ports.inports = inputPorts;

            // set up output ports
            for (let [portType,portMode] of downstream.getPortModes()) {
                let outPortConfig = {
                    "source": element,
                    "mode": portMode
                };
                let portClass = this.registry.getPortClass(portType);
                ports[portType] = new portClass(outPortConfig);
            }

            config.ports = ports;

            element.initialize(this.engine.getLocalEventDispatcher(), downstream, config);
        }

        logger.infoLog.info("LOGGER: Done setting connections\n");
        logger.timeLog("Setting connections between the app elements",'finish');

        // logger.timeLog(new Date().getTime(), "Finished Setting up connections between the layout elements")

        return 0;
    };

    enable() {
        if (this.appDeployed) {
            return -1;
        }
        this.engine.registerEventDispatcher(this.bus);
        this.engine.startProcessingLoop(this); // TODO: this method is useless now. Can be deleted
        this.appDeployed = true;
        return 0;
    };

    disable() {
        if (!this.appDeployed) {
            return -1;
        }
        this.engine.stopProcessingLoop();
        return 0;
    };

    emulateNewEvent(serviceName,event,portType) {

        let that = this;
        return new Promise(function (resolve, reject) {
            if (!that.appDeployed || event===null) {
                reject;
            }
            let destElementName = that.registry.getElementNameForServiceName(serviceName);  // name of the service's corresponding element
            let destElement = that.elements.get(destElementName);

            logger.debugLog.debug("       DEBUG: AppRuntime's emulateNewEvent calls engine.handleGlobalEvent()");
            that.engine.handleGlobalEvent(destElement, event, portType)
                .then(resolve)
                .catch(reject);
        })


        // original
        // if (!this.appDeployed || event===null) {
        //     return -1;
        // }
        // let destElementName = this.registry.getElementNameForServiceName(serviceName);  // name of the service's corresponding element
        // let destElement = this.elements.get(destElementName);
        //
        // logger.debugLog.debug("       DEBUG: AppRuntime's emulateNewEvent calls engine.handleGlobalEvent()");
        // this.engine.handleGlobalEvent(destElement, event, portType);
        //
        // // This is what to do if we want to eliminate the EventEngine from element<->service communication
        // // this.elements.get(destElementName).handleGlobalEvent(event,portType);
        //
        // return 0;

    };

}
module.exports = AppRuntime;