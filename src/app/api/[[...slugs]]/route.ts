import { Elysia, t } from 'elysia'
import { nanoid } from 'nanoid'
import { ulid } from 'ulid'

const app = new Elysia({ prefix: '/api' })
  .get('/', () => ({
    routes: ['/id/**'],
  }))

  // Random - /lorem?words=<number> /names /last-names
  // Testing - /delay?<ms|s>2000 /status?code=404
  // Math - //

  .get('/id', () => ({
    routes: [
      '/id/uuid',
      '/id/nanoid?len=21',
      '/id/ulid',
      '/id/random-string?len=16&charset=ABC123',
      '/id/random-int?min=1&max=100000',
      '/id/otp?digits=6',
      '/id/hash?text=xxx',
    ],
  }))
  .get('/id/uuid', () => crypto.randomUUID())
  .get('/id/nanoid', ({ query }) => nanoid(Number(query.len) || 21))
  .get('/id/ulid', () => ulid())
  .get('/id/random-string', ({ query }) => {
    const length = Number(query.len) || 16
    const charset =
      query.charset ||
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++)
      result += charset[Math.floor(Math.random() * charset.length)]
    return result
  })
  .get('/id/random-int', ({ query }) => {
    const min = Number(query.min) || 0
    const max = Number(query.max) || 1000000
    return Math.floor(Math.random() * (max - min + 1)) + min
  })
  .get('/id/otp', ({ query }) => {
    const digits = Number(query.digits) || 6
    let code = ''
    for (let i = 0; i < digits; i++) code += Math.floor(Math.random() * 10)
    return code
  })
  .get('/id/hash', async ({ query }) => {
    const text = query.text || Math.random().toString()
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(text)
    )
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  })

export const GET = app.fetch
export const POST = app.fetch
