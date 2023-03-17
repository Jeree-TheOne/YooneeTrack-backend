const { v4: uuid } = require('uuid');
const DatabaseMiddleware = require('../Middleware/DatabaseMiddleware');

class AttachmentService {
  async upload(path) {
    const { id } = await DatabaseMiddleware.insert('file', {path: `.\\${path}`}, ['id']);
    return id
  }
}

module.exports = new AttachmentService()