const Module = require('../../core/Module');
const ANDElement = require('./element/ANDElement');
const ANDService = require('./service/ANDService');

class ANDModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "AND";
    }

    getDescription() {
        return "Logical AND module.";
    }

    getServiceInstance() {
        return new ANDService()
    }

    getElement() {
        return new ANDElement()
    }
}
module.exports = ANDModule;