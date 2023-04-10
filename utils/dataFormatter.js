const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
  return obj;
}

const jsArrayToPgArray = (array) => {
  return `{ ${array.join(', ')} }`
}

const selectTableFromString = (string) => {
  const [table, ...params] = string.split('.')
  return `public."${table}"${params.length ? `.${params.join('.')}` : ''}`
}

const arrayColumn = (arr, n) => arr.map(x => x[n])

module.exports = {
  removeEmpty,
  jsArrayToPgArray,
  selectTableFromString,
  arrayColumn
}