require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./Router/index')
const errorMiddleware = require('./Middleware/ErrorMiddleware')

const PORT = process.env.PORT || 5000
const app = express()

const DatabaseMiddleware = require('./Middleware/DatabaseMiddleware');
(async () => {
  // const data =  await DatabaseMiddleware.update('user', {
  //     id: 1,
  //     name: 'Alex',
  //     age: 20
  //   }, {
  //     and: {
  //       id: 1,
  //       age: 10
  //     }
  //   })
  // console.log(data);
})();

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch (err) {
    console.error(err)
  }
}

start()