import env2 from 'env2'
import fetch from 'node-fetch'
import FormData from 'form-data'
import fs, { createReadStream } from 'fs'

if (fs.existsSync('.env')) {
  env2('.env')
}
const opt = {
  username: process.env.VERCODE_USERNAME.replace(/^"|"$/g, ''),
  password: process.env.VERCODE_PASSWORD.replace(/^"|"$/g, ''),
  appid: process.env.VERCODE_APPID.replace(/^"|"$/g, ''),
  appkey: process.env.VERCODE_APPKEY.replace(/^"|"$/g, ''),
  codetype: 5000,
  timeout: 60
}
function result(cid) {
  return fetch(`http://api.yundama.com/api.php?cid=${cid}&method=result`)
    .then(res => res.json())
    .then(json => {
      if (!json) {
        return ''
      }
      if (json.ret !== 0 && json.ret !== -3002) {
        console.log(json)
        return `错误${json.ret}`
      }
      if (json.text === '') {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 100)
        }).then(() => result(cid))
      }
      return json.text
    })
}
export default function upload(filePath) {
  const data = {
    method: 'upload',
    username: opt.username,
    password: opt.password,
    appid: opt.appid,
    appkey: opt.appkey,
    codetype: opt.codetype,
    timeout: opt.timeout,
    file: createReadStream(filePath)
  }
  const form = new FormData()
  Object.keys(data).forEach(key => {
    form.append(key, data[key])
  })
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (!err) {
        resolve(length)
      } else {
        reject(new Error('获取 form 长度错误'))
      }
    })
  }).then(length =>
    fetch('http://api.yundama.com/api.php', {
      method: 'POST',
      body: form,
      headers: {
        'Content-Length': length
      }
    })
      .then(res => res.json())
      .then(({ ret, cid, text }) => {
        if (ret !== 0) {
          throw new Error(ret)
        }
        if (text === '') {
          return result(cid)
        }
        return text
      })
  )
}
