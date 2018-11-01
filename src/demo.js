import readline from 'readline'
import fs from 'fs'
import path from 'path'
import Baidu from './Baidu'

const baidu = new Baidu()

const jsonPath = path.join(__dirname, '../', `./cache/baidu.json`)
let promises = Promise.resolve()
if (fs.existsSync(jsonPath)) {
  promises = promises.then(() => {
    const baiduJson = fs.readFileSync(jsonPath)
    baidu.importBaidu(JSON.parse(baiduJson))
    // baidu = JSON.parse(baiduJson)
  })
} else {
  const { init, logincheck, genimage, login, getUserInfo } = baidu
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
        return genimage().then(
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
      }
      return ''
    })
    .then(
      verifycode =>
        new Promise(resolve => {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })
          rl.question('请输入密码: ', password => {
            rl.close()
            resolve({ verifycode, password })
          })
        })
    )
    .then(({ verifycode, password }) => login(password, verifycode))
    .then(() => getUserInfo())
    .then(userinfo => console.log(`用户 ${userinfo.records[0].uname} 登陆成功`))
    .then(() => {
      fs.writeFileSync(jsonPath, JSON.stringify(baidu.exprotBaidu()))
      // console.log(JSON.stringify(baidu))
      // console.log(JSON.parse(JSON.stringify(baidu)).cookie.data)
    })
}
function getListLength(list) {
  return list.length + list.reduce((a, b) => a + (b.isdir === 1 ? getListLength(b.children) : 0), 0)
}
promises
  .then(async () => {
    const list = await baidu.allList({ directory: '/嵌入式资源' })

    fs.writeFileSync(path.join(__dirname, '../', `./cache/list.json`), JSON.stringify(list))
    console.log(getListLength(list))
    console.log('获取完成')
  })
  // .then(console.log)
  .catch(err => console.log(err))
