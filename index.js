require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const router = require('./Router/index')
const errorMiddleware = require('./Middleware/ErrorMiddleware')

const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};


const PORT = process.env.PORT || 5000
const app = express()

app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); 
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/api', router)
app.use('/storage/avatars', express.static('storage/avatars'));
app.use('/storage/files', express.static('storage/files'));
app.use(errorMiddleware)

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch (err) {
    console.error(err)
  }
}

start()