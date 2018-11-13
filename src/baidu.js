import { autobind } from 'core-decorators'
import {
  getGid,
  getdv,
  getBaiduId,
  getToken,
  loginhistory,
  logincheck,
  getRsakey,
  genimage,
  checkvcode,
  // eslint-disable-next-line no-unused-vars
  reggetcodestr,
  getRedirectUrl,
  updateStoken,
  login
} from './login'
import Cookie from './tools/cookie'
import { getList } from './list'
import { getUserInfo } from './userinfo'

/**
 * 检查是否初始化完成的装饰器
 *
 * @param {*} target
 * @param {*} name
 * @param {*} descriptor
 * @returns
 */
function waitForInit(target, name, descriptor) {
  const oldValue = descriptor.value
  const value = function value(...args) {
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (this.isInit) {
          clearInterval(timer)
          resolve()
        }
        if (this.initErr) {
          reject(this.initErr)
        }
      }, 1000)
    }).then(() => oldValue.apply(this, args))
  }
  return { ...descriptor, value }
}

/**
 * Baidu类,包含初始化参数,登陆,
 *
 * @class Baidu
 */

class Baidu {
  // constructor() {
  //   this.init()
  // }

  /**
   * 登陆参数初始化
   *
   * @returns
   * @memberof Baidu
   */

