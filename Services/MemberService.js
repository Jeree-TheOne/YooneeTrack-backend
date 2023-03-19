const ApiError = require('../Exceptions/ApiError')
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')
const { jsArrayToPgArray } = require('../utils/dataFormatter')

class MemberService {
  async add(display_name, user_id, workspace_id, roles = []) {
    try {
      const member = await DatabaseMiddleware.select('member', [], { and: { user_id, workspace_id }})

      if (member) {
        throw ApiError.BadRequest('Пользователь уже является участником рабочего пространства')
      }

      await DatabaseMiddleware.insert('member', {
        display_name,
        user_id,
        roles: jsArrayToPgArray(roles),
        workspace_id,
        created_at: Date.now()
      })
    } catch (error) {
      throw ApiError.BadRequest()
    }
  }

  displayName(user) {
    const { login, firstName, secondName } = user
    if (firstName && secondName) return `${firstName} ${secondName}`
    return login
  }
}

module.exports = new MemberService()