import { get } from '../tools/http'

/**
 * 重新获取验证码图像
 *
 * @param {Object} params - 参数
 * @param {String} params.token - 参数token
 * @param {String} params.traceid - 参数traceid
 * @param {String} params.vcodetype - 参数vcodetype
 * @param {String} params.Cookie - 包含key为BAIDUID和UBI的cookie字符串,格式:'BAIDUID=value;UBI=value'
 * @returns {Promise<errInfo:{no:String},data:{codeString:String,vcodetype:String},traceid:String>} Promise返回包含获取验证码图像需要的参数
 */
const reggetcodestr = ({ token, Cookie, traceid, vcodetype }) => {
  const opt = {
    token,
    tpl: 'netdisk',
    subpro: 'netdisk_web',
    apiver: 'v3',
    tt: new Date().valueOf(),
    fr: 'login',
    sub_source: 'leadsetpwd',
    loginversion: 'v4',
    traceid,
    vcodetype,
  }
  const url = `https://passport.baidu.com/v2/?reggetcodestr&$`
  return get({ url, Cookie, opt })
    .then(({ res }) => res.json())
    .then(json => ({ ...json }))
}

export default reggetcodestr
