import { get } from '../tools/http'

/**
 * 获取包含BdiduId的cookie
 *
 * @returns {Promise<String>} Promise返回包含BdiduId的cookie文本,格式'BAIDUID=value'
 */

const getBaiduId = () =>
  get({ url: 'http://pan.baidu.com/' }).then(({ cookies }) =>
    cookies.map(c => c.split(';')[0]).find(c => c.includes('BAIDUID'))
  )
export default getBaiduId
