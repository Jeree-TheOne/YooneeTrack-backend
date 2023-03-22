const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')

class RowService {
  async add(name, workspace_id) {
    const { id } = await DatabaseMiddleware.insert('row', {name, workspace_id, created_at: Date.now()}, ['id'])
    return id
  }

  async delete(id) {
    const { id: row_id } = await DatabaseMiddleware.delete('row', { and: { id } }, ['id'])
    return row_id
  }

  async update(name, id) {
    const row = await DatabaseMiddleware.update('row', { name }, { and: { id } })
    return row
  }

  async selectAll(workspace_id) {
    const rows = await DatabaseMiddleware.select('row', ['id', 'name'], { 
      where: {and: { workspace_id } },
      orderby: { created_at: "ASC"}
    })
    return rows
  }
}

module.exports = new RowService()