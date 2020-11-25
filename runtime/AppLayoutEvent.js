const util = require("util");
const LayoutEvent = require("./LayoutEvent");

// TODO: This class/object is probably not needed at all
// at least in Java code it is never used

function AppLayoutEvent() {

    this.super = LayoutEvent;
    this.super();

    this.getName = function () {
        return "AppLayoutEvent";
    }
}
util.inherits(AppLayoutEvent,LayoutEvent);
module.exports = AppLayoutEvent;