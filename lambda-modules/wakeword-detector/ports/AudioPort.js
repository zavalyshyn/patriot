const Port = require("../../../runtime/Port");

class AudioPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "AudioPort"
    }

    call(event) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            if (that.mode==="duplex") {
                that.source.sendEventToPort(event,that.getType())
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            } else {
                that.source.sendEventToPort(event,that.getType());
                resolve()
            }
        })
    }
}
module.exports = AudioPort;