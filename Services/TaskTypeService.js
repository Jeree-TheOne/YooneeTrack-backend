const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')

class TaskTypeService {
  async add(name, workspace_id) {
    const { id } = await DatabaseMiddleware.insert('task_type', {name, workspace_id, created_at: Date.now()}, ['id'])
    return id
  }

  async delete(id) {
    const { id: task_type_id } = await DatabaseMiddleware.delete('task_type', { and: { id } }, ['id'])
    return task_type_id
  }

  async update(name, id) {
    const task_type = await DatabaseMiddleware.update('task_type', { name }, { and: { id } })
    return task_type
  }

  async selectAll(workspace_id) {
    const task_types = await DatabaseMiddleware.select('task_type', ['id', 'name'], { 
      where: { and: { workspace_id } },
      orderby: { created_at: "ASC"}
    })
    return task_types
  }
}

module.exports = new TaskTypeService()