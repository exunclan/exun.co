import test from 'ava'
import request from 'supertest'
import app from '../../app'
import { after, before } from '../utils'

test.before(before)
test.after.always(after)

test.serial('test /', async t => {
  const res = await request(app)
    .get('/api/v1')
    .send()
  t.is(res.status, 200)
  t.falsy(res.error)
})

test.serial('test 404 on nonsense URL', async t => {
  const res = await request(app)
    .get('/nonsense-url')
    .send()
  t.is(res.status, 404)
  t.truthy(res.error)
})
