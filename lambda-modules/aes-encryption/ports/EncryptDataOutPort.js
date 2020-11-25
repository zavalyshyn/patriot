const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class EncryptDataOutPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "EncryptDataOutPort"
    }

    call(encrypteddata) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": encrypteddata
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
                    .catch(function (err) {
                        logger.errorLog.error("ERROR: failed to send encrypted data " + err);
                    });
                resolve()
            }
        })
    }
}
module.exports = EncryptDataOutPort;