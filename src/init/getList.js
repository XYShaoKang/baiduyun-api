import fetch from 'node-fetch'
import { URLSearchParams } from 'url'

const getList = ({ path, page, Cookie, num = 1000 }) => {
  const params = new URLSearchParams()
  const option = {
    dir: path,
    order: 'name',
    desc: 1,
    page,
    num
  }
  Object.keys(option).forEach(key => {
    const element = option[key]
    params.append(key, element)
  })
  const url = `https://pan.baidu.com/api/list?${params.toString()}`
  return fetch(url, {
    headers: {
      Cookie
    }
  })
    .then(res => res.json())
    .then(body => {
      if (body.errno === 31034) {
        console.log(31034, path)
        return getList({ path, page, Cookie, num })
      }
      return body
    })
    .catch(err => {
      if (err.errno === 'ETIMEDOUT') {
        console.log('ETIMEDOUT', path)
        return getList({ path, page, Cookie, num })
      }
      console.log('err', err)
      return err
    })
}

export default getList
