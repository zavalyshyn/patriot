const Module = require('../../core/Module');
const HttpRequestElement = require('./element/HttpRequestElement');
const HttpRequestService = require('./service/HttpRequestService');

class HttpRequestModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "HttpRequest";
    }

    getDescription() {
        return "Interface to an HTTP requests service (GET, POST, PUT, DELETE).";
    }

    getServiceInstance() {
        return new HttpRequestService()
    }

    getElement() {
        return new HttpRequestElement()
    }
}
module.exports = HttpRequestModule;