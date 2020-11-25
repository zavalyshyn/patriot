const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const logger = require('../../../utils/logger');
const TimerExpiredPort = require('../ports/TimerExpiredPort');
const SetTimerPort = require('../ports/SetTimerPort');
const StartTimerPort = require('../ports/StartTimerPort');
const StartTimerOncePort = require('../ports/StartTimerOncePort');
const StopTimerPort = require('../ports/StopTimerPort');

class TimerElement extends NativeLayoutElement {
    constructor() {
        super();
        this.timerHandle = null;
    }

    getType() {
        return "Timer"
    }

    getDescription() {
        return "A Timer element sends an event when a given time expires"
    }

    getOutData() {
        return "output(el(timer), [data[boolean])."
    }

    getNewElement() {
        return new TimerElement()
    }

    getNumberInPorts() {
        return 1;
    }

    getNumberOutPorts() {
        return 1
    }

    getTypeInPorts() {
        return ["SetTimerPort","StartTimerPort","StartTimerOncePort","StopTimerPort"]
    }

    getTypeOutPorts() {
        return ["TimerExpiredPort"]
    }

    getPortsClasses() {
        let portsClasses = new Map();
        portsClasses.set("TimerExpiredPort",TimerExpiredPort);
        portsClasses.set("SetTimerPort",SetTimerPort);
        portsClasses.set("StartTimerPort",StartTimerPort);
        portsClasses.set("StartTimerOncePort",StartTimerOncePort);
        portsClasses.set("StopTimerPort",StopTimerPort);
        return portsClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: Timer Element received event on port ${portType} from ${sourceName}`);
        if (portType==="StartTimerPort") {
            logger.timeLog("TimerStartTimer",'start');
            if (!that.timerHandle) {    // if no timer has been set before, set it now
                that.timerHandle = setTimeout(function () {
                    that.port.TimerExpiredPort.call()
                }, that.config.time)
            } else {
                // if the timer has already been set previously
                // reset it and start over
                clearTimeout(this.timerHandle);
                that.timerHandle = setTimeout(function () {
                    that.port.TimerExpiredPort.call()
                }, that.config.time)
            }
            logger.timeLog("TimerStartTimer",'finish');
        }
        else if (portType==="StartTimerOncePort") {
            logger.timeLog("TimerStartTimerOnce",'start');
            if (!that.timerHandle) {    // set the timer if it wasn't done before, otherwise do nothing
                that.timerHandle = setTimeout(function () {
                    logger.timeLog("TimerTimerExpired",'start');
                    that.port.TimerExpiredPort.call()
                        .then(function () {
                            clearTimeout(that.timerHandle);
                            that.timerHandle=null;
                            logger.timeLog("TimerTimerExpired",'finish');
                        })
                }, that.config.time)
            }
            logger.timeLog("TimerStartTimerOnce",'finish');
        }
        else if (portType==="SetTimerPort") {
            logger.timeLog("TimerSetTimer",'start');
            if (!this.timerHandle) {    // if no timer has been set before, set it now
                this.timerHandle = setTimeout(function () {
                    that.port.TimerExpiredPort.call()
                }, event.timeout)
            } else {
                // if the timer has already been set previously
                // reset it and start over
                clearTimeout(this.timerHandle);
                this.timerHandle = setTimeout(function () {
                    that.port.TimerExpiredPort.call()
                }, event.timeout)
            }
            logger.timeLog("TimerSetTimer",'finish');
        }
        else if (portType==="StopTimerPort") {
            logger.timeLog("TimerStopTimer",'start');
            clearTimeout(this.timerHandle);
            logger.timeLog("TimerStopTimer",'finish');
        }
    }

    handleGlobalEvent(event, portType) {
        // logger.infoLog.info(`LOGGER: Timer element sends TimerExpired event on ${portType} port`);
        // if (portType==="TimerExpiredPort") {
        //     this.port.TimerExpiredPort.call(event)
        // }
    }

}
module.exports = TimerElement;