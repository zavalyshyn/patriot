const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class RepeaterControlSignalPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "RepeaterControlSignalPort"
    }

    call() {
        let that = this;
        return new Promise(function (resolve,reject)  {

            let params = {
                value: true
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
                        logger.errorLog.error("ERROR: Couldn't receive an input event for Repeater");
                    });
                resolve()
            }
        })
    }
}
module.exports = RepeaterControlSignalPort;