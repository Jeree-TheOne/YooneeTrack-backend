const ApiError = require('../Exceptions/ApiError')
const DeskService = require('../Services/DeskService')
const FileService = require('../Services/FileService')
const MemberService = require('../Services/MemberService')
const TagService = require('../Services/TagService')
const TaskService = require('../Services/TaskService')
const TokenService = require('../Services/TokenService')

class TaskController {
  async create(req, res, next) {
    const { title, description, rowId, columnId, deskId, taskTypeId, tags } = req.body
    const { workspace } = req
    const { id } = req.user
    try {      
      const creator = await MemberService.getMemberId(id, workspace)
      if (!creator) {
        throw ApiError.BadRequest('Пользователь не является участником рабочего пространства')
      }
      const task = await TaskService.add(title, description, creator, rowId, columnId, deskId, taskTypeId, tags)
      res.status(200).json(task)
    } catch (e) {
      next(e)
    }
  }

  async selectAll(req, res, next) {
    const { user, workspace } = req
    const { id } = user
    const { deskId } = req.query

    if (!workspace) {
      throw ApiError.BadRequest('Рабочее пространство Вам недоступно')
    }
    try { 
      const tasks = await TaskService.selectAll(deskId)

      res.status(200).json(tasks)
    } catch (e) {
      next(e)
    }
  }

  async selectOne(req, res, next) {
    const {taskId} = req.params
    try {
      const task = await TaskService.selectOne(taskId)
      const [files, creator, performer, updater, tags] = await Promise.all([
        FileService.selectFiles(task.files),
        MemberService.getMemberData(task.creator),
        MemberService.getMemberData(task.performer),
        MemberService.getMemberData(task.updater),
        TagService.select(task.tags)
      ])
      task.files = files
      task.creator = creator
      task.performer = performer
      task.updater = updater
      task.tags = tags
      res.status(200).json(task)
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    const { id } = req.user
    const  taskId = req.params.taskId
    const { ...args } = req.body 
    try {
      const updater = await MemberService.getMemberId(id)
      await TaskService.update(taskId, updater, args)
      return res.status(200).json('Успешно')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new TaskController();