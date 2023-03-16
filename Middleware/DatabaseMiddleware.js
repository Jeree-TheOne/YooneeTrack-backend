const ApiError = require('../Exceptions/ApiError')
const pool = require('../pgConfig')

class DatabaseMiddleware {
  async select(table_name, columns = [], options = {where: [], orderby: {columns: [], order: 'ASC'}, limit: null, offset: 0}) {
    const { and, or, orderby, limit, offset } = options
    const formattedColumns = columns.length ? columns.join(', ') : '*'
    const formattedOrderBy = orderby?.columns?.length ? `ORDER BY ${orderby.columns.join(', ')} ${orderby.order}` : ''
    let conditions = ''
    const operator = and ? 'and' : or ? 'or' : ''
    if (operator) {
      conditions +=  Object.entries(options[operator]).map(([field, value]) => `${field} = '${value}'`).join(` ${operator.toUpperCase()} `)
    }
    try {
      const data = await pool.query(`
        SELECT ${formattedColumns} from public."${table_name}"
        ${conditions ? `WHERE ${conditions}` : ''}
        ${formattedOrderBy}
        ${limit != undefined ? `LIMIT ${limit} ` : ''} ${offset != undefined || limit ? `OFFSET ${offset || 0} ` : ''}
      `) 

      return data.rows.length > 1 ? data.rows : data.rows[0]
    } catch (e) {
      return ApiError.BadRequest(e.message)
    }
  }

  async insert(table_name, value = {}) {
    try {
      const data = await pool.query(`
      INSERT INTO public."${table_name}" (${Object.keys(value)})
      VALUES (${Object.values(value).map(el => `'${el}'`)})
      RETURNING *;
    `)

      return data.rows.length > 1 ? data.rows : data.rows[0]
    } catch (e) {
      return ApiError.BadRequest(e.message)
    }
  }

  async update(table_name, value = {}, options = {}) {
    const { and, or } = options
    let conditions = ''
    const operator = and ? 'and' : or ? 'or' : ''
    if (operator) {
      conditions =  Object.entries(options[operator]).map(([field, value]) => `${field} = '${value}'`).join(` ${operator.toUpperCase()} `)
    }

    const values = Object.entries(value).map(([field, value]) => `${field} = '${value}'`).join(`, `)

    try {
      const data = await pool.query(`
      UPDATE public."${table_name}"
      SET ${values}
      WHERE ${conditions}
      RETURNING *;
    `);
      return data.rows.length > 1 ? data.rows : data.rows[0]
    } catch (e) {
      return ApiError.BadRequest(e.message)
    }
  }

  async delete(table_name, options = {}) {
    const { and, or } = options
    let conditions = ''
    const operator = and ? 'and' : or ? 'or' : ''
    if (operator) {
      conditions =  Object.entries(options[operator]).map(([field, value]) => `${field} = '${value}'`).join(` ${operator.toUpperCase()} `)
    }

    try {
      const data = await pool.query(`
      DELETE FROM public."${table_name}"
      ${conditions ? `WHERE ${conditions}` : ''}
      RETURNING *;
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


