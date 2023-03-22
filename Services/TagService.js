const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware')
const { removeEmpty } = require('../utils/dataFormatter')

class TagService {
  async add(name, background = '#FF0000', color = '#000000', workspace_id) {
    const { id } = await DatabaseMiddleware.insert('tag', {name, background, color, workspace_id, created_at: Date.now()}, ['id'])
    return id
  }

  async delete(id) {
    const { id: tag_id } = await DatabaseMiddleware.delete('tag', { and: { id } }, ['id'])
    return tag_id
  }

  async update(id, name, background, color) {
    const tag = await DatabaseMiddleware.update('tag', removeEmpty({ name, background, color }), { and: { id } })
    return tag
  }

  async selectAll(workspace_id) {
    const tags = await DatabaseMiddleware.select('tag', ['id', 'name', 'background', 'color'], { 
      where: {and: { workspace_id }},
      orderby: { created_at: "ASC"}
    })
    return tags
  }

  async select(tags_id) {
    const tags = await DatabaseMiddleware.select('tag', ['id', 'name', 'background', 'color'], { where: { in: {id: tags_id}}})
    if (tags instanceof Array) return tags
    return [tags]
  }
}

module.exports = new TagService()