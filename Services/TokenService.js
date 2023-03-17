const jwt = require('jsonwebtoken');
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(id, refreshToken) {
    const tokenData = await DatabaseMiddleware.select('token', [], {and: {userId: id}})
    if (tokenData) {
      await DatabaseMiddleware.update('token', {refreshToken, createdAt: Date.now()}, {and: {userId: tokenData.userId}})
      return
    }

    const token = await DatabaseMiddleware.insert('token', {createdAt: Date.now(), userId: id, refreshToken})
    return token
  }

  async removeToken(refreshToken) {
    await DatabaseMiddleware.delete('token', {
      and: {
        refreshToken
      }
    })
  } 

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  async tokenFromDb(refreshToken) {
    const foundToken = await DatabaseMiddleware.select('token', [], {and: {refreshToken}})
    return foundToken
  }
}

module.exports = new TokenService();