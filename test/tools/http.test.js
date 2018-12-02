import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { get, post } from '../../src/tools/http'

jest.mock('node-fetch')
const { Response } = jest.requireActual('node-fetch')
it('get', async () => {
  const response = new Response('4')
  response.headers.raw()['set-cookie'] = 'cookie'
  const reqUrl = 'https://www.baidu.com/s?'
  const reqOpt = { wd: 'wd' }
  const cookie = 'BIDUPSID=xxxx'

  fetch.mockImplementation((url, { headers }) => {
    const params = new URLSearchParams()
    Object.keys(reqOpt).forEach(key => {
      params.append(key, reqOpt[key])
    })

    expect(url).toBe(reqUrl + params.toString())
    expect(headers).toEqual({ Cookie: cookie })

    return Promise.resolve(response)
  })

  const body = await get({
    url: reqUrl,
    opt: reqOpt,
    Cookie: cookie,
  }).then(({ res, cookies }) => {
    expect(cookies).toBe('cookie')
    return res.text()
  })
  expect(body).toBe('4')
})

it('post', async () => {
  const response = new Response('4')
  response.headers.raw()['set-cookie'] = 'cookie'
  const reqUrl = 'https://www.baidu.com/api?'
  const reqOpt = { wd: 'wd' }
  const cookie = 'BIDUPSID=xxxx'

  // fetch.mockReturnValue(Promise.resolve(res))
  fetch.mockImplementation((url, { method, headers, body }) => {
    const params = new URLSearchParams()
    Object.keys(reqOpt).forEach(key => {
      params.append(key, reqOpt[key])
    })

    expect(url).toBe(reqUrl)
    expect(method).toBe('POST')
    expect(headers).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookie,
    })
    expect(body.toString()).toBe(params.toString())

    return Promise.resolve(response)
  })

  const body = await post({ url: reqUrl, opt: reqOpt, Cookie: cookie }).then(
    ({ res, cookies }) => {
      expect(cookies).toBe('cookie')
      return res.text()
    },
  )
  expect(body).toBe('4')
})
