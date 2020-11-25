const Port = require("../../../runtime/Port");

class ANDInPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "ANDInPort";
    }

    call(value) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "value": value, // true or false
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
module.exports = ANDInPort;