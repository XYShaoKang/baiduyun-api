import { get } from '../tools/http'

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
  const opt = {
    token,
    tpl: 'netdisk',
    subpro: 'netdisk_web',
    apiver: 'v3',
    tt: new Date().valueOf(),
    gid,
    loginversion: 'v4'
  }
  const url = `https://passport.baidu.com/v2/getpublickey?`
  return get({ url, Cookie, opt })
    .then(({ res }) => res.text())
    .then(body => {
      const { pubkey, key: rsakey, traceid } = JSON.parse(body.replace(/'/g, '"'))
      return { rsakey, pubkey, traceid }
    })
}
export default getRsakey
