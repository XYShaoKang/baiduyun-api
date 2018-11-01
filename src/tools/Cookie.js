/**
 * Cookie类,管理cookie
 *
 * @export
 * @class Cookie
 */

export default class Cookie {
  constructor() {
    this.data = [] // 保存cookie,格式{key,value}
  }

  /**
   * 添加cookie
   *
   * @param {String} cookie 格式:key=value
   * @memberof Cookie
   */

  add(cookie) {
    const c = this.data.find(d => d.key === cookie.key)
    if (!c) {
      this.data.push(cookie)
    } else {
      c.value = cookie.value
    }
  }

  /**
   * 删除指定cookie
   *
   * @param {String} key 要删除cookie的key
   * @memberof Cookie
   */

  remove(key) {
    this.data = this.data.filter(d => d.key !== key)
  }

  /**
   * 批量更新cookie
   *
   * @param {[String]|String} cookies 格式:key=value || [key=value]
   * @memberof Cookie
   */

  update(cookies) {
    switch (cookies.constructor) {
      case String: {
        const [key, ...value] = cookies.split('=')
        this.add({ key, value: value.join('=') })
        break
      }
      case Array:
        cookies.forEach(c => {
          this.update(c)
        })
        break
      default:
        break
    }
  }

  /**
   * 导出cookie字符串
   *
   * @param {[String]]} arr 需要导出cookie的key数组
   * @returns {String} 返回cookie字符串
   * @memberof Cookie
   */

  getStr(arr) {
    if (arr && arr.constructor === Array) {
      return this.data
        .filter(d => arr.includes(d.key))
        .map(d => `${d.key}=${d.value}`)
        .join(';')
    }
    return this.data.map(d => `${d.key}=${d.value}`).join(';')
  }

  /**
   * 导出所有cookie
   *
   * @returns {[String]} 返回字符串数组
   * @memberof Cookie
   */

  getArray() {
    return this.data.map(d => `${d.key}=${d.value}`)
  }
}
