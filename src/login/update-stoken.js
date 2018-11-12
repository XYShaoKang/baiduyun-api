import { get } from '../tools/http'

/**
 * 更新登陆cookie
 *
 * @param {Object} params - 参数
 * @param {String} params.redirectUrl - 参数redirectUrl
 * @param {String} params.Cookie - 包含key为BAIDUID,BDUSS的cookie字符串
 * @returns {Promise<String>} Promise返回key为STOKEN的cookie字符串
 */
const updateStoken = ({ redirectUrl, Cookie }) =>
  get({ url: redirectUrl, Cookie, redirect: 'manual' }).then(({ cookies }) =>
    cookies.map(c => c.split(';')[0]).find(c => c.includes('STOKEN'))
  )

export default updateStoken
