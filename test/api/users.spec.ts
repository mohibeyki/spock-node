import { mongoose } from '@typegoose/typegoose'
import request from 'supertest'
import app from '../../src/app'

const databaseName = 'testdb'
beforeAll(async () => {
  const url = `mongodb://localhost:27017/${databaseName}`
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

let userToken = ''
let adminToken = ''

async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany({})
  }
}

describe('POST /api/v1/users', () => {
  it('should return 200 OK', async () => {
    adminToken = (
      await request(app)
        .post('/api/v1/users')
        .send({
          username: 'admin',
          password: 'adminpassword',
          email: 'admin@test.com'
        })
        .expect(200)
    ).body.token
    userToken = (
      await request(app)
        .post('/api/v1/users')
        .send({
          username: 'user',
          password: 'userpassword',
          email: 'user@test.com'
        })
        .expect(200)
    ).body.token
  })

  it('should return 400, missing username', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        password: 'password',
        email: 'user@test.com'
      })
      .expect(400)
  })

  it('should return 400, missing password', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        username: 'useruser',
        email: 'user@test.com'
      })
      .expect(400)
  })

  it('should return 400, missing email', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        username: 'useruser',
        password: 'password'
      })
      .expect(400)
  })

  it('should return 400, short username', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        username: 'us',
        password: 'password',
        email: 'user@test.com'
      })
      .expect(400)
  })

  it('should return 400, invalid password', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        username: 'user',
        password: 'password',
        email: 'user@.com'
      })
      .expect(400)
  })

  it('should return 400, short password', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        username: 'user',
        password: 'pass',
        email: 'user@test.com'
      })
      .expect(400)
  })

  it('should return 409, duplicate username', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        username: 'user',
        password: 'userpassword',
        email: 'user@test.co.uk'
      })
      .expect(409)
  })

  it('should return 409, duplicate email', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        username: 'useruser',
        password: 'userpassword',
        email: 'user@test.com'
      })
      .expect(409)
  })
})

describe('PUT /api/v1/users', () => {
  it('should return 200 OK', async () => {
    await request(app)
      .put('/api/v1/users')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        password: 'newadminpassword'
      })
      .expect(200)
  })

  it('should return 400 Bad Request', async () => {
    await request(app)
      .put('/api/v1/users')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        password: 'pass'
      })
      .expect(400)
  })

  it('should return 400 Bad Request', async () => {
    await request(app)
      .put('/api/v1/users')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        pass: 'newadminpassword'
      })
      .expect(400)
  })

  it('should return 401 Unauthenticated', async () => {
    await request(app)
      .put('/api/v1/users')
      .send({
        password: 'newadminpassword'
      })
      .expect(401)
  })
})

describe('POST /api/v1/users/login', () => {
  it('should return 200 OK', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'user@test.com', password: 'userpassword' })
      .expect(200)
    expect(res.body.token).toBeTruthy()
  })

  it('should return 400 Bad Request', async () => {
    await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'u', password: 'userpassword' })
      .expect(400)
  })

  it('should return 400 Bad Request, missing password', async () => {
    await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'user' })
      .expect(400)
  })

  it('should return 400 Bad Request, missing email', async () => {
    await request(app)
      .post('/api/v1/users/login')
      .send({ username: 'user', passowrd: 'password' })
      .expect(400)
  })

  it('should return 404 Not Found', async () => {
    await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'username@test.com', password: 'password' })
      .expect(404)
  })
})

describe('GET /api/v1/users', () => {
  it('should return 401 Unauthorized', async () => {
    return await request(app).get('/api/v1/users').expect(401)
  })

  it('should return 403 unauthorized', async () => {
    await request(app)
      .get('/api/v1/users')
      .set({ authorization: `Bearer ${userToken}` })
      .expect(403)
  })

  it('should return 200', async () => {
    await request(app)
      .get('/api/v1/users')
      .set({ authorization: `Bearer ${adminToken}` })
      .expect(200)
  })
})

afterAll(async () => {
  await removeAllCollections()
  await mongoose.disconnect()
})
