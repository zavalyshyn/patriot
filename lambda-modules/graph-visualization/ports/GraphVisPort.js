const Port = require("../../../runtime/Port");

class GraphVisPort extends Port {
    constructor(config) {
        super();
        this.source = config.source;
        this.mode = config.mode;
    }

    getType() {
        return "GraphVisPort"
    }

    call(chartType,legendMsg,value) {
        let that = this;
        return new Promise(function (resolve,reject)  {
            let params = {
                "chartType": chartType,
                "legendMsg": legendMsg,
                "value": value
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
module.exports = GraphVisPort;