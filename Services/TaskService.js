const ApiError = require('../Exceptions/ApiError');
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');
const { removeEmpty, jsArrayToPgArray } = require('../utils/dataFormatter');

class TaskService {
  async add(title, description, creator, row_id, column_id, desk_id, task_type_id, tags = [], files = []) {
    try {
      const task = await DatabaseMiddleware.insert('task', {created_at: Date.now(), ...removeEmpty({title, description, creator, row_id, column_id, desk_id, task_type_id, tags: jsArrayToPgArray(tags), files: jsArrayToPgArray(files)})})
      return task
    }
    catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async selectAll(desk_id) {
    try {
      const tasks = await DatabaseMiddleware.select('task', ['task.id', 'task.title', 'task.description', 'task.tags', 'task_type.name as task_type', 'task.initial_assessment', 'task.spent_time', 'file.path as performer_avatar', 'task.column_id', 'task.row_id' ], 
        { where: { and: { 'task.desk_id': desk_id }}},
        { 
          task_type: ['id', 'task.task_type_id', 'full'], 
          member: ['id', 'task.performer', 'full'],
          user: ['id', 'member.user_id', 'full'],
          file: [ 'id', 'user.image', 'full' ] 
        }
      )
      if (tasks instanceof Array) { return tasks }
      return [tasks]
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async selectOne(task_id) {
    try {
      const task = await DatabaseMiddleware.select('task', [], { where: { and: { 'task.id': task_id }}})
      return task
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }

  async update(task_id, updater, values) {
    try {
      Object.entries(values).map(([field, value]) => {
        if (value instanceof Array) {
          values[field] = jsArrayToPgArray(value);
        }
      })
      await DatabaseMiddleware.update('task', removeEmpty({updater, ...values, updated_at: Date.now()}), { and: { id: task_id}})
    } catch (e) {
      throw ApiError.BadRequest()
    }
  }
}

module.exports = new TaskService()