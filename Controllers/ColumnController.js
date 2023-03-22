const ColumnService = require('../Services/ColumnService')

class ColumnController {
  async create(req, res, next) {
    const { workspace } = req
    const { name } = req.body
    try {
      await ColumnService.add(name, workspace)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    const { columnId } = req.params
    try {
      await ColumnService.delete(columnId)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    const { columnId } = req.params
    const { name } = req.body
    try {
      await ColumnService.update(columnId, name)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new ColumnController()