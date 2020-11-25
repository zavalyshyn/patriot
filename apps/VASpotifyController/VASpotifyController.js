const AppElements = require("../../core/AppElements");
const logger = require('../../utils/logger');
const https = require('https');



class VASpotifyController extends AppElements {
    constructor() {
        super();
    }

    App(source,event,portType,logger) {
        if (portType==="VoiceCommandPort") {
            logger.timeLog('App','start');

            logger.infoLog.info(`LOGGER: SpotifyController's App element received incoming layout event ${JSON.stringify(event)} from ${source} element on ${portType} port`);

            const data = JSON.stringify(
                {
                    "context_uri": "spotify:album:1",
                    "offset": {
                        "position": 5
                    },
                    "position_ms": 0
                });

            let headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer'
            };

            port.HttpPutPort.call(data,headers)
                .then(() => logger.timeLog('App','finish'))
                .catch((err) => logger.errorLog.error("ERROR: App code received an error" + err));

            // port.RecordAudioPort.call()
            //     .then(function (recordingEvent) {
            //         let recordingObject = recordingEvent[0];  // true for on, false for off
            //         logger.infoLog.info(`LOGGER: Received ${recordingObject.recording.length}`);
            //     })
            //     .then(() => logger.timeLog('App','finish'))
            //     .catch((err) => logger.errorLog.error("ERROR: App code received an error" + err));
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
module.exports = VASpotifyController;
