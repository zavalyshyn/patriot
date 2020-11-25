const Module = require('../../core/Module');
const DoorLockElement = require('./element/DoorLockElement');
const DoorLockService = require('./service/DoorLockService');

class DoorLockModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "DoorLockModule";
    }

    getDescription() {
        return "Door Lock module.";
    }

    getServiceInstance() {
        return new DoorLockService()
    }

    getElement() {
        return new DoorLockElement()
    }
}
module.exports = DoorLockModule;