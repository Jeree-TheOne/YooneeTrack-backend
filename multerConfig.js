const multer = require('multer');
const { v4: uuid } = require('uuid');


const storageAvatars = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './storage/avatars')
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid()}.${file.originalname.split('.').at(-1)}`)
  }
})

const storageFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './storage/files')
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid()}.${file.originalname.split('.').at(-1)}`)
  }
})

const uploadAvatar = multer({ storage: storageAvatars }).single('image')

const uploadFiles = multer({ storage: storageFiles }).array('files', 10)

module.exports = {
  uploadAvatar,
  uploadFiles
}