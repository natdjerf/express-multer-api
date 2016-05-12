'use strict';

// require fs to read file
const fs = require('fs');
// set file to command line argument (or temporarily as '' for testing)
let filename = process.argv[2] || '';

fs.readFile(filename, (err, data) => {
  if (err) {
    return console.error(err);
  }
  console.log(`${filename} is ${data.length} bytes long.`);
});


  // what is the need for buffer?
