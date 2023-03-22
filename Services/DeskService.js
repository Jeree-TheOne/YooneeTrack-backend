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

  async selectCurrent(workspace_id) {
    const desk = await DatabaseMiddleware.select('desk', {where:{ and: { workspace_id, is_current: true } }})
    delete desk.workspace_id
    return desk
  }

  async selectAll(workspace_id) {
    const desks = await DatabaseMiddleware.select('desk', ['id', 'name', 'is_current'], { 
      where: {and: { workspace_id }},
      orderby: { is_current: 'DESC', created_at: "DESC"}
    })
    return desks
  }

  async selectOne(desk_id) {
    const desk = await DatabaseMiddleware.select('desk', [], { where: { and: { id: desk_id } } } )
    return desk
  }
}

module.exports = new DeskService()