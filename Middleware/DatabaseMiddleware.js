const ApiError = require('../Exceptions/ApiError')
const pool = require('../pgConfig')
const { selectTableFromString } = require('../utils/dataFormatter')

class DatabaseMiddleware {
  async select(tableName, columns = [], options, join = null) {
    const { where, orderby, limit, offset } = options
    const formattedColumns = !columns.length ? '*' : join ? columns.map(e => `${selectTableFromString(e)}`).join(', ') : columns.join(', ')
    const formattedOrderBy = orderby ? `ORDER BY ${Object.entries(orderby).map(([field, value]) => `${field} ${value}`).join(', ')}` : ''
    let conditions = ''
    const operator =  Object.keys(where)[0]
    if (operator) {
      switch (operator) {
        case 'not': {
          const field = Object.keys(where[operator])[0]
          conditions += `${field} NOT IN (${where[operator][field].map(e => `'${e}'`).join(',')})`
          break
        }
        case 'in': {
          const field = Object.keys(where[operator])[0]
          conditions += `${field} IN (${where[operator][field].map(e => `'${e}'`).join(',')})`
          break
        }
        default: {
          conditions += Object.entries(where[operator]).map(([field, value]) => `${join ? selectTableFromString(field) : `${field}`} = '${value}'`).join(` ${operator.toUpperCase()} `)
          break
        }
      }
    }
    const formattedJoin = join ? Object.entries(join).map(([table, on]) => `${on[2] ? `${on[2]}` : 'INNER'} JOIN ${selectTableFromString(table)} ON ${selectTableFromString(`${table}.${on[0]}`)} = ${selectTableFromString(on[1])}`).join('\n') : '';
    try {
      const data = await pool.query(`
      SELECT ${formattedColumns} FROM ${selectTableFromString(tableName)}
      ${formattedJoin}
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
      const data = await pool.query(query)
      return data.rows.length > 1 ? data.rows : data.rows[0]
    } catch (e) {
      throw new ApiError.BadRequest(e.message)
    }
  }
}

module.exports = new DatabaseMiddleware()


