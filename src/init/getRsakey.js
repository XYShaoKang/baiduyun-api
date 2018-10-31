import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { InitException } from '../tools/error'

/**
 * 获取公钥和密钥
 *
 * @param {Object} params - 参数
 * @param {String} params.token - 参数token
 * @param {String} params.gid - gid
 * @param {String} params.Cookie - 包含key为BAIDUID和UBI的cookie字符串,格式:'BAIDUID=value;UBI=value'
 * @returns {Promise<{rsakey:String,pubkey:String}>} Promise返回包含rsakey,pubkey的对象
 */
const getRsakey = ({ token, gid, Cookie }) => {
  const params = new URLSearchParams()
  const paramBody = {
    token,
    tpl: 'netdisk',
    subpro: 'netdisk_web',
    apiver: 'v3',
    tt: new Date().valueOf(),
    gid,
    loginversion: 'v4'
  }
  Object.keys(paramBody).forEach(key => {
    params.append(key, paramBody[key])
  })
  const url = `https://passport.baidu.com/v2/getpublickey?${params.toString()}`
  return fetch(url, {
    headers: {
      Cookie,
      Referer: 'https://pan.baidu.com/'
    }
  })
    .then(res => res.text())
    .then(body => {
      // const json = JSON.parse(body.replace(/'/g, '"'))
      //   const rsakey = json.key
      const { pubkey, key: rsakey, traceid } = JSON.parse(body.replace(/'/g, '"'))
      if (!pubkey || !rsakey) {
        throw new InitException('not find pubkey or rsakey', Error())
      }
      return { rsakey, pubkey, traceid }
    })
}
export default getRsakey
