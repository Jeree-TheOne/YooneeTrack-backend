const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');

class FileService {
  async upload(path) {
    const paths = path.map(path => `\\${path.replaceAll('\\', '/')}`)
    const created_at = new Array(paths.length).fill(Date.now())
    const data = await DatabaseMiddleware.insert('file', {path: paths, created_at}, ['id']);
    if (path instanceof Array && data instanceof Array) return data.map(e => e.id)
    else if (path instanceof Array && !(data instanceof Array)) return [data.id]
    return data.id
  }

  async uploadSingle(path) {
    const data = await DatabaseMiddleware.insert('file', {path: path.replaceAll('\\', '/'), created_at: Date.now()}, ['id']);
    return data.id
  }

  async selectFiles(files_id) {
    if (!files_id.length) return []
    const files = await DatabaseMiddleware.select('file', ['id', 'path'], { where: { in: {id: files_id}}})
    if (files == null) return []
    if (files instanceof Array) {
      return files.map(file => file.path)
    }
    return [files.path]
  }
}

module.exports = new FileService()