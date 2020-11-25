const Component = require('../../../core/Component');
const logger = require('../../../utils/logger');
const http = require('http');

class AlarmService extends Component {
    constructor() {
        super()
    }

    getType() {
        return "Alarm"
    }

    handleIncomingEvent(event,portType) {
        logger.infoLog.info(`LOGGER: Alarm Service received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="TriggerAlarmPort" && event) {
                const postOptions = {
                    "host": "192.168.1.216",    // hard-coded IP address of the Alarm device (Arduino Yun)
                    "port": 1337,
                    "path": "/alarm",
                    "method": "POST",
                };

                const req = http.request(postOptions, (res,err) => {
                    if (err) {
                        logger.errorLog.error(err);
                        reject(err);
                    }
                });
                req.on('close', () => {
                    resolve()
                });
                req.end()
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="TriggerAlarm"
    }
}
module.exports = AlarmService;