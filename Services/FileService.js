const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');

class FileService {
  async upload(path) {
    const { id } = await DatabaseMiddleware.insert('file', {path: `.\\${path}`, created_at: Date.now()}, ['id']);
    return id
  }
}

module.exports = new FileService()