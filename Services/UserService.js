const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')

class UserService {
  async changeAvatar(userId, imageId) {
    await DatabaseMiddleware.update('user', { image: imageId }, { and: { id: userId } })
  }
}

module.exports = new UserService()