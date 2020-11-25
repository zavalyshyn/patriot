const LayoutElement = require('./LayoutElement');
const util = require('util');
const logger = require('../utils/logger');

class NativeLayoutElement extends LayoutElement {

    constructor() {
        super();
        this.name = null;
    }

    sendGlobalEvent(event,portType) {
        let that = this;
        return new Promise(function (resolve, reject) {
            logger.debugLog.debug("       DEBUG: NativeLayoutElement's sendGlobalEvent calls dispatcher.dispatchOutGoingGlobalEvent()");
            that.dispatcher.dispatchOutgoingGlobalEvent(that,event,portType)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (err) {
                    logger.errorLog.error(`ERROR: Failed to sendGlobalEvent() from ${that.getName()}`);
                    reject(err)
                })

        })

    };

    listSpecs() {
        logger.infoLog.info("Name:              " + this.getName());
        logger.infoLog.info("Type:              " + this.getType());
        logger.infoLog.info("Description:       " + this.getDescription());
        logger.infoLog.info("In Ports Number:   " + this.getNumberInPorts());

        let typeInPorts = this.getTypeInPorts();
        if (typeInPorts!==null) {
            typeInPorts.forEach(function (item,index) {
                logger.infoLog.info("In Port Type [" + index + "]:  " + item);
            });
        }

        logger.infoLog.info("Out Ports Number:  " + this.getNumberOutPorts());
        let typeOutPorts = this.getTypeOutPorts();
        if (typeOutPorts!==null) {
            typeOutPorts.forEach(function (item,index) {
                logger.infoLog.info("Out Port Type [" + index + "]: " + item);
            });
        }

        logger.infoLog.info("Out Data Rule:     " + this.getOutData());
    };



    /*
        Methods to be overriden by child classes
     */

    getName() {
        return this.name;
    };

    setName(name) {
        this.name = name;
    }

    getType() {}

    getElement() {};

    getDescription() {};

    getNumberInPorts() {};

    getTypeInPorts() {};

    getNumberOutPorts() {};

    getTypeOutPorts() {};

    getOutData() {}
}
module.exports = NativeLayoutElement;