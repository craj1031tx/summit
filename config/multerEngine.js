const multer = require('multer')
const mime = require('mime-types')  //converts stored mime type extensions from multer into file extensions. 
const crypto = require('crypto')    //creates random string to store files
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
    }
  });
var upload = multer({ storage: storage });

module.exports = upload;