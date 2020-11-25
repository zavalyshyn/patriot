const Component = require('../../../core/Component');
const Hue = require('philips-hue');
const fs = require('fs');
const path = require('path');
const logger = require('../../../utils/logger');

class SmartLightService extends Component {
    constructor() {
        super();
        this.hue = new Hue();
        this.hue.bridge = "192.168.1.141";  // from hue.getBridges
        this.hue.username = this.readHueUsernameFile();
        this.light = this.hue.light(1);
    }

    getType() {
        return "SmartLight"
    }

    enabling() {}

    disabling() {}

    handleIncomingEvent(event,portType) {
        let that = this;
        logger.infoLog.info(`LOGGER: SmartLight Service received event on port ${portType}`);
        return new Promise(function (resolve, reject) {
            if (portType==="TurnOnLightPort" && event) {
                that.light.on()
                    .then(resolve)
                    .catch((err)=>reject(err));
            }
            else if (portType==="TurnOffLightPort" && event) {
                that.light.off()
                    .then(resolve)
                    .catch((err)=>reject(err));
            }
            else if (portType==="GetLightStatePort" && event) {
                that.light.getInfo()
                    .then(function(info){
                        resolve(info.state.on);
                    })
                    .catch((err)=>reject(err));
            }
            else if (portType==="BlinkLightPort" && event) {
                that.light.setState({
                    alert: "select",    // short one breathe cycle
                    hue: 0    // red color
                })
                    .then(resolve)
                    .catch((err)=>reject(err));
            }
        })

    }

    canHandleIncomingEvent() {
        return true;
    }

    canHandleIncomingEventOnPortType(portType) {
        return portType==="TurnOnLightPort" || "TurnOffLightPort" || "GetLightStatePort" || "BlinkLightPort"
    }

    readHueUsernameFile() {
        // read the Philips Hue Bridge Username
        let filePath = path.join(__dirname, '../../../keys/philips-hue-username'); // from hue.auth
        return fs.readFileSync(filePath, 'utf-8').trim();
    }
}
module.exports = SmartLightService;