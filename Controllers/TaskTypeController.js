const TaskTypeService = require('../Services/TaskTypeService')


class TaskTypeController {
  async create(req, res, next) {
    const { workspaceId } = req.params
    const { name } = req.body
    try {
      await TaskTypeService.add(name, workspaceId)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    const { taskTypeId } = req.params
    try {
      await TaskTypeService.delete(taskTypeId)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    const { taskTypeId } = req.params
    const { name } = req.body
    try {
      await TaskTypeService.update(taskTypeId, name)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new TaskTypeController()