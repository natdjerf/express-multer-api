'use strict';

// require for encyrption
const crypto = require('crypto');
// require AWS constructor to create a new s3 (neccessary to upload)
const AWS = require('aws-sdk');
// instance of AWS
const s3 = new AWS.S3();


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
const awsS3Upload = (file) =>
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



module.exports = awsS3Upload;
