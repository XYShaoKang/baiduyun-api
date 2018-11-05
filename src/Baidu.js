import fs from 'fs'
import path from 'path'
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
  reggetcodestr,
  getRedirectUrl,
  updateStoken,
  login
} from './login'
import Cookie from './tools/Cookie'
import { getList } from './list'
import { getUserInfo } from './userinfo'

/**
 * Baidu类,包含初始化参数,登陆,
 *
 * @class Baidu
 */

class Baidu {
  constructor() {
    this.cookie = new Cookie()
  }

  /**
   * 登陆参数初始化
   *
   * @returns
   * @memberof Baidu
   */

  init = () => {
    this.isInit = false
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
      .then(token => {
        this.token = token
        return token
      })
      .then(token => loginhistory({ gid, token, Cookie: cookie.getStr(['BAIDUID']) }))
      .then(ubiCookieStr => {
        cookie.update(ubiCookieStr)
      })
      .then(() => getRsakey({ token: this.token, gid, Cookie: cookie.getStr(['BAIDUID', 'UBI']) }))
      .then(({ rsakey, pubkey, traceid }) => {
        this.rsakey = rsakey
        this.pubkey = pubkey
        this.traceid = traceid
        this.isInit = true
      })
  }

  /**
   * 检查是否需要验证码
   *
   * @param {String} username 登陆密码
   *
   * @memberof Baidu
   */
  logincheck = username => {
    const { token, dv, cookie, traceid } = this
    this.username = username
    return logincheck({
      Cookie: cookie.getStr(['BAIDUID', 'UBI']),
      token,
      username,
      dv,
      traceid
    }).then(({ ubi, data }) => {
      cookie.update(ubi)
      this.codestring = data.codeString
      this.vcodetype = data.vcodetype
      this.traceid = traceid
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
    return genimage({ codestring, Cookie: cookie.getStr(['BAIDUID', 'UBI']) }).then(
      image =>
        new Promise(resolve => {
          const imgPath = path.join(__dirname, '../', './cache/test.png')
          image.pipe(fs.createWriteStream(imgPath)).on('close', () => {
            console.log(`验证码下载完毕,打开: ${imgPath} 查看验证码`)
            resolve()
          })
        })
    )
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
    // this.password = password
    const promis = Promise.resolve(1)
    if (codestring !== '') {
      promis.then(() =>
        checkvcode({
          codestring,
          token,
          verifycode,
          traceid,
          Cookie: cookie.getStr(['BAIDUID', 'UBI'])
        })
      )
    }
    return promis
      .then(
        () =>
          new Promise(resolve => {
            const timer = setInterval(() => {
              if (isInit) {
                clearInterval(timer)
                resolve(10000 - (Date.parse(new Date()) - tempTime))
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
        }).then(({ cookie: tempCookie }) => {
          cookie.update(tempCookie)
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
        console.log('百度账号未登录')
        this.isLogin = false
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
