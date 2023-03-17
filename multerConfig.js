const multer = require('multer');
const { v4: uuid } = require('uuid');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid()}.${file.originalname.split('.').at(-1)}`)
  }
})

const upload = multer({ storage: storage }).single('image')

module.exports = upload