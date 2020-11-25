var linino = require('ideino-linino-lib');
var http = require('http');
var board = new linino.Board();
var pirPin = board.pin.digital.D3;
var button = board.pin.digital.D10;
var led = board.pin.digital.D13;
var buzzerPin = board.pin.pwm.P11;
var motion = false;
var fs = require('fs');
var path = require('path');


board.connect( function() {
    //SIMPLE HTTP SERVER
    var server = http.createServer(function(req, res) {
       if (req.url == '/motion' && req.method == 'GET') {
          var motionEvent = {
            //"value" : motion
            "value": true // this is just for evaluation tests. delete this line in real scenario and uncomment the above one
          };
          res.writeHead(200, {"Content-Type": "application/json"});
          res.write(JSON.stringify(motionEvent));
          res.end();
       }
       else if (req.url == '/alarm' && req.method == 'POST') {
          //soundAlarm();
          //setTimeout(alarmOff, 1*1000); // turn the alarm off after 1 sec
          res.writeHead(200,{'Content-Type': 'text/html'})
          res.end();
       }
       else if (req.url == '/contact' && req.method == 'GET') {
          var contactEvent = {
            "value" : doorOpened
          };
          res.writeHead(200, {"Content-Type": "application/json"});
          res.write(JSON.stringify(contactEvent));
          res.end();
       }
       else if (req.url == '/audio' && req.method == 'GET') {
          var filePath = path.join(__dirname, 'alexa.wav');
          var stat = fs.statSync(filePath);

          res.writeHead(200, {
             'Content-Type': 'audio/wav',
             'Content-Length': stat.size
          });
          var readStream = fs.createReadStream(filePath);

          // We replaced all the event handlers with a simple call to readStream.pipe()
          readStream.pipe(res);
       }
    }).listen(1337);

    board.pinMode(led, board.MODES.OUTPUT);
    board.pinMode(pirPin, board.MODES.INPUT);
    board.pinMode(buzzerPin, board.MODES.PWM);
    board.pinMode(button, board.MODES.INPUT);

    board.digitalRead(pirPin,function(value) {
      if (value===board.HIGH) {
        //console.log("MOTION DETECTED");
        motion = true;
        //board.digitalWrite(led, board.HIGH);
        //board.analogWrite(buzzerPin, 100);
      }
      else {
        //console.log("NO MOTION");
        motion = false;
        //board.digitalWrite(led, board.LOW);
        //board.analogWrite(buzzerPin, 0);
      }
    })

    board.digitalRead(button, function(value){
        if (value == board.HIGH) {
          // console.log('door opened');
          doorOpened = true;
        }
        else {
          // console.log('door closed');
          doorOpened = false;
        }
    });
});

function soundAlarm() {
  board.analogWrite(buzzerPin, 100);
}

function alarmOff() {
  board.analogWrite(buzzerPin, 0);
}


