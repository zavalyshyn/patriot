const uuid = require('uuid/v1');

/*
A device superclass for all the IoT devices
connected to PatrIoT hub
 */
function Device(name, location, description) {
    this.id = uuid();
    this.name = name;
    this.location = location;
    this.description = description;
    this.active = true;

    this.getID = function() {
        return this.id;
    };

    this.getName = function() {
        return this.name;
    };

    this.getDescription = function() {
        return this.description;
    };

    this.getLocation = function() {
        return this.location;
    };

    this.isActive = function() {
        return this.active;
    }
}

module.exports = Device;
