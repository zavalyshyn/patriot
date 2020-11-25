const Module = require('../../core/Module');
const MobileAppElement = require('./element/MobileAppElement');
const MobileAppService = require('./service/MobileAppService');

class MobileAppModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "MobileAppModule";
    }

    getDescription() {
        return "Mobile App module.";
    }

    getServiceInstance() {
        return new MobileAppService()
    }

    getElement() {
        return new MobileAppElement()
    }
}
module.exports = MobileAppModule;