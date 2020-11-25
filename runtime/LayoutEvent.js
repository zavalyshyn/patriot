const util = require("util");
const Event = require("../core/Event");

function LayoutEvent(source, destination) {

    this.super = Event;
    this.super();

    let _source = source;
    let _destination = destination;

    this.getName = function () {
        return this.constructor.name;
    };

    this.setSource = function (source) {
        _source = source;
    };

    this.getSource = function () {
        return _source;
    };

    this.setDestination = function (destination) {
        _destination = destination;
    };

    this.getDestination = function () {
        return _destination;
    }
}
util.inherits(LayoutEvent,Event);
module.exports = LayoutEvent;