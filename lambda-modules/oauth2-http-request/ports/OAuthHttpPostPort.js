const Port = require("../../../runtime/Port");

class OAuthHttpPostPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "OAuthHttpPostPort"
    }

    call(dataObject) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            if (that.mode==="duplex") {
                that.source.sendEventToPort(dataObject,that.getType())
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            } else {
                that.source.sendEventToPort(dataObject,that.getType())
                resolve()
            }
        })
    }
}
module.exports = OAuthHttpPostPort;