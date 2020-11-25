const Port = require("../../../runtime/Port");

class SendPushWithImagePort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "SendPushWithImagePort";
    }

    call(message,imageBase64) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "message": message,
                "imageBase64": imageBase64
            };

            if (that.mode==="duplex") {
                // sendEventToPort(params,config.portNum)
                that.source.sendEventToPort(params,that.getType())
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            } else {
                // sendEventToPort(params,config.portNum);
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = SendPushWithImagePort;