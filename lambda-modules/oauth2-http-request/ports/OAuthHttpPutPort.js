const Port = require("../../../runtime/Port");

class OAuthHttpPutPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "OAuthHttpPutPort"
    }

    call(body,headers) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let configs = {
                "body": body,
                "headers": headers,
            };

            if (that.mode==="duplex") {
                that.source.sendEventToPort(configs,that.getType())
                    .then(function (response) {
                        resolve(response)
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            } else {
                that.source.sendEventToPort(configs,that.getType());
                resolve()
            }
        })
    }
}
module.exports = OAuthHttpPutPort;