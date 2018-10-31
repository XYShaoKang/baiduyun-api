import fetch from 'node-fetch'
import { URLSearchParams } from 'url'

const getList = (path, page, { cookie }) => {
  const params = new URLSearchParams()
  const option = {
    dir: path,
    order: 'name',
    desc: 1,
    page,
    num: 1000
  }
  Object.keys(option).forEach(key => {
    const element = option[key]
    params.append(key, element)
  })
  const url = `https://pan.baidu.com/api/list?${params.toString()}`
  return fetch(url, {
    headers: {
      Cookie: cookie.getStr([`BDUSS`, `STOKEN`])
    }
  })
    .then(res => res.json())
    .then(body => body)
}
export default getList
