const upload = require('../multerConfig')
const FileService = require('../Services/FileService');
const TokenService = require('../Services/TokenService');
const UserService = require('../Services/UserService');
const ApiError = require('../Exceptions/ApiError');

class FileController {
  async uploadAvatar(req, res, next) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          throw ApiError.BadRequest(err.message)
        } else if (req.file) {
          const imageId = await FileService.upload(req.file.path)
          const { id } = TokenService.validateAccessToken(req.headers.authorization.split(' ')[1])
          await UserService.changeAvatar(id, imageId)

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

module.exports = new FileController()