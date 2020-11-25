const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class MotionDetectedPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "MotionDetectedPort"
    }

    call(motion) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": motion,
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
                logger.debugLog.debug("       DEBUG: MotionDetectedPort's call calls element.sendEventToPort()");
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = MotionDetectedPort;