  init = () => {
    this.isInit = false
    this.initErr = null
    this.isLogin = false
    this.cookie = new Cookie()
    this.gid = getGid()
    this.dv = getdv()
    this.tempTime = Date.parse(new Date())
    const { gid, cookie } = this
    return getBaiduId()
      .then(baiduIdCookieStr => {
        cookie.update(baiduIdCookieStr)
        return getToken({ gid, Cookie: cookie.getStr(['BAIDUID']) })
      })
      .then(body => {
        try {
          const {
            data: { token }
          } = JSON.parse(body.replace(/'/g, '"'))
          return token
        } catch (error) {
          throw new Error('解析token错误')
        }
      })
      .then(token => {
        this.token = token
        return token
      })
      .then(token => loginhistory({ gid, token, Cookie: cookie.getStr(['BAIDUID']) }))
      .then(ubiCookieStr => {
        cookie.update(ubiCookieStr)
      })
      .then(() => getRsakey({ token: this.token, gid, Cookie: cookie.getStr(['BAIDUID', 'UBI']) }))
      .then(body => {
        try {
          const { pubkey, key: rsakey, traceid } = JSON.parse(body.replace(/'/g, '"'))
          return { rsakey, pubkey, traceid }
        } catch (error) {
          throw new Error('解析密钥错误')
        }
      })
      .then(({ rsakey, pubkey, traceid }) => {
        this.rsakey = rsakey
        this.pubkey = pubkey
        this.traceid = traceid
        this.isInit = true
      })
      .catch(err => {
        this.initErr = { type: 'initErr', err }
        return err
      })
  }

  errmiddleware = (type, err) => ({ err: { type, err } })

  /**
   * 检查是否需要验证码
   *
   * @param {String} username 登陆密码
   *
   * @memberof Baidu
   */
  @autobind
  @waitForInit
  logincheck(username) {
    this.username = username
    const { token, dv, cookie, traceid } = this
    return logincheck({
      Cookie: cookie.getStr(['BAIDUID', 'UBI']),
      token,
      username,
      dv,
      traceid
    }).then(({ ubi, data, traceid: traceidTemp }) => {
      cookie.update(ubi)
      this.codestring = data.codeString
      this.vcodetype = data.vcodetype
      this.traceid = traceidTemp
      return {
        traceid,
        codestring: data.codeString,
        vcodetype: data.vcodetype
      }
    })
  }

  /**
   * 下载验证码
   *
   * @memberof Baidu
   */
  genimage = () => {
    const { cookie, codestring } = this
    return genimage({ codestring, Cookie: cookie.getStr(['BAIDUID', 'UBI']) }).then(image => ({
      image
    }))
  }

  /**
   * 测试验证码是否正确
   *
   * @memberof Baidu
   */
  checkvcode = verifycode => {
    const { token, cookie, codestring, traceid } = this
    return checkvcode({
      codestring,
      token,
      verifycode,
      traceid,
      Cookie: cookie.getStr(['BAIDUID', 'UBI'])
    }).then(json => {
      if (json.errInfo.no === '0') {
        console.log('验证成功')
      } else {
        throw new Error('验证码错误')
      }
    })
  }

  reggetcodestr = () => {
    const { token, cookie, traceid, vcodetype } = this
    return reggetcodestr({ token, Cookie: cookie.getStr(['BAIDUID', 'UBI']), traceid, vcodetype })
  }
  /**
   * 登陆
   *
   * @param {String} password 登陆密码
   * @param {String} verifycode 验证码
   * @returns {Promise} Promise返回个人信息
   * @memberof Baidu
   */

  login = (password, verifycode = '') => {
    const {
      dv,
      gid,
      username,
      token,
      cookie,
      rsakey,
      pubkey,
      codestring,
      traceid,
      tempTime,
      isInit
    } = this
    return Promise.resolve()
      .then(
        () =>
          new Promise(resolve => {
            const timer = setInterval(() => {
              if (isInit) {
                clearInterval(timer)
                resolve(11000 - (Date.parse(new Date()) - tempTime))
              }
            }, 100)
          })
      )
      .then(
        delayTime =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, delayTime)
          })
      )
      .then(() =>
        login({
          token,
          dv,
          gid,
          username,
          password,
          rsakey,
          pubkey,
          Cookie: cookie.getStr(['BAIDUID', 'UBI']),
          codestring,
          verifycode,
          traceid
        }).then(({ cookie: tempCookie, body }) => {
          const err = body.match(/err_no=([\d]+?)&/)
          if (err && err[1] === '0') {
            console.log('登陆成功')
            cookie.update(tempCookie)
          } else {
            throw new Error(`登陆错误,错误代码:${err[1]}`)
          }
        })
      )
      .then(() =>
        getRedirectUrl({
          Cookie: cookie.getStr([
            'BAIDUID',
            'BDUSS',
            'HISTORY',
            'PTOKEN',
            'SAVEUSERID',
            'STOKEN',
            'UBI'
          ])
        }).then(({ redirectUrl }) =>
          updateStoken({ redirectUrl, Cookie: cookie.getStr(['BAIDUID', 'BDUSS']) }).then(
            STOKEN => {
              cookie.update(STOKEN)
            }
          )
        )
      )
      .then(() => {
        this.isLogin = true
        return true
      })
  }

  /**
   * 获取用户信息
   *
   * @memberof Baidu
   */
  getUserInfo = () =>
    getUserInfo({ Cookie: this.cookie.getStr(['BAIDUID', 'BDUSS', 'STOKEN']) }).then(body => {
      if (body.errno === 0) {
        this.isLogin = true
      } else {
        this.isLogin = false
        // console.log('百度账号未登录')
        throw new Error(`百度账号未登录,无法获取账号信息`)
      }
      return body
    })

  exprotBaidu = () => ({ cookies: this.cookie.getArray() })

  importBaidu = ({ cookies }) => {
    this.cookie.update(cookies)
    return this.getUserInfo()
  }

  /**
   * 获取当前目录下的列表
   *
   * @param {Object} params - 参数
   * @param {String} params.directory - 需要获取的路径
   * @param {Number} params.page - 获取的页数
   * @param {Number} params.num - 获取的数量
   * @returns {Promise<[Object]>} Promise返回文件目录列表
   * @memberof Baidu
   */
  list = ({ directory, page = 1, num = 1000 }) =>
    getList({
      path: directory,
      page,
      Cookie: this.cookie.getStr([`BDUSS`, `STOKEN`]),
      num
    }).then(body => {
      const fileList = body.list
      if (fileList.length < num) {
        return fileList
      }
      return this.list({ directory, page: page + 1 }).then(list => {
        fileList.push(...list)
        return fileList
      })
    })

  // TODO 尝试优化遍历获取过程
  /**
   * 获取目录下的所有列表
   *
   * @param {Object} params - 参数
   * @param {String} params.directory - 需要获取的路径
   * @returns {Promise<[Object]>} Promise返回文件目录列表
   * @memberof Baidu
   */
  allList = async ({ directory }) => {
    const { list } = this
    const thread = 30
    const fileList = await list({ directory })
    let waitObtainDir = fileList.filter(f => f.isdir === 1)
    while (true) {
      waitObtainDir = await waitObtainDir
        .reduce(
          // 将需要获取列表的目录按照线程数分组
          (a, b) => {
            if (a[a.length - 1].length >= thread) {
              a.push([])
            }
            a[a.length - 1].push(b)
            return a
          },
          [[]]
        )
        .reduce(
          // 按照分组用all方法调用list获取列表
          (promise, directorys) =>
            promise.then(values =>
              Promise.all(
                directorys.map(dir =>
                  // console.log('dir', dir)
                  list({ directory: dir.path }).then(v => {
                    // eslint-disable-next-line no-param-reassign
                    dir.children = v
                    return v
                  })
                )
              )
                .then(v => [
                  ...values,
                  ...v.reduce((a, b) => {
                    a.push(...b)
                    return a
                  }, [])
                ])
                .then(v => v.filter(f => f.isdir === 1))
            ),
          Promise.resolve([])
        )
      // 判断是否已经没有需要获取的目录
      if (waitObtainDir.length === 0) {
        break
      }
      console.log(waitObtainDir.length)
    }
    return fileList
  }
}
export default Baidu
