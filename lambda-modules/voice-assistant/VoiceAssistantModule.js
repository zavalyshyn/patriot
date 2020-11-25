const Module = require('../../core/Module');
const VoiceAssistantElement = require('./element/VoiceAssistantElement');
const VoiceAssistantService = require('./service/VoiceAssistantService');

class VoiceAssistantModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "VoiceAssistant"
    }

    getDescription() {
        return "Interface to a voice assistant smart speaker"
    }

    getServiceInstance() {
        return new VoiceAssistantService;
    }

    getElement() {
        return new VoiceAssistantElement;
    }
}
module.exports = VoiceAssistantModule;