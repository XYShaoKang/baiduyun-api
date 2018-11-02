import fetch from 'node-fetch'
import { URLSearchParams } from 'url'

const get = ({ url, opt = {}, Cookie = '', redirect }) => {
  const params = new URLSearchParams()
  Object.keys(opt).forEach(key => {
    params.append(key, opt[key])
  })
  return fetch(url + params.toString(), {
    headers: {
      Cookie
    },
    redirect
  }).then(res => ({ res, cookies: res.headers.raw()['set-cookie'] }))
}
const post = ({ url, opt, Cookie }) => {
  const params = new URLSearchParams()
  Object.keys(opt).forEach(key => {
    params.append(key, opt[key])
  })
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie
    },
    body: params
  }).then(res => ({ res, cookies: res.headers.raw()['set-cookie'] }))
}
export { get, post }
