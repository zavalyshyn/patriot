const util = require("util");
const Event = require("./Event");


function GlobalEvent() {

    this.super = Event;
    this.super();

    let _destElementId = 0;
    let _sourceElementId = 0;
    let _receivers = [];

    this.setDestElementId = function (destId) {
        _destElementId = destId;
    };

    this.getDestElementId = function () {
        return _destElementId;
    };

    this.getReceivers = function () {
        return _receivers;
    };

    this.setSourceElementId = function (sourceId) {
        _sourceElementId = sourceId;
    };

    this.getSourceElementId = function () {
        return _sourceElementId;
    };

    this.getName = function () {
        return this.constructor.name;
    }
}
util.inherits(GlobalEvent,Event);
module.exports = GlobalEvent;
