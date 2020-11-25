const Port = require("../../../runtime/Port");

class SwitchOffStatePort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "SwitchOffStatePort"
    }

    call(switchOffState) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": switchOffState,
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
                console.log("       DEBUG: SwitchOffStatePort's call calls element.sendEventToPort()");
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = SwitchOffStatePort;