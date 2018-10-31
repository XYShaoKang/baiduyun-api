import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { InitException } from '../tools/error'

/**
 * 查询验证码是否输入正确
 *
 * @param {Object} params - 参数
 * @param {String} params.codeString - 参数codeString
 * @param {String} params.token - 参数token
 * @param {String} params.verifycode - 参数verifycode
 * @param {String} params.Cookie - 包含key为BAIDUID和UBI的cookie字符串,格式:'BAIDUID=value;UBI=value'
 * @param {String} params.traceid - 参数traceid
 * @returns {Promise} Promise
 */
const checkvcode = ({ codestring, token, verifycode, Cookie, traceid }) => {
  const params = new URLSearchParams()
  const paramBody = {
    token,
    tpl: 'netdisk',
    subpro: 'netdisk_web',
    apiver: 'v3',
    tt: new Date().valueOf(),
    verifycode,
    loginversion: 'v4',
    codestring,
    traceid
  }

  Object.keys(paramBody).forEach(key => {
    params.append(key, paramBody[key])
  })
  const url = `https://passport.baidu.com/v2/?checkvcode&${params.toString()}`
  return fetch(url, {
    headers: {
      Cookie
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.errInfo.no === '0') {
        console.log('验证成功')
      } else {
        throw new InitException(`验证错误:${json.errInfo.msg}`, Error())
      }
    })
}

export default checkvcode
