require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./Router/index')
const errorMiddleware = require('./Middleware/ErrorMiddleware')
const upload = require('./multerConfig')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use('/images', express.static('images'));
app.use(errorMiddleware)

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch (err) {
    console.error(err)
  }
}

start()