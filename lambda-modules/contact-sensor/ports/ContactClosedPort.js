const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class ContactClosedPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "ContactClosedPort"
    }

    call(closed) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": closed,
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
                logger.debugLog.debug("       DEBUG: ContactClosedPort's call calls element.sendEventToPort()");
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = ContactClosedPort;