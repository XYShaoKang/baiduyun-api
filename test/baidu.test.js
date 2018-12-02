import fs from 'fs'
import path from 'path'
import Baidu from '../src/baidu'

const loginInfo = {
  username: 'admin',
  password: 'admin',
}
// eslint-disable-next-line global-require
jest.mock('../src/login', () => require('./__mocks__/login'))
// eslint-disable-next-line global-require
jest.mock('../src/list', () => require('./__mocks__/list'))
// eslint-disable-next-line global-require
jest.mock('../src/userinfo', () => require('./__mocks__/userinfo'))
jest.setTimeout(30000)
describe('初始化测试', () => {
  const baidu = new Baidu()
  beforeAll(async () => {
    await baidu.init()
  })
  it('test getGid', () => {
    // 1602D74-9046-4303-A8EA-128DA1E7C1A2
    expect(baidu.gid).toMatch(/^\w{7}-\w{4}-\w{4}-\w{4}-\w{12}$/)
  })
  it('test getdv', () => {
    // tk0.xxxxxxxxxxxxxxxxxxxxxxxxxxx
    expect(baidu.dv).toMatch(/^tk0\./)
  })
  it('test getBaiduId', async () => {
    // BAIDUID=F108291755F8AC6FDBBC8F533C309DBF:FG=1
    expect(baidu.cookie.getStr('BAIDUID')).toMatch(/^BAIDUID=\w*?:FG=1$/)
  })
  it('test token', () => {
    // c0327d77d9de85804d2c926a98b763dc
    expect(baidu.token).toMatch(/^\w{32}$/)
  })
  it('test pubkey', () => {
    /*
    -----BEGIN PUBLIC KEY-----
    ...
    -----END PUBLIC KEY-----
    */
    const regStr = `-----BEGIN PUBLIC KEY-----[\\d\\D]*-----END PUBLIC KEY-----`
    expect(baidu.pubkey).toMatch(new RegExp(regStr))
  })
  it('test rsakey', () => {
    // c0327d77d9de85804d2c926a98b763dc
    expect(baidu.rsakey).toMatch(/^\w{32}$/)
  })
  it('test logincheck', async () => {
    // object: {"codestring": "", "traceid": "", "vcodetype": ""}
    await expect(baidu.logincheck(loginInfo.username)).resolves.toMatchObject({
      codestring: expect.any(String),
      traceid: expect.any(String),
      vcodetype: expect.any(String),
    })
  })
})

describe('登陆测试', () => {
  const baidu = new Baidu()
  beforeAll(() => baidu.init())
  it('test login', async () => {
    // true
    await expect(
      baidu
        .logincheck(loginInfo.username)
        .then(verifycode => baidu.login(loginInfo.password, verifycode)),
    ).resolves.toBe(true)
  })
})

describe('获取信息测试', () => {
  const baidu = new Baidu()
  beforeAll(() =>
    baidu
      .init()
      .then(() => baidu.logincheck(loginInfo.username))
      .then(() => baidu.login(loginInfo.password)))
  it('test getUserInfo', async () => {
    await expect(baidu.getUserInfo()).resolves.toMatchObject({ errno: 0 })
  })
  it('test list', async () => {
    await expect(
      baidu.list({ directory: '/' }).then(list => list.length >= 0),
    ).resolves.toBe(true)
  })
})
