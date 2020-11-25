const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const logger = require('../../../utils/logger');
const TapInPort = require('../ports/TapInPort');
const TapConditionPort = require('../ports/TapConditionPort');
const TapOutPort = require('../ports/TapOutPort');
const GetTapStatePort = require('../ports/GetTapStatePort');

class TapElement extends NativeLayoutElement {
    constructor() {
        super();
        this.tapState = false;  // true for open, false for closed (default: false)
    }

    getType() {
        return "Tap"
    }

    getDescription() {
        return "Tap element allows a data flow as long as a certain condition(-s) hold."
    }

    getOutData() {
        return "output(el(tap), [data[datatype])."
    }

    getNewElement() {
        return new TapElement()
    }

    getNumberInPorts() {
        return 1;
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["TapInPort","TapConditionPort","GetTapStatePort"]
    }

    getTypeOutPorts() {
        return ["TapOutPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("TapInPort",TapInPort);
        portsClasses.set("TapConditionPort",TapConditionPort);
        portsClasses.set("GetTapStatePort",GetTapStatePort);
        portsClasses.set("TapOutPort",TapOutPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: Tap element received incoming layout event on port ${portType} from ${sourceName}`);
        return new Promise(function (resolve, reject) {
            // if event came from one of the condition ports - record that
            if (portType==="TapConditionPort") {
                logger.timeLog("TapCondition",'start');
                logger.infoLog.info(`LOGGER: Tap element setting tap state to ${event.value}`);
                that.tapState = event.value;
                resolve();
                logger.timeLog("TapCondition",'finish');
                // old code for processing several condition ports (too complicated)
                // logger.infoLog.info("Setting condition port's value to " + event.value);
                // this.port.inports[sourceName].setValue(event.value);
            }
            // if event came from input port - process it
            else if (portType==="TapInPort") {

                if (!that.tapState) { // if tap is closed reject the incoming event
                    logger.timeLog("TapInClosed",'start');
                    reject('Tap is closed');
                    logger.timeLog("TapInClosed",'finish');
                }
                else {
                    logger.timeLog("TapInOpen",'start');
                    // if tap is opened forward the incoming event to the out port
                    that.port.TapOutPort.call(event)
                        .then(function (responseEvent) {
                            let response = responseEvent[0];
                            resolve(response);
                            logger.timeLog("TapInOpen",'finish');
                        })
                        .catch((err)=> reject(err))
                }

                // old code for processing several condition ports (too complicated)
                // // check if condition holds
                // let inputPorts = that.port.inports;
                // // Object.keys(inputPorts)[0] gives the class of the first and only inputPort
                // if (inputPorts[Object.keys(inputPorts)[0]].getValue()!==true) {
                //     logger.infoLog.info("TapConditionPort status: " + inputPorts[Object.keys(inputPorts)[0]].getValue());
                //     logger.errorLog.error("ERROR: Tap condition does not hold");
                //     reject("ERROR: Tap condition does not hold yet")
                // } else {
                //     that.port.TapOutPort.call(event)
                //         .then(function (response) {
                //             resolve(response)
                //         })
                //         .catch(function (err) {
                //             reject(err)
                //         })
                // }
            }
            else if (portType==="GetTapStatePort") {
                logger.timeLog("TapProcessingGetTapStateRequest",'start');
                logger.infoLog.info(`LOGGER: Tap element replies with the tap state ${that.tapState}`);
                resolve(that.tapState);
                logger.timeLog("TapProcessingGetTapStateRequest",'finish');
            }
        })
    }

    handleGlobalEvent(event, portType) {}

}
module.exports = TapElement;