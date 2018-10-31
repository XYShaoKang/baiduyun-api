import fetch from 'node-fetch'
import { InitException } from '../tools/error'

/**
 * 获取包含BdiduId的cookie
 *
 * @returns {Promise<String>} Promise返回包含BdiduId的cookie文本,格式'BAIDUID=value'
 */

const getBaiduId = () =>
  fetch('http://pan.baidu.com/').then(res => {
    const baiduIdCookieStr = res.headers
      .raw()
      ['set-cookie'].map(c => c.split(';')[0])
      .find(c => c.includes('BAIDUID'))
    if (!baiduIdCookieStr) {
      throw new InitException('not find BAIDUID', Error())
    }
    return baiduIdCookieStr
  })
export default getBaiduId
