const winston = require('winston');

const infoLog = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    // defaultMeta: { service: 'patriot' },
    transports: []  // do not write to file or elsewhere
});

const errorLog = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    // defaultMeta: { service: 'patriot' },
    transports: []  // do not write to file or elsewhere
});

const debugLog = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    // defaultMeta: { service: 'patriot' },
    transports: []  // do not write to file or elsewhere
});

let experimentsLog = [];

const timeLog = function (name,type) {
    let logEntry = {
        name: name,
        type: type,
        time: new Date().getTime()
    };
    experimentsLog.push(logEntry);
    // console.log(logEntry);
};
// const timeLog = function (name, type, time) {
//     let currentEntry = experimentsLog[experimentsLog.length-1];
//     if (type==="start") {
//         currentEntry[name] =  {
//             start: time
//         };
//     } else if (type==="finish") {
//         currentEntry[name]['finish'] = time;
//         currentEntry[name]['duration'] = currentEntry[name].finish - currentEntry[name].start;
//     }
// };

const newRound = function () {
    experimentsLog.push({});
};

const logHistory = function () {
    return experimentsLog;
};


const printExperimentResults = function () {
// const printExperimentResultsNew = function () {
    // console.log(experimentsLog);
    let results = new Map();

    experimentsLog.forEach(function (obj,ind) {
        // console.log(ind,obj.name);
        if (results.has(obj.name)) {
            let existingMeasurements = results.get(obj.name);
            let latestResult = existingMeasurements[existingMeasurements.length-1];
            if (obj.type==='finish') {
                latestResult.finish = obj.time;
                latestResult.duration = latestResult.finish - latestResult.start;
                // console.log(latestResult);
            } else {
                let newResult = {
                    start: obj.time
                };
                existingMeasurements.push(newResult);
            }
        } else {
            if (obj.type==='start') {
                let resultsArray = [];
                let newResult = {
                    start: obj.time
                };
                resultsArray.push(newResult);
                results.set(obj.name,resultsArray);
            } else {
                console.log("The first appearance of the object has finish type");
                console.log("Here it is",obj);
            }
        }
    });

    let totalResults = [];

    results.forEach(function (value, key) {
        let moduleName = key;
        let resultsArray = value;
        let individualResults = []
        // console.log(moduleName,resultsArray.length,resultsArray);
        // console.log(moduleName,resultsArray.length);
        for (let i = 0; i < resultsArray.length; i++) {
            let res = resultsArray[i];
            // console.log(res.duration);
            individualResults.push(res.duration)
        }
        totalResults.push(individualResults);

        let selectedResults = [];
        if (resultsArray.length>=28) {
            let durationSum = 0;
            let num = 0;
            for (let i = 8; i < resultsArray.length; i++) {
                let res = resultsArray[i];
                selectedResults.push(res);
                durationSum += res.duration;
                num += 1;
                if (num===20) break;
            }
            let mean = durationSum/20;

            // calculate the stddev
            let distSum = 0;
            for (let r = 0; r<selectedResults.length; r++) {
                let rslt = selectedResults[r];
                let dist = Math.pow(rslt.duration - mean,2);
                distSum += dist;
            }
            let stddev = Math.sqrt(distSum/20);

            // console.log("AVERAGE DURATION:",durationSum/20);
            // console.log("NUMBER: ",num);
            // console.log("AVERAGE DURATION: ",mean);
            // console.log("STANDARD DEVIATION: ",stddev);
            // console.log("NUMBER OF SAMPLES: ", selectedResults.length);
            console.log()
        } else {
            console.log()
        }
    });

    let finalArray = [];
    totalResults.forEach(resArray => {
        if (resArray.length>2) {
            var s = "";
            let num = 0;
            for(let i = 8; i < resArray.length; i++) {
                s += resArray[i] + " ";
                num += 1;
                if (num===20) break;
            }
            console.log(s);
        }
    })
};


