'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');

const middleware = require('app/middleware');

const multer = middleware.multer;

const awsS3Upload = require('lib/aws-s3-upload');

const mime = require('mime-types');
const path = require('path');

const Upload = models.upload;


const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({ uploads }))
    .catch(err => next(err));
};

const extension = (mimetype, filename) =>
  mime.extension(mimetype) ||
  (!/\/x-/.test(mimetype) && mimetype.replace('/', '/x-')) ||
  path.extname(filename).replace(/^./, '');

const create = (req, res, next) => {
  let upload = {
    mime: req.file.mimetype,
    data: req.file.buffer,
    ext: extension(req.file.mimetype, req.file.originalname),
  };
  awsS3Upload(upload)
  .then((s3response) => {
    let upload = {
      location: s3response.Location,
      title: req.body.upload.title,
  };
    return Upload.create(upload);
  })
  .then((upload) => {
    res.status(201).json({ upload });
  })
  .catch(err => next(err));

};


module.exports = controller({
  index,
  create,
}, { before: [
  { method: multer.single('upload[file]'), only: ['create'] },
], });
