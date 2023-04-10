const jwt = require('jsonwebtoken');
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');

class TokenService {
  generateToken(payload) {
    const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15d'})
    const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30 days' })
    return {
      access_token,
      refresh_token
    }
  }

  async saveToken(id, refresh_token) {
    const tokenData = await DatabaseMiddleware.select('token', [], {where: {and: {user_id: id}}})
    if (tokenData) {
      await DatabaseMiddleware.update('token', {refresh_token, created_at: Date.now()}, {and: {user_id: tokenData.user_id}})
      return
    }

    const token = await DatabaseMiddleware.insert('token', {created_at: Date.now(), user_id: id, refresh_token})
    return token
  }

  async removeToken(refresh_token) {
    await DatabaseMiddleware.delete('token', { and: { refresh_token} })
  } 

  validateAccessToken(token) {
    try {
      return jwt.verify(token.split(' ')[1], process.env.JWT_ACCESS_SECRET)
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (e) {
      return null
    }
  }

  async tokenFromDb(refresh_token) {
    const foundToken = await DatabaseMiddleware.select('token', [], {where: {and: {refresh_token}}})
    return foundToken
  }
}

module.exports = new TokenService();