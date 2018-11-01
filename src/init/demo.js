import readline from 'readline'
import fs from 'fs'
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
} from './index'
import Cookie from '../tools/Cookie'
import login from '../login'

const gid = getGid()
const dv = getdv()
const username = ''
const password = ''
getBaiduId()
  .then(baiduIdCookieStr => {
    const cookie = new Cookie()
    cookie.update(baiduIdCookieStr)
    return getToken({ gid, Cookie: cookie.getStr([`BAIDUID`]) }).then(token => ({
      gid,
      cookie,
      token
    }))
  })
  .then(({ cookie, token }) =>
    loginhistory({ gid, token, Cookie: cookie.getStr(['BAIDUID']) }).then(ubiCookieStr => {
      cookie.update(ubiCookieStr)
      return {
        cookie,
        token
      }
    })
  )
  .then(({ token, cookie }) =>
    getRsakey({ token, gid, Cookie: cookie.getStr(['BAIDUID', 'UBI']) }).then(
      ({ rsakey, pubkey, traceid }) => ({
        token,
        cookie,
        rsakey,
        pubkey,
        traceid
      })
    )
  )
  .then(({ token, cookie, rsakey, pubkey, traceid }) =>
    logincheck({
      Cookie: cookie.getStr(['BAIDUID', 'UBI']),
      token,
      username,
      dv,
      traceid
    }).then(({ ubi, data }) => {
      cookie.update(ubi)
      return {
        token,
        cookie,
        rsakey,
        pubkey,
        traceid,
        codestring: data.codeString,
        vcodetype: data.vcodetype
      }
    })
  )
  .then(({ token, cookie, rsakey, pubkey, codestring, traceid, vcodetype }) => {
    if (codestring !== '') {
      return (
        genimage({ codestring, Cookie: cookie.getStr(['BAIDUID', 'UBI']) })
          .then(
            image =>
              new Promise(resolve => {
                const rl = readline.createInterface({
                  input: process.stdin,
                  output: process.stdout
                })
                image.body.pipe(fs.createWriteStream('./cache/test.png')).on('close', () => {
                  console.log('image downloaded')
                  rl.question('请输入验证码: ', verifycode => {
                    rl.close()
                    resolve({ verifycode })
                  })
                })
              })
          )
          // .then(() =>
          //   reggetcodestr({
          //     token,
          //     Cookie: cookie.getStr(['BAIDUID', 'UBI']),
          //     traceid,
          //     vcodetype
          //   }).then(({ data }) =>
          //     genimage({
          //       codestring: data.verifyStr,
          //       Cookie: cookie.getStr(['BAIDUID', 'UBI'])
          //     }).then(
          //       () =>
          //         new Promise(resolve => {
          //           const rl = readline.createInterface({
          //             input: process.stdin,
          //             output: process.stdout
          //           })
          //           rl.question('请输入验证码: ', verifycode => {
          //             rl.close()
          //             resolve({ verifycode, codestring: data.verifyStr })
          //           })
          //         })
          //     )
          //   )
          // )
          .then((
            { verifycode } // , codestring
          ) =>
            checkvcode({
              codestring,
              token,
              verifycode,
              traceid,
              Cookie: cookie.getStr(['BAIDUID', 'UBI'])
            }).then(() => ({
              token,
              cookie,
              rsakey,
              pubkey,
              codestring,
              verifycode,
              traceid
            }))
          )
      )
    }
    return {
      token,
      cookie,
      rsakey,
      pubkey,
      codestring,
      traceid,
      verifycode: ''
    }
  })
  .then(
    ({ token, cookie, rsakey, pubkey, codestring, verifycode, traceid }) =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            token,
            cookie,
            rsakey,
            pubkey,
            codestring,
            verifycode,
            traceid
          })
        }, 10000)
      })
  )
  .then(({ token, cookie, rsakey, pubkey, codestring, verifycode, traceid }) =>
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
      return { cookie }
    })
  )
  .then(({ cookie }) =>
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
      updateStoken({ redirectUrl, Cookie: cookie.getStr([`BAIDUID`, `BDUSS`]) }).then(STOKEN => {
        cookie.update(STOKEN)
        return { cookie }
      })
    )
  )
  // .then(({ cookie }) => getUserInfo({ Cookie: cookie.getStr([`BAIDUID`, `BDUSS`, `STOKEN`]) }))
  .then(({ cookie }) => getList('/', 1, { Cookie: cookie.getStr([`BDUSS`, `STOKEN`]) }))
  .then(console.log)
  .catch(err => {
    console.log('err2', err)
  })
