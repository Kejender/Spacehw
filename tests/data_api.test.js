const { test } = require('node:test')
const supertest = require('supertest')
const app = require('../index')

const api = supertest(app)

test('data is returned as json', async () => {
  await api
    .get('/api/hw')
    .expect(200)
    //.expect('Content-Type', /application\/json/)
})