const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
  return obj;
}


module.exports = {
  removeEmpty
}