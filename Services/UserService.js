const pool = require('../pgConfig')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const EmailService = require('./EmailService')
const TokenService = require('./TokenService')
const ApiError = require('../Exceptions/ApiError')

class UserService {
  async registration(email, password) {
    const candidate = await pool.query(`SELECT * FROM public.user WHERE email = '${email}'`)
    if (candidate.rows.length) {
      throw ApiError.BadRequest(`Пользователь c таким почтовым адресом ${email} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const activationLink = uuid.v4().toString()
    await pool.query(`
    INSERT INTO public.user (id, created_at, login, password, email)
    VALUES ('${activationLink}', ${Date.now()}, '${email}', '${hashPassword}', '${email}')
    `)

    const userData = await pool.query(`SELECT id, login, email, first_name, second_name, avatar_path, is_blocked, is_premium, is_activated  FROM public.user WHERE email = '${email}'`)
    const user = userData.rows[0]
    EmailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
    const tokens = TokenService.generateToken({...user})
    await TokenService.saveToken(user.id, tokens.refreshToken)

    return {
      ...tokens,
      user
    }
  }

  async activate(activationLink) {
    const userData = await pool.query(`
    SELECT * FROM public.user WHERE id = '${activationLink}'
    `)
    if (!userData.rows.length) {
      throw ApiError.BadRequest('Некорректная ссылка активации')
    }

    await pool.query(`
        UPDATE public.user
        SET is_activated = true
        WHERE id = '${activationLink}';
    `)
  }
}

module.exports = new UserService();