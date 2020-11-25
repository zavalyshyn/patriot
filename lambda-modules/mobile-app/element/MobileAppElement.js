const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const DisplayFramePort = require('../ports/DisplayFramePort');

class MobileAppElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "MobileApp"
    }

    getDescription() {
        return "An interface to a mobile app"
    }

    getOutData() {
        return "output(el(mobileapp), [])."
    }

    getNewElement() {
        return new MobileAppElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 0
    }

    getTypeInPorts() {
        return ["DisplayFramePort"]
    }

    getTypeOutPorts() {
        return null;
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("DisplayFramePort",DisplayFramePort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true;
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        console.log(`LOGGER: MobileApp Element received event on port ${portType} from ${sourceName}`);
        // console.log(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = MobileAppElement;