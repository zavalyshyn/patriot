const LayoutElement = require('./LayoutElement');
const VM = require('vm2').VM;
const logger = require('../utils/logger');

class AppLayoutElement extends LayoutElement {

    constructor(elementName, handler) {
        super();
        this.name = elementName;
        this.handler = handler;

    }

    getName() {
        return this.name;
    };

    handleLayoutEvent(source, event, portType) {
        try {

            // define VM2 sandbox config
            const options = {
                timeout: 1000,  // script timeout in milliseconds
                eval: false,    // prevent calls to eval or function constructors
                wasm: false,    // prevent webassembly modules compilation
                sandbox: {
                    source: source,
                    event: event,
                    portType: portType,
                    port: this.port,
                    logger: logger
                }
            };

            const vm = new VM(options);

            let handlerSourceCode = this.handler.toString();

            // logger.infoLog.info("HANDLER BEFORE: \n" + handlerSourceCode);

            handlerSourceCode = removeFirstAndLastLine(handlerSourceCode);

            function removeFirstAndLastLine(x) {
                let indexOfFirstNewLine = x.indexOf("\n");
                let indexOfLastNewLine = x.lastIndexOf("\n");
                return x.substring(indexOfFirstNewLine,indexOfLastNewLine);
            }

            // logger.infoLog.info("HANDLER AFTER: \n" + handlerSourceCode);

            vm.run(handlerSourceCode);

            // original without sandbox
            // this.handler(source,event,portType);
        } catch (e) {
            logger.errorLog.error(e);
        }
    }

}
module.exports = AppLayoutElement;

// function AppLayoutElement(name, handler, app) {
//
//     this.super = LayoutElement;
//     this.super();
//
//     let _name = name;
//
//     // instantiate the app class with its independent class loader
//     let _app = new app.constructor;
//
//     // look for the method handler
//     let _handler = _app[handler];
//
//     this.getName = function() {
//         return _name;
//     };
//
//     // this.sendEventToPort = function(event, portNo) {
//     //     super.sendEventToPort(event, portNo);
//     // };
//
//     this.handleLayoutEvent = function (event) {
//         try {
//             _handler(this,event);
//         } catch (e) {
//             logger.errorLog.error(e);
//         }
//     }
//
// }
// util.inherits(AppLayoutElement,LayoutElement);
// module.exports = AppLayoutElement;