const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const ICInputEventPort = require('../ports/ICInputEventPort');
const ICOutputEventPort = require('../ports/ICOutputEventPort');
const logger = require('../../../utils/logger');

class IntervalControllerElement extends NativeLayoutElement {
    constructor() {
        super();
        this.lastEventTime = null;
    }

    getType() {
        return "IntervalController"
    }

    getDescription() {
        return "Interval controller forwards input events at a specified interval"
    }

    getOutData() {
        return "output(el(or), [data[boolean])."
    }

    getNewElement() {
        return new IntervalControllerElement()
    }

    getNumberInPorts() {
        return 1
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["ICInputEventPort"]
    }

    getTypeOutPorts() {
        return ["ICOutputEventPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("ICInputEventPort",ICInputEventPort);
        portsClasses.set("ICOutputEventPort",ICOutputEventPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        logger.timeLog("IntervalController",'start');
        logger.infoLog.info(`LOGGER: IntervalController element received incoming layout event on port ${portType} from ${sourceName}`);

        // console.log("LAST EVENT TIME: ",this.lastEventTime);

        if (!this.lastEventTime) {
            logger.timeLog("IntervalController",'start');
            this.port.ICOutputEventPort.call(event);
            this.lastEventTime = Date.now();
            logger.timeLog("IntervalController",'finish');
        }
        else {
            let currentTime = Date.now();
            if (currentTime-this.lastEventTime > this.config.interval) {
                logger.timeLog("IntervalController",'start');
                this.port.ICOutputEventPort.call(event);
                this.lastEventTime = Date.now();
                logger.timeLog("IntervalController",'finish');
            }
        }
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = IntervalControllerElement;