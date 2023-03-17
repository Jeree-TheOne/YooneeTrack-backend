const upload = require('../multerConfig')
const { v4: uuid } = require('uuid');
const FileService = require('../Services/FileService');
const TokenService = require('../Services/TokenService');
const UserService = require('../Services/UserService');
const ApiError = require('../Exceptions/ApiError');

class AttachmentController {
  async uploadAvatar(req, res, next) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          throw ApiError.BadRequest(err.message)
        } else if (req.file) {
          const imageId = await FileService.upload(req.file.path)
          const user = TokenService.validateAccessToken(req.headers.authorization.split(' ')[1])
          console.log(imageId, user.id);
          await UserService.changeAvatar(user.id, imageId)

          return res.status(200).send()
        } else {
          return ApiError.BadRequest('Нет фотографии')
        }
      })
    } catch (e) {
      next(e)
    }
  }

  async addFileToTask(req, res, next) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          throw ApiError.BadRequest(err.message)
        } else if (req.file) {
          
        }
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AttachmentController()