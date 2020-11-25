const logger = require('../utils/logger');

class Registry {
    constructor() {
        this.modules = new Map();       // k: userDefinedName; v: moduleClass
        this.elements = new Map();      // k: userDefinedName; v: elementClass
        this.serviceToElementMatch = new Map();
        this.elementToServiceMatch = new Map();
        this.ports = new Map();         // k: portType; v: portClass
        this.applications = new Map();  // k: appName; v: appManifestFile
    }

    registerModule(module, userDefinedName) {
        if (module === null || this.modules.has(userDefinedName)) {
            return -1;
        }

        module.setName(userDefinedName);

        let element = module.getElement();
        element.setName(userDefinedName);

        let service = module.getServiceInstance();  //TODO: this is probably not needed anymore
        service.setName(userDefinedName);           //TODO: this is probably not needed anymore

        if (this.elements.has(element.getName())) {
            return -2;
        }

        this.serviceToElementMatch.set(service.getName(),element.getName());    // TODO: this is not relevant anymore
        this.elementToServiceMatch.set(element.getName(),service.getName());    // TODO: element & service have the same name now

        this.modules.set(userDefinedName, module);
        this.elements.set(userDefinedName, element);

        for (let [portType,portClass] of element.getPortsClasses()) {
            this.ports.set(portType,portClass);
        }

        return 0;
    }

    registerApplication(appManifest) {
        if (appManifest === null || this.applications.has(appManifest.getAppName())) {
            return -1;
        }
        for (let el in appManifest.getTrustedElements()) {
            if (!this.elements.has(el.name)) {
                return -2;
            }
        }
        // TODO: check that the application layout is consistent, i.e. no weird/wrong/incompatible connections
        this.applications.set(appManifest.getAppName(), appManifest);
        return 0;
    };


    listModules() {
        for (let m of this.modules.values()) {
            logger.infoLog.info(`Name:          ${m.getName()}`);
            logger.infoLog.info(`Type:          ${m.getType()}`);
            logger.infoLog.info(`Description:   ${m.getDescription()}`);
            logger.infoLog.info("");
        }
    };


    listElements() {
        for (let el of this.elements.values()) {
            el.listSpecs();
            logger.infoLog.info("");
        }
    };


    getElement(elementName) {
        let element = this.elements.get(elementName);
        if (element) {
            // return newElem.getNewElement();
            return element;
        }
        logger.errorLog.error("ERROR: Specified element was not found");
        return null;
    };


    isNativeElement(elementName) {
        return this.elements.has(elementName);
    };

    getPortsClasses() {
        return this.ports;
    }

    getPortClass(portType) {
        return this.ports.get(portType);
    }

    getOutputRules(elementType) {
        if (!this.elements.has(elementName)) {
            return "";
        }

        let outputRule = this.elements.get(elementType).getOutData();
        return (outputRule!==null) ? outputRule : "";
    };


    getModules() {
        return this.modules.values();
    };

    // TODO: needs refactoring
    getElementNameForServiceName(serviceName) {
        let resp = this.serviceToElementMatch.get(serviceName)
        return this.serviceToElementMatch.get(serviceName);
    }
    // TODO: needs refactoring
    getServiceNameForElementName(elementName) {
        return this.elementToServiceMatch.get(elementName);
    }
    // TODO: needs refactoring
    getServiceToElementMatch() {
        return this.serviceToElementMatch;
    }
    // TODO: needs refactoring
    getElementToServiceMatch() {
        return this.elementToServiceMatch;
    }
}
module.exports = Registry;