const RowService = require('../Services/RowService')


class RowController {
  async create(req, res, next) {
    const { workspace } = req
    const { name } = req.body
    try {
      await RowService.add(name, workspace)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    const { rowId } = req.params
    try {
      await RowService.delete(rowId)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    const { rowId } = req.params
    const { name } = req.body
    try {
      await RowService.update(rowId, name)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new RowController()