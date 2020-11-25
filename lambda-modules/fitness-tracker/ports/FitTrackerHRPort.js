const Port = require("../../../runtime/Port");

class FitTrackerHRPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "FitTrackerHRPort";
    }

    call(timestamp,bpm,cnfdnc) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "timestamp": timestamp,
                "value": {
                    "bpm": bpm,
                    "confidence": cnfdnc
                },
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
module.exports = FitTrackerHRPort;