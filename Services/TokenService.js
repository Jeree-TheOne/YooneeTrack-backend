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
    const tokenData = await DatabaseMiddleware.select('token', [], {and: {user_id: id}})
    if (tokenData) {
      await DatabaseMiddleware.update('token', {refresh_token: refreshToken, created_at: Date.now()}, {and: {user_id: tokenData.user_id}})
      return
    }

    const token = await DatabaseMiddleware.insert('token', {created_at: Date.now(), user_id: id, refresh_token: refreshToken})
    return token
  }

  async removeToken(refreshToken) {
    await DatabaseMiddleware.delete('token', {
      and: {
        refresh_token: refreshToken
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

  async tokenFromDb(token) {
    const foundToken = await DatabaseMiddleware.select('token', [], {and: {refresh_token: token}})
    return foundToken
  }
}

module.exports = new TokenService();