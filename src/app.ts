import bluebird from 'bluebird'
import bodyParser from 'body-parser'
import compression from 'compression' // compresses requests
import cors from 'cors'
import express, { ErrorRequestHandler } from 'express'
import jwt from 'express-jwt'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { HttpError } from './errors/http'
import { apiV1Router } from './routes/api-v1-router'
import { JWT_SECRET, MONGODB_URI } from './util/secrets'

const app = express()

const mongoUrl = MONGODB_URI
mongoose.Promise = bluebird

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then()

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return err.respond(res)
  }
  if (err.status && err.message) {
    return res
      .status(err.status)
      .json({ status: err.status, message: err.message })
  }
  res.status(500).json({ message: 'Internal Server Error' })
}

app.set('port', process.env.PORT)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('short'))
app.use(
  jwt({ secret: JWT_SECRET, algorithms: ['HS256'] }).unless({
    path: [
      { url: '/api/v1', methods: ['GET'] },
      { url: '/api/v1/ise', methods: ['GET'] },
      { url: '/api/v1/users', methods: ['POST'] },
      {
        url: '/api/v1/users/login',
        methods: ['POST']
      }
    ]
  })
)
app.use('/api/v1', apiV1Router)
app.use(errorHandler)

export default app
