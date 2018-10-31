import fetch from 'node-fetch'
import { InitException } from '../tools/error'

/**
 * 获取token
 *
 * @param {Object} params - 参数
 * @param {String} params.gid - 必须参数gid
 * @param {String} params.Cookie - 包含key为BAIDUID的cookie字符串,格式:'BAIDUID=value'
 * @returns {Promise<String>} Promise返回token字符串
 */

const getToken = ({ gid, Cookie }) => {
  const url = `https://passport.baidu.com/v2/api/?getapi&tpl=netdisk&subpro=netdisk_web&apiver=v3&tt=${new Date().valueOf()}&class=login&gid=${gid}&loginversion=v4&logintype=basicLogin`
  return fetch(url, {
    headers: {
      Cookie
    }
  })
    .then(res => res.text())
    .then(body => {
      const {
        data: { token }
      } = JSON.parse(body.replace(/'/g, '"'))
      if (!token) {
        throw new InitException('not find token', Error())
      }
      return token
    })
}
export default getToken
