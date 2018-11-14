import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { Writable } from 'stream'
import appRoot from 'app-root-path'
import { baidu } from '../src'

// const baidu = new Baidu()
// const root = path.join(path.dirname(require.main.filename), '../')
const { path: root } = appRoot
const cache = path.join(root, './examples/demo-cache')
if (!fs.existsSync(cache)) {
  fs.mkdirSync(cache)
}

const jsonPath = path.join(cache, `./baidu.json`)

let promises = Promise.resolve()
if (fs.existsSync(jsonPath)) {
  promises = promises.then(() => {
    const baiduJson = fs.readFileSync(jsonPath)
    baidu.importBaidu(JSON.parse(baiduJson))
    // baidu = JSON.parse(baiduJson)
  })
} else {
  const { init, logincheck, genimage, login, getUserInfo, checkvcode } = baidu
  promises = promises
    .then(() => init())
    .then(
      () =>
        new Promise(resolve => {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })
          rl.question('请输入用户名: ', username => {
            rl.close()
            resolve(username)
          })
        })
    )
    .then(username => logincheck(username))
    .then(({ codestring }) => {
      if (codestring !== '') {
        return genimage()
          .then(
            ({ image }) =>
              new Promise(resolve => {
                const imgPath = path.join(cache, './test.png')
                image.pipe(fs.createWriteStream(imgPath)).on('close', () => {
                  console.log(`验证码下载完毕,打开: ${imgPath} 查看验证码`)
                  resolve(imgPath)
                })
              })
          )
          .then(
            () =>
              new Promise(resolve => {
                const rl = readline.createInterface({
                  input: process.stdin,
                  output: process.stdout
                })
                rl.question('请输入验证码: ', verifycode => {
                  rl.close()
                  resolve(verifycode)
                })
              })
          )
          .then(verifycode => checkvcode(verifycode).then(() => verifycode))
      }
      return ''
    })
    .then(
      verifycode =>
        new Promise(resolve => {
          const mutableStdout = new Writable({
            write(chunk, encoding, callback) {
              if (!this.muted) process.stdout.write(chunk, encoding)
              callback()
            }
          })
          mutableStdout.muted = false
          const rl = readline.createInterface({
            input: process.stdin,
            output: mutableStdout,
            terminal: true
          })
          rl.question('请输入密码: ', password => {
            rl.close()
            console.log('\n')
            resolve({ verifycode, password })
          })
          mutableStdout.muted = true
        })
    )
    .then(({ password, verifycode }) => login(password, verifycode))
    .then(console.log)
  // .then(() => getUserInfo())
  // .then(userinfo => console.log(`用户 ${userinfo.records[0].uname} 登陆成功`))
  // .then(() => {
  //   fs.writeFileSync(jsonPath, JSON.stringify(baidu.exprotBaidu()))
  //   // console.log(JSON.stringify(baidu))
  //   // console.log(JSON.parse(JSON.stringify(baidu)).cookie.data)
  // })
}

promises
  // .then(async () => {
  //   // console.log((await baidu.list({directory: '/'})).map(d=>d.path))
  //   const list = await baidu.allList({ directory: '/' })

  //   fs.writeFileSync(path.join(cache, `./list.json`), JSON.stringify(list))
  //   console.log(getListLength(list))
  //   console.log(getDirLength(list))
  //   console.log('获取完成')
  // })
  // .then(console.log)
  .catch(err => console.log('err1', err))

/**
 * 获取文件目录数量
 *
 * @param {*} list
 * @returns
 */
function getListLength(list) {
  return (
    list.length +
    list
      .filter(d => d.isdir === 1)
      .reduce((a, b) => a + (b.children ? getListLength(b.children) : 0), 0)
  )
}
/**
 * 获取文件数量
 *
 * @param {*} list
 * @returns
 */
function getDirLength(list) {
  const dirs = list.filter(d => d.isdir === 1)

  return dirs.length + dirs.reduce((a, b) => a + (b.children ? getDirLength(b.children) : 0), 0)
}
