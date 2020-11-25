const Module = require('../../core/Module');
const TapElement = require('./element/TapElement');
const TapService = require('./service/TapService');

class TapModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "Tap";
    }

    getDescription() {
        return "Tap module allows a data flow as long as a certain condition(-s) hold.";
    }

    getServiceInstance() {
        return new TapService()
    }

    getElement() {
        return new TapElement()
    }
}
module.exports = TapModule;