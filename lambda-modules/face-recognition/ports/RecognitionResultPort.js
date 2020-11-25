const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class RecognitionResultPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "RecognitionResultPort"
    }

    call(data) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": data
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
                        logger.errorLog.error("ERROR: failed to send recogntition result " + err);
                    });
                resolve()
            }
        })
    }
}
module.exports = RecognitionResultPort;