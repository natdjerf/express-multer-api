'use strict';

require('dotenv').config();

// ***Required Node modules:

// require fs to read file
const fs = require('fs');
// require for encyrption
const crypto = require('crypto');



// require filetype to read from buffer
const fileType = require('file-type');
// require AWS constructor to create a new s3 (neccessary to upload)
const AWS = require('aws-sdk');


// ***Setting the variables for the promise:

// fileType returns an object with ext & mime, or null
// setting a mock mimeType object to bin/octect for null cases
const s3 = new AWS.S3();

const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));

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

// to generate an encrytped string
const randomHexString = (length) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString('hex'));
      }
    });
  });

// upload to AWS function
const awsUpload = (file) =>
  randomHexString(16)
  .then((filename) => {
    // to generate a date directory
    let dir = new Date().toISOString().split('T')[0];
    // add necessary paramaters for AWS upload
    return {
      ACL: 'public-read',
      Body: file.data,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ContentType: file.mime,
      Key: `${dir}/${filename}.${file.ext}`,
    };

  }).then(params =>
    new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  );





// ***Upload Function:

// readFile returns a promise. To get the data read, invoke readFile:
readFile(filename)
.then((data) => {
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsUpload)
.then((s3response) =>
  console.log(s3response))
// .then((file) =>
//   // console.log(`${filename} is ${file.data.length} bytes long.`))
//   console.log(filename, file))
// handle all errors:
.catch(console.error);
