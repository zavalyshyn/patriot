const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class ICInputEventPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "ICInputEventPort"
    }

    call(event) {
        let that = this;
        return new Promise(function (resolve,reject)  {

            if (that.mode==="duplex") {
                that.source.sendEventToPort(event,that.getType())
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            } else {
                that.source.sendEventToPort(event,that.getType())
                    .catch(function () {
                        logger.errorLog.error("ERROR: Couldn't receive an input event for Interval Controller");
                    });
                resolve()
            }
        })
    }
}
module.exports = ICInputEventPort;