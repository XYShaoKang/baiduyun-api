import env2 from 'env2'
import fetch from 'node-fetch'
import FormData from 'form-data'
import fs, { createReadStream } from 'fs'
import { join } from 'path'

if (fs.existsSync('.env')) {
  env2('.env')
}

export default imagePath => {
  const opt = {
    key: process.env.VERCODEAPPKEY.replace(/^"|"$/g, ''),
    codeType: 5006,
    dtype: 'json',
    image: createReadStream(imagePath)
  }
  const form = new FormData()
  Object.keys(opt).forEach(key => {
    form.append(key, opt[key])
  })
  return fetch('http://op.juhe.cn/vercode/index', {
    method: 'POST',
    body: form
  }).then(res => res.json())
}
