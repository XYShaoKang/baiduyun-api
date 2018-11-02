import { get } from '../tools/http'

/**
 * 下载验证码图像
 *
 * @param {Object} params - 参数
 * @param {String} params.codeString - 参数codeString
 * @param {String} params.Cookie - 包含key为BAIDUID和UBI的cookie字符串,格式:'BAIDUID=value;UBI=value'
 * @returns {Promise} Promise
 */
const genimage = ({ codestring, Cookie }) => {
  const url = `https://passport.baidu.com/cgi-bin/genimage?${codestring}`
  return get({ url, Cookie }).then(({ res }) => res.body)
}

export default genimage
