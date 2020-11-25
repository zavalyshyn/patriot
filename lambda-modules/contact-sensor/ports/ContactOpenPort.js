const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class ContactOpenPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "ContactOpenPort"
    }

    call(open) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": open,
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
                logger.debugLog.debug("       DEBUG: ContactOpenPort's call calls element.sendEventToPort()");
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = ContactOpenPort;