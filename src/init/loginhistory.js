import { get } from '../tools/http'
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
  const opt = {
    token,
    tpl: 'netdisk',
    subpro: 'netdisk_web',
    apiver: 'v3',
    tt: new Date().valueOf(),
    gid,
    loginversion: 'v4'
  }
  const url = `https://passport.baidu.com/v2/api/?loginhistory&`
  return get({
    url,
    Cookie,
    opt
  }).then(({ cookies }) => cookies.map(c => c.split(';')[0]).find(c => c.includes('UBI')))
}
export default loginhistory
