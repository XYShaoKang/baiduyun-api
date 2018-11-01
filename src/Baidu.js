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
  getUserInfo,
  getList
} from './init'
import Cookie from './tools/Cookie'
import login from './login'

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
   * @param {*} username 登陆用户名
   * @param {*} password 登陆密码
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

  // TODO 批量获取文件列表
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

  allList = ({ directory }) => {
    const { list, allList } = this
    const thread = 20
    return list({ directory }).then(fileList =>
      fileList
        .filter(f => f.isdir === 1)
        .reduce(
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
          (promise, directorys) =>
            promise.then(values =>
              Promise.all(
                directorys.map(dir =>
                  allList({ directory: dir.path }).then(v => ({
                    ...dir,
                    children: v
                  }))
                )
              ).then(v => [...values, ...v])
            ),
          // promise.then(values =>
          //   allList({ directory: dir.path })
          //     .then(v => ({
          //       ...dir,
          //       children: v
          //     }))
          //     .then(v => [...values, v])
          // )
          Promise.resolve([])
        )
        .then(values => [...values, ...fileList.filter(f => f.isdir !== 1)])
    )
  }
}
export default Baidu
