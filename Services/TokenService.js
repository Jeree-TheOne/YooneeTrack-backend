const pool = require('../pgConfig')
const jwt = require('jsonwebtoken');

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
    const tokenData = await pool.query(`
    SELECT * FROM public.token
    WHERE user_id = '${id}'
    `)
    if (tokenData.rows.length) {
      await pool.query(`
        UPDATE public.token
        SET refresh_token = '${refreshToken}', created_at = ${Date.now()}
        WHERE user_id = '${tokenData.rows[0].user_id}';
    `)
      return
    }

    const token = await pool.query(`
      INSERT INTO public.token (created_at, user_id, refresh_token)
      VALUES (${Date.now()}, '${id}', '${refreshToken}')
    `)

    return token
  }

  async removeToken(refreshToken) {
    await pool.query(`
      DELETE FROM public.token 
      WHERE refresh_token = '${refreshToken}'
    `)
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
    const foundToken = await pool.query(`
      SELECT * from public.token 
      WHERE refresh_token = '${token}'
    `)
    return foundToken
  }
}

module.exports = new TokenService();