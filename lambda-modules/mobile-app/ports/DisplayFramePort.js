const Port = require("../../../runtime/Port");

class DisplayFramePort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "DisplayFramePort"
    }

    call(frame) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "frame": frame
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
                // console.log("       DEBUG: DisplayFramePort's call calls element.sendEventToPort()");
                that.source.sendEventToPort(params,that.getType());
                resolve()
            }
        })
    }
}
module.exports = DisplayFramePort;