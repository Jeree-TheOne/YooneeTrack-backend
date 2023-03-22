const TagService = require('../Services/TagService')


class TagController {
  async create(req, res, next) {
    const { workspace } = req
    const { name, background, color } = req.body
    try {
      await TagService.add(name, background, color, workspace)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    const { tagId } = req.params
    try {
      await TagService.delete(tagId)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    const { tagId } = req.params
    const { name, background, color } = req.body
    try {
      await TagService.update(tagId, name, background, color)
      res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new TagController()