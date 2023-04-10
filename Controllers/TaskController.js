const ApiError = require('../Exceptions/ApiError')
const { uploadFiles } = require('../multerConfig')
const FileService = require('../Services/FileService')
const MemberService = require('../Services/MemberService')
const TagService = require('../Services/TagService')
const TaskService = require('../Services/TaskService')

class TaskController {
  async create(req, res, next) {
    const { workspace } = req
    const { id } = req.user
    try {      
      uploadFiles(req, res, async (err) => {
        if (err) {
          throw ApiError.BadRequest(err.message)
        } else if (req.files) {
          const { title, description, rowId, columnId, deskId, taskTypeId, tags, initialAssessment, performer } = req.body
          const tagsData = tags && typeof tags !== 'Array' ? [tags] : tags
          const creator = await MemberService.getMemberId(id, workspace)
          if (!creator) {
            throw ApiError.BadRequest('Пользователь не является участником рабочего пространства')
          }
          const files = await FileService.upload(req.files.map(file => file.path))
          const task = await TaskService.add(title, description, creator, rowId, columnId, deskId, taskTypeId, initialAssessment, performer, tagsData, files)
          res.status(200).json(task)
        }
      })
    } catch (e) {
      next(e)
    }
  }

  async selectAll(req, res, next) {
    const { workspace } = req
    const { deskId } = req.query
    if (!workspace) {
      throw ApiError.BadRequest('UNAVAILABLE_WORKSPACE')
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
      const [files, creator, updater] = await Promise.all([
        FileService.selectFiles(task.files),
        MemberService.getMemberData(task.creator),
        MemberService.getMemberData(task.updater),
      ])
      task.files = files
      task.creator = creator
      task.updater = updater
      res.status(200).json(task)
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    const { id } = req.user
    const { workspace } = req
    const  taskId = req.params.taskId
    try {
      uploadFiles(req, res, async (err) => {
        if (err) {
          throw ApiError.BadRequest(err.message)
        } else {
          const { tags, ...args } = req.body
          const files = req.files?.length ? await FileService.upload(req.files.map(file => file.path)) : null
          const updater = await MemberService.getMemberId(id, workspace)
          const tagData = tags ? tags instanceof Array ? tags : [tags] : null
          await TaskService.update(taskId, updater, {...args, files, tags: tagData})
          return res.status(200).json('Успешно')
        }
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new TaskController();