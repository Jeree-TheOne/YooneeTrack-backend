const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');

class WorkspaceService {
  async insert(name) {
    const { id } = await DatabaseMiddleware.insert('workspace', {name, created_at: Date.now()}, ['id'])
    return id
  }

  async selectAvailable(user_id) {
    const workspaces = await DatabaseMiddleware.select('workspace', ['workspace.*'], {
      where: { and: { 'user.id': user_id } }
    }, { 
      member: ['workspace_id', 'workspace.id'], 
      user: ['id', 'member.user_id'] 
    })
    if (workspaces == null) return []
    if (workspaces instanceof Array) return workspaces
    return [workspaces]
  }

  async selectOne(id) {
    const workspace = await DatabaseMiddleware.select('workspace', [], { where: { and: { id } }})
    return workspace
  }

  async update(id, name) {
    await DatabaseMiddleware.update('workspace', { name }, { and: { id }})
  }
}

module.exports = new WorkspaceService();