import NodeRSA from 'node-rsa'
import { post } from '../tools/http'

/**
 * 用公钥加密密码
 *
 * @param {String} password
 * @param {String} pubkey
 * @returns {String} 返回加密后的密码
 */
function rsaEncrypt(password, pubkey) {
  const clientKey = new NodeRSA(pubkey, {
    encryptionScheme: 'pkcs1',
  })
  return clientKey.encrypt(password, 'base64')
}
function getPpuiLogintime() {
  const inc = Math.random() * 6534
  return parseInt(inc, 10) + 52000
}

/**
 * 登陆百度
 *
 * @param {Object} params - 参数
 * @param {String} params.token - 参数token
 * @param {String} params.dv - dv
 * @param {String} params.gid - gid
 * @param {String} params.username - 用户名
 * @param {String} params.password - 密码
 * @param {String} params.rsakey - 私钥
 * @param {String} params.pubkey - 公钥
 * @param {String} params.Cookie - 包含key为BAIDUID和UBI的cookie字符串,格式:'BAIDUID=value;UBI=value'
 * @returns {Promise<{rsakey:String,pubkey:String}>} Promise返回包含rsakey,pubkey的对象
 */
const login = (
  {
    token,
    dv,
    gid,
    username,
    password,
    rsakey,
    pubkey,
    Cookie,
    codestring,
    verifycode,
    traceid,
  },
  delayTime = 0
) => {
  let tempCookie = []
  const opt = {
    staticpage: 'https://pan.baidu.com/res/static/thirdparty/pass_v3_jump.html',
    charset: 'UTF-8',
    token,
    tpl: 'netdisk',
    subpro: 'netdisk_web',
    apiver: 'v3',
    tt: new Date().valueOf(),
    codestring,
    safeflg: 0,
    u: 'https://pan.baidu.com/disk/home',
    isPhone: '',
    quick_user: 0,
    logintype: 'basicLogin',
    logLoginType: 'pc_loginBasic',
    idc: '',
    loginmerge: true,
    verifycode, // 验证码,
    gid,
    mem_pass: 'on',
    ppui_logintime: getPpuiLogintime(),
    username,
    password: rsaEncrypt(password, pubkey),
    rsakey,
    dv,
    crypttype: '12',
    traceid,
  }
  return Promise.resolve()
    .then(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, delayTime)
        })
    )
    .then(() =>
      post({
        url: 'https://passport.baidu.com/v2/api/?login',
        Cookie,
        opt,
      })
    )
    .then(({ res, cookies }) => {
      tempCookie = cookies ? cookies.map(c => c.split(';')[0]) : []
      return res.text()
    })
    .then(
      body => ({ cookie: tempCookie, body })
      // const err = body.match(/err_no=([\d]+?)&/)
      // if (err && err[1] === '0') {
      //   console.log('登陆成功')
      //   return { cookie: tempCookie }
      // }
      // throw new Error(`登陆错误,错误代码:${err[1]}`)
    )
}
export default login
