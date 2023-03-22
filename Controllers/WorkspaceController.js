const ApiError = require('../Exceptions/ApiError')
const ColumnService = require('../Services/ColumnService')
const DeskService = require('../Services/DeskService')
const MemberService = require('../Services/MemberService')
const RowService = require('../Services/RowService')
const TagService = require('../Services/TagService')
const TaskTypeService = require('../Services/TaskTypeService')
const TokenService = require('../Services/TokenService')
const WorkspaceService = require('../Services/WorkspaceService')

class WorkspaceController {
  async create(req, res, next) {
    try {
      const { name: workspaceName } = req.body

      if (!workspaceName) {
        throw ApiError.BadRequest('Не указано название рабочего пространства')
      }
      const user = req.user
      const workspaceId = await WorkspaceService.insert(workspaceName)

      const memberName = MemberService.displayName(user)
      await MemberService.add(memberName, user.id, workspaceId)

      await DeskService.add('Доска', workspaceId, true)

      await ColumnService.add('Нужно сделать', workspaceId)
      await ColumnService.add('В процессе', workspaceId)
      await ColumnService.add('Готово', workspaceId)

      await RowService.add('Задачи', workspaceId)

      await TaskTypeService.add('Задача', workspaceId)

      await TagService.add('Важное', '#FF0000', '#000000', workspaceId)
      
      return res.redirect(`${process.env.CLIENT_URL}/workspaces/${workspaceId}`)
    } catch (e) {
      next(e)
    }
  }

  async selectAvailable(req, res, next) {
    const { id } = req.user
    try {
      const availableWorkspaces = await WorkspaceService.selectAvailable(id)
      res.status(200).json(availableWorkspaces)
    } catch (e) {
      next(e)
    }
  }

  async selectOne(req, res, next) {
    const { id: userId } = req.user

    const workspaceId = req.params.workspace
    try {
      const isWorkspaceAvailable = MemberService.isWorkspaceAvailable(userId, workspaceId)
      if (!isWorkspaceAvailable) {
        throw ApiError.BadRequest('Рабочее пространство Вам недоступно')
      }

      const [desks, rows, columns, tags, taskTypes, workspace, members] = await Promise.all([
        DeskService.selectAll(workspaceId),
        TagService.selectAll(workspaceId),
        TaskTypeService.selectAll(workspaceId),
        RowService.selectAll(workspaceId),
        ColumnService.selectAll(workspaceId),
        WorkspaceService.selectOne(workspaceId),
        MemberService.getMembers(workspaceId)
      ])

      return res.status(200).json({
        ...workspace,
        desks,
        rows,
        columns,
        tags,
        taskTypes,
        members
      })
    } catch (e) {
      next(e)
    }
  }

  async getMembers(req, res, next) {
    const { workspace } = req
    try {
      const members = await MemberService.getMembers(workspace)
      res.status(200).json(members)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new WorkspaceController()