const printExperimentResultsBackup = function () {
// const printExperimentResults = function () {
    // console.log(experimentsLog);
    let results = new Map();

    experimentsLog.forEach(function (obj,ind) {
        // console.log(ind,obj.name);
        if (results.has(obj.name)) {
            let existingMeasurements = results.get(obj.name);
            let latestResult = existingMeasurements[existingMeasurements.length-1];
            if (obj.type==='finish') {
                latestResult.finish = obj.time;
                latestResult.duration = latestResult.finish - latestResult.start;
                // console.log(latestResult);
            } else {
                let newResult = {
                    start: obj.time
                };
                existingMeasurements.push(newResult);
            }
        } else {
            if (obj.type==='start') {
                let resultsArray = [];
                let newResult = {
                    start: obj.time
                };
                resultsArray.push(newResult);
                results.set(obj.name,resultsArray);
            } else {
                console.log("The first appearance of the object has finish type");
                console.log("Here it is",obj);
            }
        }
    });

    results.forEach(function (value, key) {
        let moduleName = key;
        let resultsArray = value;
        // console.log(moduleName,resultsArray.length,resultsArray);
        console.log(moduleName,resultsArray.length);
        for (let i = 0; i < resultsArray.length; i++) {
            let res = resultsArray[i];
            console.log(res.start, res.finish, res.duration);
        }

        let selectedResults = [];
        if (resultsArray.length>=28) {
            let durationSum = 0;
            let num = 0;
            for (let i = 8; i < resultsArray.length; i++) {
                let res = resultsArray[i];
                selectedResults.push(res);
                durationSum += res.duration;
                num += 1;
                if (num===20) break;
            }
            let mean = durationSum/20;

            // calculate the stddev
            let distSum = 0;
            for (let r = 0; r<selectedResults.length; r++) {
                let rslt = selectedResults[r];
                let dist = Math.pow(rslt.duration - mean,2);
                distSum += dist;
            }
            let stddev = Math.sqrt(distSum/20);

            // console.log("AVERAGE DURATION:",durationSum/20);
            // console.log("NUMBER: ",num);
            console.log("AVERAGE DURATION: ",mean);
            console.log("STANDARD DEVIATION: ",stddev);
            console.log("NUMBER OF SAMPLES: ", selectedResults.length);
            console.log()
        } else {
            console.log()
        }
    });
};

// const printExperimentResults = function () {
//
//     let averageTimes = new Map();
//     let numValidRounds = 0;
//     experimentsLog.forEach(function (exp, ind) {
//         if (ind>11) {    // skip first 11 measurements for warmup
//             numValidRounds += 1;
//             for (let moduleName in exp) {
//                 // console.log(moduleName);
//                 if (averageTimes.has(moduleName)) {
//                     let currentObject = averageTimes.get(moduleName);
//                     let currentTimeSum = currentObject.timeSum;
//                     currentObject.timeSum = currentTimeSum + exp[moduleName].duration;
//
//                     averageTimes.set(moduleName,currentObject);
//                 } else {
//                     let newObject = {
//                         timeSum: exp[moduleName].duration
//                     };
//                     averageTimes.set(moduleName,newObject);
//                 }
//             }
//         }
//     });
//
//     averageTimes.forEach(function (value,key) {
//         console.log(key + ": " + value.timeSum/numValidRounds + " ms")
//     })
// };

//
// If we're in debug mode then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV === 'DEBUG') {
    infoLog.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
    errorLog.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
    debugLog.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

//
// If we're not in measurement mode then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV === 'MEASUREMENT') {
    // silence all other outputs
    infoLog.add(new winston.transports.Console({
        silent: true
    }));
    // do not silence the errors. those are important
    // errorLog.add(new winston.transports.Console({
    //     silent: true
    // }));
    debugLog.add(new winston.transports.Console({
        silent: true
    }));
}

//
// If we're not in production mode then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV === 'PRODUCTION') {
    infoLog.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
    errorLog.add(new winston.transports.Console({
        silent: true
    }));
    debugLog.add(new winston.transports.Console({
        silent: true
    }));
}

module.exports = {
    infoLog: infoLog,
    errorLog: errorLog,
    debugLog: debugLog,
    timeLog: timeLog,
    newRound: newRound,
    logHistory: logHistory,
    printExperimentResults: printExperimentResults
};


