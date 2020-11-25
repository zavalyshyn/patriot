const Module = require('../../core/Module');
const UserInputElement = require('./element/UserInputElement');
const UserInputService = require('./service/UserInputService');

class UserInputModule extends Module {
    constructor() {
        super()
    }

    getType() {
        return "UserInput"
    }

    getDescription() {
        return "Interface to a User Input service"
    }

    getServiceInstance() {
        return new UserInputService;
    }

    getElement() {
        return new UserInputElement;
    }
}
module.exports = UserInputModule;