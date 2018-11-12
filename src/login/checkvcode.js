import { get } from '../tools/http'

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
  const opt = {
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
  const url = `https://passport.baidu.com/v2/?checkvcode&`
  return get({ url, Cookie, opt })
    .then(({ res }) => res.json())
    .then(
      json => json
      // if (json.errInfo.no === '0') {
      //   console.log('验证成功')
      // } else {
      //   throw new Error('验证码错误')
      // }
    )
}

export default checkvcode
