const Port = require("../../../runtime/Port");

class OAuthHttpDeletePort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "OAuthHttpDeletePort"
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
module.exports = OAuthHttpDeletePort;