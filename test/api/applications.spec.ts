import { mongoose } from '@typegoose/typegoose'
import request from 'supertest'
import app from '../../src/app'

const databaseName = 'testdb'

let userToken = ''
let adminToken = ''

let appId = ''
let userAppId = ''

beforeAll(async () => {
  const url = `mongodb://localhost:27017/${databaseName}`
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

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

async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany({})
  }
}

describe('POST /api/v1/applications', () => {
  it('should return 200 OK', async () => {
    await request(app)
      .post('/api/v1/applications')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: 'Microsoft',
        position: 'AI Engineer',
        submissionLink: 'microsoft.com/ai',
        status: 'applied',
        submissionDate: new Date().toISOString().substr(0, 10)
      })
      .expect(200)
  })
  it('should return 200 OK', async () => {
    await request(app)
      .post('/api/v1/applications')
      .set({ authorization: `Bearer ${userToken}` })
      .send({
        company: 'Google',
        position: 'AI Engineer',
        submissionLink: 'google.com/ai',
        status: 'applied',
        submissionDate: new Date().toISOString().substr(0, 10)
      })
      .expect(200)
  })
  it('should return 400 Bad Request', async () => {
    await request(app)
      .post('/api/v1/applications')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        position: 'AI Engineer',
        submissionLink: 'microsoft.com/ai',
        status: 'applied',
        submissionDate: new Date().toISOString().substr(0, 10)
      })
      .expect(400)
  })
  it('should return 400 Bad Request', async () => {
    await request(app)
      .post('/api/v1/applications')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: 'Microsoft',
        submissionLink: 'microsoft.com/ai',
        status: 'applied',
        submissionDate: new Date().toISOString().substr(0, 10)
      })
      .expect(400)
  })
  it('should return 400 Bad Request', async () => {
    await request(app)
      .post('/api/v1/applications')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: 'Microsoft',
        position: 'AI Engineer',
        status: 'applied',
        submissionDate: new Date().toISOString().substr(0, 10)
      })
      .expect(400)
  })
  it('should return 400 Bad Request', async () => {
    await request(app)
      .post('/api/v1/applications')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: 'Microsoft',
        position: 'AI Engineer',
        submissionLink: 'microsoft.com/ai',
        submissionDate: new Date().toISOString().substr(0, 10)
      })
      .expect(400)
  })
  it('should return 400 Bad Request', async () => {
    await request(app)
      .post('/api/v1/applications')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: 'Microsoft',
        position: 'AI Engineer',
        submissionLink: 'microsoft.com/ai',
        status: 'applied'
      })
      .expect(400)
  })
})

describe('GET /api/v1/applications', () => {
  it('should return 200 OK', async () => {
    const res = await request(app)
      .get('/api/v1/applications')
      .set({ authorization: `Bearer ${adminToken}` })
      .expect(200)
    appId = res.body[0]._id
  })
  it('should return 200 OK', async () => {
    const res = await request(app)
      .get('/api/v1/applications')
      .set({ authorization: `Bearer ${userToken}` })
      .expect(200)
    userAppId = res.body[0]._id
  })
  it('should return 401 Unauthenticated', async () => {
    await request(app)
      .get('/api/v1/applications')
      .expect(401)
  })
})

describe('GET /api/v1/applications/all', () => {
  it('should return 200 OK', async () => {
    await request(app)
      .get('/api/v1/applications/all')
      .set({ authorization: `Bearer ${adminToken}` })
      .expect(200)
  })
  it('should return 401 Unauthenticated', async () => {
    await request(app)
      .get('/api/v1/applications/all')
      .expect(401)
  })
  it('should return 403 Unauthorized', async () => {
    await request(app)
      .get('/api/v1/applications/all')
      .set({ authorization: `Bearer ${userToken}` })
      .expect(403)
  })
})

describe('DELETE /api/v1/applications/:id', () => {
  it('should return 200 OK with adminToken', async () => {
    await request(app)
      .delete(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .expect(200)
  })
  it('should return 401 Unauthenticated', async () => {
    await request(app)
      .delete(`/api/v1/applications/${appId}`)
      .expect(401)
  })
  it('should return 404 Not Found userToken', async () => {
    await request(app)
      .delete(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${userToken}` })
      .expect(404)
  })
  it('should return 404 Not Found adminToken', async () => {
    await request(app)
      .delete(`/api/v1/applications/${userAppId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .expect(404)
  })
  it('should return 404 Not Found', async () => {
    await request(app)
      .delete(`/api/v1/applications/${mongoose.Types.ObjectId()}`)
      .set({ authorization: `Bearer ${userToken}` })
      .expect(404)
  })
})

describe('PUT /api/v1/applications/:id', () => {
  it('should return 200 OK with adminToken', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: 'Test Corporation',
        position: 'Test Engineer',
        submissionLink: 'test.com/QA',
        status: 'applied',
        submissionDate: new Date().toISOString().substr(0, 10)
      })
      .expect(200)
  })
  it('should return 400 bad request, no change', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: 'Test Corporation',
        position: 'Test Engineer',
        submissionLink: 'test.com/QA',
        status: 'applied'
      })
      .expect(400)
  })
  it('should return 200 OK, changed company', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: 'Microsoft 2'
      })
      .expect(200)
  })
  it('should return 200 OK, changed position', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        position: 'AI Engineer 2'
      })
      .expect(200)
  })
  it('should return 200 OK, changed submissionLink', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        submissionLink: 'microsoft.com/ai2'
      })
      .expect(200)
  })
  it('should return 200 OK, changed status', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        status: 'applied 2'
      })
      .expect(200)
  })
  it('should return 200 OK, changed submissionDate', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        submissionDate: new Date().toISOString().substr(0, 10)
      })
      .expect(200)
  })
  it('should return 400 Bad Request, invalid date', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({ submissionDate: 'invalid date' })
      .expect(400)
  })
  it('should return 404 Not Found userToken', async () => {
    await request(app)
      .put(`/api/v1/applications/${appId}`)
      .set({ authorization: `Bearer ${userToken}` })
      .send({ company: 'Bing' })
      .expect(404)
  })
  it('should return 404 Not Found', async () => {
    await request(app)
      .put(`/api/v1/applications/${mongoose.Types.ObjectId()}`)
      .set({ authorization: `Bearer ${userToken}` })
      .send({ company: 'Bing' })
      .expect(404)
  })
})

afterAll(async () => {
  await removeAllCollections()
  await mongoose.disconnect()
})
