const ApiError = require('../Exceptions/ApiError')
const pool = require('../pgConfig')

class DatabaseMiddleware {
  async select(tableName, columns = [], options = {where: [], orderby: {columns: [], order: 'ASC'}, limit: null, offset: 0}) {
    const { and, or, orderby, limit, offset } = options
    const formattedColumns = columns.length ? columns.join(', ') : '*'
    const formattedOrderBy = orderby?.columns?.length ? `ORDER BY ${orderby.columns.join(', ')} ${orderby.order}` : ''
    let conditions = ''
    const operator = and ? 'and' : or ? 'or' : ''
    if (operator) {
      conditions += Object.entries(options[operator]).map(([field, value]) => `"${field}" = '${value}'`).join(` ${operator.toUpperCase()} `)
    }
    try {
      const data = await pool.query(`
        SELECT ${formattedColumns} from public."${tableName}"
        ${conditions ? `WHERE ${conditions}` : ''}
        ${formattedOrderBy}
        ${limit != undefined ? `LIMIT ${limit} ` : ''} ${offset != undefined || limit ? `OFFSET ${offset || 0} ` : ''}
      `) 

      return data.rows.length > 1 ? data.rows : data.rows[0]
    } catch (e) {
      return ApiError.BadRequest(e.message)
    }
  }

  async insert(tableName, value = {}, returned = []) {
    const formattedReturned = returned.length ? returned.join(', ') : '*'
    try {
      const data = await pool.query(`
      INSERT INTO public."${tableName}" (${Object.keys(value)})
      VALUES (${Object.values(value).map(el => `'${el}'`)})
      RETURNING ${formattedReturned};
    `)

      return data.rows.length > 1 ? data.rows : data.rows[0]
    } catch (e) {
      return ApiError.BadRequest(e.message)
    }
  }

  async update(tableName, value = {}, options = {}, returned = []) {
    const { and, or } = options
    let conditions = ''
    const operator = and ? 'and' : or ? 'or' : ''
    if (operator) {
      conditions = Object.entries(options[operator]).map(([field, value]) => `"${field}" = '${value}'`).join(` ${operator.toUpperCase()} `)
    }
    const formattedReturned = returned.length ? returned.join(', ') : '*'

    const values = Object.entries(value).map(([field, value]) => `"${field}" = '${value}'`).join(`, `)

    try {
      const data = await pool.query(`
      UPDATE public."${tableName}"
      SET ${values}
      WHERE ${conditions}
      RETURNING ${formattedReturned};
    `);
      return data.rows.length > 1 ? data.rows : data.rows[0]
    } catch (e) {
      return ApiError.BadRequest(e.message)
    }
  }

  async delete(tableName, options = {}, returned = []) {
    const { and, or } = options
    let conditions = ''
    const operator = and ? 'and' : or ? 'or' : ''
    if (operator) {
      conditions = Object.entries(options[operator]).map(([field, value]) => `"${field}" = '${value}'`).join(` ${operator.toUpperCase()} `)
    }
    const formattedReturned = returned.length ? returned.join(', ') : '*'

    try {
      const data = await pool.query(`
      DELETE FROM public."${tableName}"
      ${conditions ? `WHERE ${conditions}` : ''}
      RETURNING ${formattedReturned};
    `);
    return data.rows.length > 1 ? data.rows : data.rows[0]
    } catch (e) {
      return ApiError.BadRequest(e.message)
    }
  }

  async query(query) {
    try {
      return await pool.query(query)
    } catch (e) {
      throw new ApiError.BadRequest(e.message)
    }
  }
}

module.exports = new DatabaseMiddleware()


