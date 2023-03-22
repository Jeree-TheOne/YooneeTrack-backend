const DeskService = require('../Services/DeskService')

class DeskController {
  async create(req, res, next) {
    const { workspaceId } = req.params
    const { name, isCurrent  } = req.body
    try {
      await DeskService.add(name, workspaceId, isCurrent)
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
    const { workspaceId } = req.body
    try {
      await DeskService.setCurrent(deskId, workspaceId)
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
    const workspaceId = req.params.workspaceId
    try {
      const desk = await DeskService.selectCurrent(workspaceId)
      res.status(200).json(desk)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new DeskController()