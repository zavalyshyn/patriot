const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');
const https = require('https');



class VAAudioMessage extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="VoiceCommandPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: AudioMessage's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            port.RecordAudioPort.call()
                .then(function (recordingEvent) {
                    let recordingObject = recordingEvent[0];  // true for on, false for off
                    logger.infoLog.info(`LOGGER: Received ${recordingObject.recording.length}`);
                    return port.SendPushWithFilePort.call("I've recorded an audio message for you", recordingObject.recording)
                })
                .then(() => logger.timeLog('App','finish'))
                .catch((err) => logger.errorLog.error("ERROR: App code received an error" + err));
            //
            //
            // port.SayTextPort.call("Hello? Have you heard the good news?")
            //     .then(()=> {
            //         logger.infoLog.info(`LOGGER: Success`);
            //     })
            //     .catch((err)=> {logger.errorLog.error("ERROR: App code received an error" + err)})
        }
    }
}
module.exports = VAAudioMessage;