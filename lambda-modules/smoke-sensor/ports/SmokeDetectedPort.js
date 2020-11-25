const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class SmokeDetectedPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "SmokeDetectedPort"
    }

    call(smoke) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": smoke,
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
                logger.debugLog.debug("       DEBUG: SmokeDetectedPort's call calls element.sendEventToPort()");
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = SmokeDetectedPort;