import readline from 'readline'
import Baidu from './Baidu'

const baidu = new Baidu()

baidu
  .init()
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
  .then(username => baidu.logincheck(username))
  .then(({ codestring }) => {
    if (codestring !== '') {
      return baidu.genimage().then(
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
  .then(({ verifycode, password }) => baidu.login(password, verifycode))
  .then(userinfo => console.log(`用户 ${userinfo.records[0].uname} 登陆成功`))
  .catch(err => console.log(err))
