const Port = require("../../../runtime/Port");

class FitTrackerStepsPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "FitTrackerStepsPort"
    }

    call(timestamp,stepsNum) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "timestamp": timestamp,
                "steps": stepsNum,
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
                console.log("       DEBUG: FitTrackerStepsPort's call calls element.sendEventToPort()");
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = FitTrackerStepsPort;