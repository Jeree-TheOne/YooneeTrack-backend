const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')

class TagService {
  async add(name, background, color, workspace_id) {
    const { id } = await DatabaseMiddleware.insert('tag', {name, background, color, workspace_id, created_at: Date.now()}, ['id'])
    return id
  }

  async delete(id) {
    const { id: tag_id } = await DatabaseMiddleware.delete('tag', { and: { id } }, ['id'])
    return tag_id
  }

  async update(name, background, color, id) {
    const tag = await DatabaseMiddleware.update('tag', { name, background, color }, { and: { id } })
    return tag
  }
}

module.exports = new TagService()