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
        SET refresh_token = '${refreshToken}'
        WHERE user_id = ${tokenData.rows[0].user_id};
    `)
    }

    const token = await pool.query(`
      INSERT INTO public.token (created_at, user_id, refresh_token)
      VALUES (${Date.now()}, '${id}', '${refreshToken}')
    `)

    return token
  }
}

module.exports = new TokenService();