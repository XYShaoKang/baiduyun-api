import { get } from '../tools/http'

/**
 * 获取重定向地址
 *
 * @param {Object} params - 参数
 * @param {String} params.Cookie - 包含key为`BAIDUID,BDUSS,HISTORY,PTOKEN,SAVEUSERID,STOKEN,UBI`的cookie字符串
 * @returns {Promise<{redirectUrl:String}>} Promise返回redirectUrl字符串
 */
const getRedirectUrl = ({ Cookie }) => {
  const url = `https://passport.baidu.com/v3/login/api/auth/?return_type=5&tpl=netdisk&u=https%3A%2F%2Fpan.baidu.com%2Fdisk%2Fhome`
  return get({ url, Cookie, redirect: 'manual' }).then(({ res }) => ({
    redirectUrl: res.headers.raw().location[0],
  }))
}
export default getRedirectUrl
