const Port = require("../../../runtime/Port");

class TapInPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "TapInPort";
    }

    call(event) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            if (that.mode==="duplex") {
                // sendEventToPort(params,config.portNum)
                that.source.sendEventToPort(event,that.getType())
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            } else {
                // sendEventToPort(params,config.portNum);
                that.source.sendEventToPort(event,that.getType());
                resolve()
            }
        })
    }
}
module.exports = TapInPort;