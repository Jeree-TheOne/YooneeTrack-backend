const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')

class DeskService {
  async add(name, workspace_id, is_current = false) {
    const { id } = await DatabaseMiddleware.insert('desk', {name, workspace_id, is_current, created_at: Date.now()}, ['id'])
    return id
  }

  async delete(id) {
    const { id: desk_id } = await DatabaseMiddleware.delete('desk', { and: { id } }, ['id'])
    return desk_id
  }

  async update(name, id) {
    const desk = await DatabaseMiddleware.update('desk', { name }, { and: { id } })
    return desk
  }

  async setCurrent(id, workspace_id) {
    await DatabaseMiddleware.update('desk', { is_current: false }, { and: { workspace_id, is_current: true } })
    await DatabaseMiddleware.update('desk', { is_current: true }, { and: { id }})
  }
}

module.exports = new DeskService()