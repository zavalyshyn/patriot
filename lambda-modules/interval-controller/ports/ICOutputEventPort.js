const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class ICOutputEventPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "ICOutputEventPort"
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
                        logger.errorLog.error("ERROR: Couldn't forward event from Interval Controller");
                    });
                resolve()
            }
        })
    }
}
module.exports = ICOutputEventPort;