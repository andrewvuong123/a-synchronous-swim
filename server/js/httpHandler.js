const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};


// get/post/update/fetch/delete/options = requests
// facebook.com/login (login = endpoint or req.url)
// router is where endpoint sits "whatever is after the /", manages data
// each endpoint expect diff type of info
// GET = Random swim request
// POST = Adding a background img
// FETCH = Connecting client to server
module.exports.router = (req, res, next = ()=>{}) => {
  //console.log('Serving request type ' + req.method + ' for url ' + req.url);

  // OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
  // GET request
  if (req.method === 'GET') {
    // fetch swim command
    if (req.url === '/') {
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue());
    }
    // random swimming
    if (req.url === '/random') {
      let directions = ['up', 'down', 'left', 'right'];
      let rand = Math.floor(Math.random() * 4);
      res.writeHead(200, headers);
      res.end(directions[rand]);
    }
    // upload a bg img
    if (req.url === '/background.jpg') {
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          // 404 response
          res.writeHead(404);
        } else {
          // success, send back binary data
          res.writeHead(200);
          res.write(data, 'binary');
        }
        res.end();
        next();
      });
    }
  }
  // POST request
  if (req.method === 'POST' && req.url === '/background.jpg') {
    // initialize an empty buffer
    var fileData = Buffer.alloc(0);
    // on each chunk we get, build up image to filedata
    req.on('data', (chunk) => {
      fileData = Buffer.concat([fileData, chunk]);
    });
    // once done building img, can write file
    req.on('end', () => {
      var file = multipart.getFile(fileData);
      // writes specified data to a file
      fs.writeFile(module.exports.backgroundImageFile, file.data, (err) => {
        // if err, 404 else 201
        res.writeHead(err ? 400 : 201, headers);
        res.end();
        next();
      });
    });
  }
};

