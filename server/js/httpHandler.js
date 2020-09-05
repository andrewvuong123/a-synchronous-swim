const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const keypress = require('./keypressHandler');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

// get/post/update/fetch/delete/options are requests
// facebook.com/login (login = endpoint or req.url)
// router is where endpoint sits "whatever is after the /", manages data
// each endpoint expect diff type of info
// GET = Random swim request
// POST = Adding a background img
// FETCH = Connecting client to server
module.exports.router = (req, res, next = ()=>{}) => {
  // STEPS
  // 1) validation (validate a request)
  // 2) parse the request object (url/method/data)
  // 3) perform logic, ex: save to database/randomize string/random swim command
  // 4) build response object after logic, html response codes
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'GET') {
    if (req.url === '/img') {
      console.log('here2');
      fs.readFile('/img', (err, data) => {
        console.log('here');
        if (err) {
          res.writeHead(404, headers);
          res.end();
        } else {
          res.writeHead(200, headers);
          res.end();
        }
      })
    } else {
      // let directions = ['up', 'down', 'left', 'right'];
      // let rand = Math.floor(Math.random() * 4);
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue());
    }
  } else {
    res.writeHead(200, headers);
    res.end();
  }
  next(); // invoke next() at the end of a request to help with testing!
};
