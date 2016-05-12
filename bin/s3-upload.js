'use strict';

// require fs to read file
const fs = require('fs');
// set file to command line argument (or temporarily as '' for testing)
let filename = process.argv[2] || '';

const readFile = (filename) =>
  new Promise((resolve, reject) => {

    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

// readFile returns a promise. To get the data read, invoke readFile:
readFile(filename)
.then((data) =>
  console.log(`${filename} is ${data.length} bytes long.`))
// handle all errors:
.catch(console.error);




  // what is the need for buffer?
