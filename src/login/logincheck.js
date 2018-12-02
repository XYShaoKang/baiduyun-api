import { get } from '../tools/http'

/**
 * 检查是否需要验证码,更新ubi
 *
 * @param {Object} params - 参数
 * @param {String} params.token - 参数token
 * @param {String} params.username - 用户名
 * @param {String} params.dv - 参数gid
 * @param {String} params.Cookie - 包含key为BAIDUID和UBI的cookie字符串,格式:'BAIDUID=value;UBI=value'
 * @param {String} params.traceid - 参数traceid
 * @returns {Promise<{ubi:String,errInfo:{no:String},data:{codeString:String,vcodetype:String},traceid:String}>} Promise返回Object,包含{ubi,errInfo,data}
 */
const logincheck = ({ token, username, dv, Cookie, traceid }) => {
  let ubi = ''
  const opt = {
    token,
    tpl: 'netdisk',
    subpro: 'netdisk_web',
    apiver: 'v3',
    tt: new Date().valueOf(),
    sub_source: 'leadsetpwd',
    username,
    loginversion: 'v4',
    dv,
    traceid,
  }
  const url = `https://passport.baidu.com/v2/api/?logincheck&`
  return get({
    url,
    Cookie,
    opt,
  })
    .then(({ res, cookies }) => {
      ubi = cookies.map(c => c.split(';')[0]).find(c => c.includes('UBI'))
      return res.json()
    })
    .then(json => ({ ubi, ...json }))
}

export default logincheck
