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
  // constructor() {
  //   this.init()
  // }

  /**
   * 参数初始化
   *
   * @returns
   * @memberof Baidu
   */

  init() {
    this.isInit = false
    this.cookie = new Cookie()
    this.gid = getGid()
    this.dv = getdv()
    this.tempTime = Date.parse(new Date())
    const { gid, cookie } = this
    return getBaiduId()
      .then(baiduIdCookieStr => {
        cookie.update(baiduIdCookieStr)
        return getToken({ gid, Cookie: cookie.getStr([`BAIDUID`]) })
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

  logincheck(username) {
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

  genimage() {
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

  login(password, verifycode = '') {
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
    this.password = password
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
            `BAIDUID`,
            `BDUSS`,
            `HISTORY`,
            `PTOKEN`,
            `SAVEUSERID`,
            `STOKEN`,
            `UBI`
          ])
        }).then(({ redirectUrl }) =>
          updateStoken({ redirectUrl, Cookie: cookie.getStr([`BAIDUID`, `BDUSS`]) }).then(
            STOKEN => {
              cookie.update(STOKEN)
            }
          )
        )
      )
      .then(() => getUserInfo({ Cookie: cookie.getStr([`BAIDUID`, `BDUSS`, `STOKEN`]) }))
  }

  // TODO 批量获取文件列表
  async list(path) {
    const arr = []
    let page = 1
    while (true) {
      let arrTemp = []

      await getList(path, page, this).then(body => {
        arrTemp = body.list
      })
      arr.push(...arrTemp)

      if (arrTemp.length < 1000) {
        break
      }
      page += 1
    }
    for (const c of arr.filter(a => a.isdir === 1)) {
      c.children = await this.list(c.path)
    }
    return arr
  }
}
export default Baidu
