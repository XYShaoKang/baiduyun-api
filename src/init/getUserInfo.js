import { get } from '../tools/http'

/**
 * 获取百度账户信息
 *
 * @param {Object} params - 参数
 * @param {String} params.Cookie - 包含key为BAIDUID,BDUSS,STOKEN的cookie字符串
 * @returns {Promise<{errno:String,request_id:String,records:[Object]}>} Promise返回包含errno,request_id,records的对象
 */
const getUserInfo = ({ Cookie }) => {
  const url = `https://pan.baidu.com/api/user/getinfo?need_selfinfo=1`
  return get({ url, Cookie })
    .then(({ res }) => res.json())
    .then(body => body)
}
export default getUserInfo
