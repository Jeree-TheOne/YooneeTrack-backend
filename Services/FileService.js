const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');

class FileService {
  async upload(path) {
    const { id } = await DatabaseMiddleware.insert('file', {path: `.\\${path}`, created_at: Date.now()}, ['id']);
    return id
  }

  async selectFiles(files_id) {
    const files = await DatabaseMiddleware.select('file', ['path'], { where: { in: {id: files_id}}})
    if (files == null) return []
    if (files instanceof Array) {
      return files.map(file => file.path)
    }
    return [files.path]
  }
}

module.exports = new FileService()