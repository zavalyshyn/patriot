// patriot trusted app modules
const GraphVisModule = require("../lambda-modules/graph-visualization/GraphVisModule");
const FitnessTrackerModule = require("../lambda-modules/fitness-tracker/FitnessTrackerModule");
const IPCameraModule = require("../lambda-modules/ipcamera/IPCameraModule");
const UserInputModule = require("../lambda-modules/user-input/UserInputModule");
const KVStoreModule = require("../lambda-modules/kv-store/KVStoreModule");
const Timer = require("../lambda-modules/timer/TimerModule");
const StateChanger = require("../lambda-modules/state-changer/StateChangerModule");
const OR = require("../lambda-modules/or/ORModule");
const AND = require("../lambda-modules/and/ANDModule");
const NOT = require("../lambda-modules/not/NOTModule");
const Tap = require("../lambda-modules/tap/TapModule");
const HttpRequest = require("../lambda-modules/http-request/HttpRequestModule");
const OAuthHttpRequest = require("../lambda-modules/oauth2-http-request/OAuthHttpRequestModule");
const PushNotifier = require("../lambda-modules/push-notifier/PushNotifierModule");
const Alarm = require("../lambda-modules/alarm/AlarmModule");
const AccelerationSensor = require("../lambda-modules/acceleration-sensor/AccelerationSensorModule");
const ContactSensor = require("../lambda-modules/contact-sensor/ContactSensorModule");
const MobileApp = require("../lambda-modules/mobile-app/MobileAppModule");
const MotionSensor = require("../lambda-modules/motion-sensor/MotionSensorModule");
const PresenceSensor = require("../lambda-modules/presence-sensor/PresenceSensorModule");
const Sms = require("../lambda-modules/sms/SmsModule");
const Switch = require("../lambda-modules/switch/SwitchModule");
const SmartLight = require("../lambda-modules/smart-light/SmartLightModule");
const SmartPlug = require("../lambda-modules/smart-plug/SmartPlugModule");
const TimeController = require("../lambda-modules/time-controller/TimeControllerModule");
// const WakewordDetection = require("../lambda-modules/wakeword-detector/WakewordDetectionModule");
const AESEncryption = require("../lambda-modules/aes-encryption/AESEncryptionModule");
const VoiceAssistant = require("../lambda-modules/voice-assistant/VoiceAssistantModule");
const DoorLock = require("../lambda-modules/door-lock/DoorLockModule");
const MotionDetection = require("../lambda-modules/motion-detection/MotionDetectionModule");
const IntervalController = require("../lambda-modules/interval-controller/IntervalControllerModule");
const SmokeSensor = require("../lambda-modules/smoke-sensor/SmokeSensorModule");
const Repeater = require("../lambda-modules/repeater/RepeaterModule");

class ModulesRegistry {
    constructor() {
        this.patriotModules = new Map();
        this.patriotModules.set("IPCamera",IPCameraModule);
        this.patriotModules.set("UserInput",UserInputModule);
        this.patriotModules.set("GraphVis",GraphVisModule);
        this.patriotModules.set("KVStore",KVStoreModule);
        this.patriotModules.set("FitnessTracker",FitnessTrackerModule);
        this.patriotModules.set("Timer",Timer);
        this.patriotModules.set("StateChanger",StateChanger);
        this.patriotModules.set("OR",OR);
        this.patriotModules.set("AND",AND);
        this.patriotModules.set("NOT",NOT);
        this.patriotModules.set("Tap",Tap);
        this.patriotModules.set("HttpRequest",HttpRequest);
        this.patriotModules.set("OAuthHttpRequest",OAuthHttpRequest);
        this.patriotModules.set("PushNotifier",PushNotifier);
        this.patriotModules.set("Alarm",Alarm);

        this.patriotModules.set("AccelerationSensor",AccelerationSensor);
        this.patriotModules.set("ContactSensor",ContactSensor);
        this.patriotModules.set("MobileApp",MobileApp);
        this.patriotModules.set("MotionSensor",MotionSensor);
        this.patriotModules.set("PresenceSensor",PresenceSensor);
        this.patriotModules.set("Sms",Sms);
        this.patriotModules.set("Switch",Switch);
        this.patriotModules.set("SmartLight",SmartLight);
        this.patriotModules.set("SmartPlug",SmartPlug);
        this.patriotModules.set("TimeController",TimeController);
        // this.patriotModules.set("WakewordDetection",WakewordDetection);
        this.patriotModules.set("AESEncryption",AESEncryption);
        this.patriotModules.set("VoiceAssistant",VoiceAssistant);
        this.patriotModules.set("DoorLock",DoorLock);
        this.patriotModules.set("MotionDetection",MotionDetection);
        this.patriotModules.set("IntervalController",IntervalController);
        this.patriotModules.set("SmokeSensor",SmokeSensor);
        this.patriotModules.set("Repeater",Repeater);
    }

    getAllPatriotModules() {
        return this.patriotModules;
    }
    
}
module.exports = ModulesRegistry;