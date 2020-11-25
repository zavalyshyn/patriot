const Port = require("../../../runtime/Port");

class SetDoorLockCodePort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "SetDoorLockCodePort"
    }

    call(code) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "code": code
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
                resolve()
            }
        })
    }
}
module.exports = SetDoorLockCodePort;