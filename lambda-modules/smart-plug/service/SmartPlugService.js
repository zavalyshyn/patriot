const Component = require('../../../core/Component');
const { Client } = require('tplink-smarthome-api');

class SmartPlugService extends Component {
    constructor() {
        super();
        this.client = new Client();
        this.plug = this.client.getPlug({ host: '192.168.1.135' }); // hard-coded IP address of a smart plug
        this.stopPooling = false;
    }

    getType() {
        return "SmartPlug"
    }

    enabling() {
        // only start the event checking loop if the app needs it (declared the respecting ports)
        if (this.ports.length > 0 && this.ports.includes("RealTimeStatPort")) {
            let interval = setInterval(dataPooler, 5*1000);    // every 5 sec
            let that = this;
            function dataPooler() {
                that.plug.getInfo()
                    .then(function (response) {
                        console.log("\nLOGGER: SmartPLug Service obtained a new power consumption statistics sample");
                        let statObject = response.emeter.realtime;
                        if (that.stopPooling) {
                            console.log("\nLOGGER: Stopping SmartPlug realtime monitoring service");
                            clearInterval(interval); // stop the loop
                        } else {
                            that.sendOutgoingEvent(statObject,"RealTimeStatPort");
                        }
                    });
            }
        }
    }

    disabling() {
        // disable dataPooler process
        this.stopPooling = true;
    }

    handleIncomingEvent(event,portType) {
        let that = this;
        console.log(`LOGGER: SmartPlug Service received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="TurnOnPort" && event) {
                that.plug.setPowerState(true)
                    .then(resolve)
                    .catch(function (err) {
                        reject(err)
                    })
            }
            else if (portType==="TurnOffPort" && event) {
                that.plug.setPowerState(false)
                    .then(resolve)
                    .catch(function (err) {
                        reject(err)
                    })
            }
            else if (portType==="GetPowerStatusPort" && event) {
                that.plug.getPowerState()
                    .then(function (status) {
                        resolve(status);
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            }
            else if (portType==="GetCurrentUsageStatPort" && event) {
                that.plug.getInfo()
                    .then(function (response) {
                        resolve(response.emeter.realtime);
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="TurnOnPort" || "TurnOffPort"
    }
}
module.exports = SmartPlugService;