const Module = require('../../core/Module');
const IPCameraElement = require('./element/IPCameraElement');
const IPCameraService = require('./service/IPCameraService');

class IPCameraModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "IPCamera";
    }

    getDescription() {
        return "Interface to an IP Camera device.";
    }

    getServiceInstance() {
        return new IPCameraService()
    }

    getElement() {
        return new IPCameraElement()
    }
}
module.exports = IPCameraModule;