const Port = require("../../../runtime/Port");
const logger = require('../../../utils/logger');

class CameraFramePort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "CameraFramePort"
    }

    call(frameDataBase64) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            // let params = {
            //     "timestamp": timestamp,
            //     "frame": frameDataBase64,
            // };
            let params = {
                "value": frameDataBase64
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
                        logger.errorLog.error("ERROR: IPCamera failed to send camera frame");
                    });
                resolve()
            }
        })
    }
}
module.exports = CameraFramePort;