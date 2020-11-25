
/*
 set up the PatrIoT logging mode
 */
process.env.NODE_ENV = 'DEBUG';
// process.env.NODE_ENV = 'MEASUREMENT';
// process.env.NODE_ENV = 'PRODUCTION';

const fs = require('fs');
const logger = require('./utils/logger');
const AppManifest = require("./core/AppManifest");
const Registry = require("./core/Registry");
const Server = require("./runtime/Server");
const ModulesRegistry = require('./core/ModulesRegistry');


/*
Select an app to run
 */
// const json = require(`${__dirname}/apps/PhotoBurstWhenMotionContact/PhotoBurstWhenMotionContact.json`);
// const json = require(`${__dirname}/apps/LightMyPath/LightMyPath.json`);
// const json = require(`${__dirname}/apps/SmartSecurity/SmartSecurity.json`);
// const json = require(`${__dirname}/apps/SmartCamera/SmartCamera.json`);
// const json = require(`${__dirname}/apps/SmartCameraWEncryption/SmartCameraWEncryption.json`);
// const json = require(`${__dirname}/apps/HonestAssistant/HonestAssistant.json`);

// new apps
// const json = require(`${__dirname}/apps/VASpotifyController/VASpotifyController.json`);
// const json = require(`${__dirname}/apps/VAAudioMessage/VAAudioMessage.json`);
// const json = require(`${__dirname}/apps/VAWhatsUp/VAWhatsUp.json`);
// const json = require(`${__dirname}/apps/VALightItUp/VALightItUp.json`);
// const json = require(`${__dirname}/apps/VADoorCheck/VADoorCheck.json`);
// const json = require(`${__dirname}/apps/VAWillItRain/VAWillItRain.json`);
// const json = require(`${__dirname}/apps/Doorman/Doorman.json`);
// const json = require(`${__dirname}/apps/AutoLockAfterXMin/AutoLockAfterXMin.json`);
// const json = require(`${__dirname}/apps/DoorNotifier/DoorNotifier.json`);
// const json = require(`${__dirname}/apps/LetThereBeLight/LetThereBeLight.json`);
// const json = require(`${__dirname}/apps/HoneyImHome/HoneyImHome.json`);
// const json = require(`${__dirname}/apps/Economie/Economie.json`);
// const json = require(`${__dirname}/apps/BabyUp/BabyUp.json`);
const json = require(`${__dirname}/apps/WatchMyHouse/WatchMyHouse.json`);



logger.infoLog.info(`LOGGER: Parsing an app manifest file\n`);

logger.timeLog('Parsing app manifest file', 'start');
let appManifest = new AppManifest(json);
logger.timeLog('Parsing app manifest file', 'finish');

logger.infoLog.info(`LOGGER: App name: ${appManifest.getAppName()}\n`);

logger.timeLog('Creating an app data flow graph data', 'start');
// Produce an app flowgraph data
let graphData = appManifest.createLayoutGraphHtml();
logger.timeLog('Creating an app data flow graph data', 'finish');


logger.timeLog('Seeting up trusted app elements', 'start');
// instantiate and register trusted app elements
let registry = new Registry();
let patriotModules = new ModulesRegistry().getAllPatriotModules();
let appElements = appManifest.getAppElements();
for (let el of appElements) {
    if (el.type==="untrusted") continue;
    if (patriotModules.has(el.type)) {
        let module = patriotModules.get(el.type);
        registry.registerModule(new module, el.name);
    } else {
        logger.errorLog.error("ERROR: Unknown element type in the app manifest file");
    }
}
logger.timeLog('Seeting up trusted app elements', 'finish');

// register the application
registry.registerApplication(appManifest);

// list the trusted modules specs
logger.infoLog.info("MODULES");
logger.infoLog.info("");
registry.listModules();
logger.infoLog.info("ELEMENTS");
logger.infoLog.info("");
registry.listElements();

/*
 * Run the hub server based on the current registry and application
 */
let patriotServer = new Server();
patriotServer.initialize(registry,appManifest,graphData);

patriotServer.startRESTServer();

patriotServer.enable();



