import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { InitException } from '../tools/error'
/**
 * 获取ubi
 *
 * @param {Object} params - 参数
 * @param {String} params.token - 必须参数token
 * @param {String} params.gid - 必须参数gid
 * @param {String} params.Cookie - 包含key为BAIDUID的cookie字符串,格式:'BAIDUID=value'
 * @returns {Promise<String>} Promise返回包含UBI的cookie文本,格式'UBI=value'
 */

const loginhistory = ({ token, gid, Cookie }) => {
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
  const url = `https://passport.baidu.com/v2/api/?loginhistory&${params.toString()}`
  return fetch(url, {
    headers: {
      Cookie
    }
  }).then(res => {
    const ubi = res.headers
      .raw()
      ['set-cookie'].map(c => c.split(';')[0])
      .find(c => c.includes('UBI'))
    if (!ubi) {
      throw new InitException('not find ubi', Error())
    }
    return ubi
  })
}
export default loginhistory
