const Port = require("../../../runtime/Port");

class HttpDeletePort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "HttpDeletePort"
    }

    call(uri,reqParams) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "uri": chartType,
                "params": reqParams,
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
module.exports = HttpDeletePort;