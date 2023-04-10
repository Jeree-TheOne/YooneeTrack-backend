const bcrypt = require('bcrypt')
const uuid = require('uuid')
const EmailService = require('./EmailService')
const TokenService = require('./TokenService')
const ApiError = require('../Exceptions/ApiError')
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')

class AuthService {
  async registration(email, password) {
    const candidate = await DatabaseMiddleware.select('user', [], {where: {and: {email}}})
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь c таким почтовым адресом ${email} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const activationLink = uuid.v4().toString()

    await DatabaseMiddleware.insert('user', {
      id: activationLink,
      created_at: Date.now(),
      login: email,
      password: hashPassword,
      image: '72ea1172-17a7-4b14-a706-1dec062e080a',
      email
    })

    EmailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
  }

  async login(login, password) {
    const user = await DatabaseMiddleware.select('user', ['user.id as id', 'user.password', 'user.email', 'user.login', 'user.created_at as created_at', 'user.first_name', 'user.second_name', 'file.path as avatar', 'user.is_blocked', 'user.is_premium', 'user.is_activated'], {where: {or: {'user.email': login, 'user.login': login}}},
    {
      file: ['id', 'user.image', 'full']
    }
    )
    if (!user) {
      throw ApiError.BadRequest('Пользователя c таким логином не существует')
    }

    if (!user.is_activated) {
      throw ApiError.BadRequest('Аккаунт не активирован')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Некорректный пароль')
    }

    delete user.password

    return this.generateToken(user)
  }

  async logout(refresh_token) {
    await TokenService.removeToken(refresh_token)
  }

  async refresh(refresh_token) {
    if (!refresh_token) {
      throw ApiError.Unauthorized()
    }
    const userData = TokenService.validateRefreshToken(refresh_token)
    const tokenFromDb = await TokenService.tokenFromDb(refresh_token)
    if (!userData || !tokenFromDb) {
      throw ApiError.Unauthorized()
    }
    const userFromDb = await DatabaseMiddleware.select('user', ['user.id as id', 'user.password', 'user.email', 'user.login', 'user.created_at as created_at', 'user.first_name', 'user.second_name', 'file.path as avatar', 'user.is_blocked', 'user.is_premium', 'user.is_activated'], {where: {and: {'user.id': userData.id}}},
    {
      file: ['id', 'user.image']
    }
    )
    delete userFromDb.password
    return this.generateToken(userFromDb)
  }

  async activate(activationLink) {
    const user = await DatabaseMiddleware.select('user', [], {where:{and: {id: activationLink}}})
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации')
    }

    await DatabaseMiddleware.update('user', {is_activated: true}, {and: {id: activationLink}})
  }

  async generateToken(user) {
    const tokens = TokenService.generateToken({...user})
    await TokenService.saveToken(user.id, tokens.refresh_token)

    return {
      ...tokens,
      user
    }
  }
}

module.exports = new AuthService();