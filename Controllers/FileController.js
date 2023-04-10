const { uploadAvatar } = require('../multerConfig')
const FileService = require('../Services/FileService');
const UserService = require('../Services/UserService');
const ApiError = require('../Exceptions/ApiError');

class FileController {
  async uploadAvatar(req, res, next) {
    try {
      uploadAvatar(req, res, async (err) => {
        if (err) {
          throw ApiError.BadRequest(err.message)
        } else if (req.file) {
          const { id } = req.user
          const imageId = await FileService.uploadSingle(req.file.path)
          const data = await UserService.changeAvatar(id, imageId)

          return res.status(200).json(data)
        } else {
          return ApiError.BadRequest('Нет фотографии')
        }
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new FileController()