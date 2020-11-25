const NativeLayoutElement = require('../../../runtime/NativeLayoutElement');
const DoorLockOpenPort = require('../ports/DoorLockOpenPort');
const DoorLockClosePort = require('../ports/DoorLockClosePort');
const GetDoorLockStatePort = require('../ports/GetDoorLockStatePort');
const SetDoorLockCodePort = require('../ports/SetDoorLockCodePort');
const RemoveDoorLockCodePort = require('../ports/RemoveDoorLockCodePort');
const DoorOpenedPort = require('../ports/DoorOpenedPort');
const DoorClosedPort = require('../ports/DoorClosedPort');
const logger = require('../../../utils/logger');

class DoorLockElement extends NativeLayoutElement {
    constructor() {
        super()
    }

    getType() {
        return "DoorLock"
    }

    getDescription() {
        return "An interface to a door lock"
    }

    getOutData() {
        return "output(el(doorlock), [boolean[doorlockopened],boolean[doorlockclosed]])."
    }

    getNewElement() {
        return new DoorLockElement()
    }

    getNumberInPorts() {
        return 5
    }

    getNumberOutPorts() {
        return 2
    }

    getTypeInPorts() {
        return ["DoorLockOpenPort","DoorLockClosePort","GetDoorLockStatePort","SetDoorLockCodePort","RemoveDoorLockCodePort"]
    }

    getTypeOutPorts() {
        return ["DoorOpenedPort","DoorClosedPort"]
    }

    getPortsClasses() {
        let portClasses = new Map();
        portClasses.set("DoorLockOpenPort",DoorLockOpenPort);
        portClasses.set("DoorLockClosePort",DoorLockClosePort);
        portClasses.set("GetDoorLockStatePort",GetDoorLockStatePort);
        portClasses.set("SetDoorLockCodePort",SetDoorLockCodePort);
        portClasses.set("RemoveDoorLockCodePort",RemoveDoorLockCodePort);
        portClasses.set("DoorClosedPort",DoorClosedPort);
        portClasses.set("DoorOpenedPort",DoorOpenedPort);
        return portClasses;
    }

    canHandleLayoutEvent() {
        return true
    }

    handleLayoutEvent(sourceName,event,portType) {
        let that = this;
        logger.timeLog(portType, 'start');
        logger.infoLog.info(`LOGGER: Doorlock Element received event on port ${portType} from ${sourceName}`);
        logger.debugLog.debug(`       DEBUG: ${this.getName()} element's handleLayoutEvent calls sendGlobalEvent()`);
        return new Promise(function (resolve, reject) {
            that.sendGlobalEvent(event,portType)
                .then(function (response) {
                    logger.timeLog(portType, 'finish');
                    resolve(response)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    handleGlobalEvent(event, portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="DoorOpenedPort" && that.port.DoorOpenedPort) {
                logger.infoLog.info(`LOGGER: DoorLock element sends layout event ${JSON.stringify(event)} on ${portType} port`);
                logger.timeLog("DoorLock",'finish');
                that.port.DoorOpenedPort.call(event.value)
                    .then(resolve)
                    .catch(reject);
            }
            else  if (portType==="DoorClosedPort" && that.port.DoorClosedPort) {
                logger.infoLog.info(`LOGGER: DoorLock element sends layout event ${JSON.stringify(event)} on ${portType} port`);
                logger.timeLog("DoorLock",'finish');
                that.port.DoorClosedPort.call(event.value)
                    .then(resolve)
                    .catch(reject);
            }
        })
    }

}
module.exports = DoorLockElement;