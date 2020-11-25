const Port = require("../../../runtime/Port");

class SwitchOnStatePort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "SwitchOnStatePort"
    }

    call(switchOnState) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": switchOnState,
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
                console.log("       DEBUG: SwitchOnStatePort's call calls element.sendEventToPort()");
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = SwitchOnStatePort;