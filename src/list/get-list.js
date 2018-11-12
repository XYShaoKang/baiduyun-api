import { get } from '../tools/http'

const getList = ({ path, page, Cookie, num = 1000 }) => {
  const opt = {
    dir: path,
    order: 'name',
    desc: 1,
    page,
    num
  }
  const url = `https://pan.baidu.com/api/list?`
  return get({ url, Cookie, opt })
    .then(({ res }) => res.json())
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
