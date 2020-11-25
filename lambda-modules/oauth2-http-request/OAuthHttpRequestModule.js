const Module = require('../../core/Module');
const OAuthHttpRequestElement = require('./element/OAuthHttpRequestElement');
const OAuthHttpRequestService = require('./service/OAuthHttpRequestService');

class OAuthHttpRequestModule extends Module{
    constructor() {
        super()
    }

    getType() {
        return "OAuthHttpRequest";
    }

    getDescription() {
        return "Interface to an OAuth2-based HTTP service (GET, POST, PUT, DELETE).";
    }

    getServiceInstance() {
        return new OAuthHttpRequestService()
    }

    getElement() {
        return new OAuthHttpRequestElement()
    }
}
module.exports = OAuthHttpRequestModule;