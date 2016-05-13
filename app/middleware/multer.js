'use strict';

// this file is to get storage from multer
const multer = require('multer');
const storage = multer.memoryStorage();

module.exports = multer({ storage });
