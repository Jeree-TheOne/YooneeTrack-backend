const ApiError = require('../Exceptions/ApiError')
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')
const { jsArrayToPgArray, removeEmpty } = require('../utils/dataFormatter')

class MemberService {
  async add(display_name, user_id, workspace_id, roles = []) {
    try {
      const member = await DatabaseMiddleware.select('member', [], {where: { and: { user_id, workspace_id }}})

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

  async isWorkspaceAvailable(user_id, workspace_id) {
    try {
      const member = await DatabaseMiddleware.select('member', [], {where: { and: { user_id, workspace_id }}})
      if (member) return true
      return false
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async getMemberId(user_id, workspace_id = null) {
    const {id: member_id} = await DatabaseMiddleware.select('member', ['id'], {where: { and: removeEmpty({ user_id, workspace_id })}})
    return member_id
  }

  async getMemberData(member_id) {
    if (!member_id) return null
    const member = await DatabaseMiddleware.select('member', ['member.display_name as name', 'file.path'],
      { where: { and: { 'member.id': member_id }}},
      { 
        user: ['id', 'member.user_id'],
        file: [ 'id', 'user.image', 'full' ] 
      }
    )
    return member
  }

  async getMembers(workspace_id) {
    const members = await DatabaseMiddleware.select('member', ['member.id', 'member.display_name', 'user.email', 'file.path'], 
      { where: { and: { 'member.workspace_id': workspace_id }}},
      {
        user: ['id', 'member.user_id'],
        file: [ 'id', 'user.image', 'full' ]
      }
    )
    if (members instanceof Array) return members
    return [members]
  }
}

module.exports = new MemberService()