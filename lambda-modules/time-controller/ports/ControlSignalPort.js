const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class ControlSignalPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "ControlSignalPort"
    }

    call(value) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                value: value
            };

            if (that.mode==="duplex") {
                that.source.sendEventToPort(params,that.getType())
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            } else {
                that.source.sendEventToPort(params,that.getType())
                    .catch(function () {
                        logger.errorLog.error("ERROR: TimeController Service failed to send control signal");
                    });
                resolve()
            }
        })
    }
}
module.exports = ControlSignalPort;