
const http = require('http');
const fs = require('fs');

http.createServer(function(req, res) {
   if (req.url == '/intrusion' && req.method == 'POST') {
     var requestBody = [];
     req.on('data', function(data) {
       requestBody.push(data);
     });
     req.on('end', function() {
       res.writeHead(200, {'Content-Type': 'application/json'});
       let responseObject = {
               okay: 'thanks'
       }
       res.write(JSON.stringify(responseObject));
       res.end();
       let requestObject = Buffer.concat(requestBody);
       let fileObject = JSON.parse(requestObject);
       let imageBase64 = fileObject.cameraFrame;
       let msg = fileObject.msg;
       console.log(imageBase64);
       console.log(msg);
       let frameData = new Buffer.from(imageBase64, 'base64');
       fs.writeFile('frame.jpg',frameData, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
       })
     });
   }
}).listen(3443);
