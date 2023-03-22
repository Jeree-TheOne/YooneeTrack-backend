const DeskService = require('../Services/DeskService')

class DeskController {
  async create(req, res, next) {
    const { workspace } = req
    const { name, isCurrent  } = req.body
    try {
      await DeskService.add(name, workspace, isCurrent)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    const id = req.params.deskId
    try {
      await DeskService.delete(id)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    const id = req.params.deskId
    const { name } = req.body
    try {
      await DeskService.update(id, name)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async setCurrent(req, res, next) {
    const { deskId } = req.params
    const { workspace } = req
    try {
      await DeskService.setCurrent(deskId, workspace)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async getOne(req, res, next) {
    const deskId = req.params.deskId
    try {
      const desk = await DeskService.selectOne(deskId)
      res.status(200).json(desk)
    } catch (e) {
      next(e)
    }
  }

  async getCurrent(req, res, next) {
    const { workspace } = req
    try {
      const desk = await DeskService.selectCurrent(workspace)
      res.status(200).json(desk)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new DeskController()