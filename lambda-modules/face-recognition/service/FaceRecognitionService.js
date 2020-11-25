const Component = require('../../../core/Component');
const logger = require('../../../utils/logger');
const faceapi = require('face-api.js');
require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const fs = require('fs');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class FaceRecognitionService extends Component {
    constructor() {
        super();

        this.faceMatcher = null;
        let that = this;

        // load recognition model
        let modelPath = `${__dirname}/../../../resources/face-models/`;

        // using heavy models
        // faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath)
        // .then(faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath))
        // .then(faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath))

        // using light (tiny) models
        faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath)
            .then(faceapi.nets.faceLandmark68TinyNet.loadFromDisk(modelPath))
            .then(faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath))
            .then(() => {return fs.readFileSync(`${modelPath}/trained-model.json`,'utf8')})
            .then((modelData)=> {
                return JSON.parse(modelData);
            })
            .then((modelObj)=> {
                // console.log(modelObj);
                return new faceapi.FaceMatcher.fromJSON(modelObj);
            })
            .then((faceMatcher) => {
                that.faceMatcher = faceMatcher;
            })
            .catch(err => {if (err) throw err})
    }

    getType() {
        return "FaceRecognition"
    }

    enabling() {}

    disabling() {}

    handleIncomingEvent(event,portType) {
        logger.infoLog.info(`LOGGER: FaceRecognition Service received event on port ${portType}`);
        let that = this;
        return new Promise(function (resolve, reject) {
            if (portType==="ImageDataPort" && event.value) {

                let img = new Buffer.from(event.value, 'base64');

                canvas.loadImage(img)
                    .then((imgCanvas) => {
                        return faceapi.detectSingleFace(imgCanvas,new faceapi.TinyFaceDetectorOptions())
                            .withFaceLandmarks(true)
                            .withFaceDescriptor();
                    })
                    .then((faceDescriptor) => {
                        let descriptor = faceDescriptor.descriptor;
                        return that.faceMatcher.findBestMatch(descriptor);
                    })
                    .then((recognitionResult)=> {
                        let name = recognitionResult._label;
                        // console.log(name);
                        resolve(name);
                    })
                    .catch((error)=>{
                        if (error) reject(error);
                    })
            }
        })
    }

    canHandleIncomingEvent() {
        return true;
    };

    canHandleIncomingEventOnPortType(portType) {
        return portType === "ImageDataPort";
    };

}
module.exports = FaceRecognitionService;


//testing

// let frame = fs.readFileSync('/home/holod/phd/code/patriot/test-scripts/face-dataset/testing/ross-geller.jpeg');
// let frameBase64 = new Buffer.from(frame).toString('base64');
// let frameEvent = {
//     value: frameBase64
// };
// let fr = new FaceRecognitionService();
//
// function wait() {
//     setTimeout(function recognizeTest() {
//         console.time('recognizing');
//         fr.handleIncomingEvent(frameEvent,'ImageDataPort')
//             .then((name) => {
//                 console.log(name);
//                 console.timeEnd('recognizing')
//             })
//     }, 4000);
// }
//
// wait();