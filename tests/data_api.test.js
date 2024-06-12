const { test } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

test('expecting a valid response', async () => {
  await api
    .get('/api/hw')
    .expect(200)
    .expect('Content-Type', /html/)
})

test('expecting a JSON response', async () => {
  await api
    .get('/api/hwinfo')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})