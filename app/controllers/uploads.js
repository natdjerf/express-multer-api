'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');

const middleware = require('app/middleware');

const multer = middleware.multer;

const awsS3Upload = require('lib/aws-s3-upload');

const Upload = models.upload;


const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({ uploads }))
    .catch(err => next(err));
};

const create = (req, res, next) => {
  let upload = {
    mime: req.file.mimetype,
    data: req.file.buffer,
  };


  res.json({ upload });
  // Upload.create(upload)
  //   .then(upload => res.json({ upload }))
  //   .catch(err => next(err));
};

const noop = (req, res, next) => {
  next();
};

module.exports = controller({
  index,
  create,
}, { before: [
  { method: multer.single('upload[file]'), only: ['create'] },
], });
