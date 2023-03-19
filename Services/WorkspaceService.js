const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');

class WorkspaceService {
  async insert(name) {
    const { id } = await DatabaseMiddleware.insert('workspace', {name, created_at: Date.now()}, ['id'])
    return id
  }

  async selectAvailable(user_id) {
    return await DatabaseMiddleware.select('workspace', 
      ['workspace.id', 'workspace.created_at', 'workspace.name'],
      {and: { 'user.id': user_id } }, { 
      member: ['workspace_id', 'workspace.id'], 
      user: ['id', 'member.user_id'] 
    })
  }

  async selectWorkspace(id) {
    
  }
}

module.exports = new WorkspaceService();