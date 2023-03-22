const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')

class ColumnService {
  async add(name, workspace_id) {
    const { id } = await DatabaseMiddleware.insert('column', {name, workspace_id, created_at: Date.now() }, ['id'])
    return id
  }

  async delete(id) {
    const { id: column_id } = await DatabaseMiddleware.delete('column', { and: { id } }, ['id'])
    return column_id
  }

  async update(name, id) {
    const column = await DatabaseMiddleware.update('column', { name }, { and: { id } })
    return column
  }

  async selectAll(workspace_id) {
    const columns = await DatabaseMiddleware.select('column', ['id', 'name'], { 
      where: {and: { workspace_id }},
      orderby: { created_at: "ASC"}
    })
    return columns
  }
}

module.exports = new ColumnService()