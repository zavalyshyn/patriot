const Module = require('../../core/Module');
const SpeechRecElement = require('./element/SpeechRecElement');
const SpeechRecService = require('./service/SpeechRecService');

class SpeechRecModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "SpeechRec"
    }

    getDescription() {
        return "Interface to a speech recognition service"
    }

    getServiceInstance() {
        return new SpeechRecService;
    }

    getElement() {
        return new SpeechRecElement;
    }
}
module.exports = SpeechRecModule;