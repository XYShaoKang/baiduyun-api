import Baidu from '../src/baidu'

describe('初始化测试', () => {
  const baidu = new Baidu()
  beforeEach(() => baidu.init())
  test('test getGid', () => {
    // 1602D74-9046-4303-A8EA-128DA1E7C1A2
    expect(baidu.gid).toMatch(/^\w{7}-\w{4}-\w{4}-\w{4}-\w{12}$/)
  })
  test('test getdv', () => {
    // tk0.99678179142258941541947693595@jInh9Blf5kIzErIgvvY6hhnmAt8wOt9Y5fTlIJjXIb4HMtCXIyTg5fZ~6b8VMbVXMJr_xnk9mlg9DIl9mlZ0DU-5k3Z01lZ02ql5k3l9mlZ02ql5kvy9kqcoDql~nmpscl523z02Oj9DOz9Drf92CjoDrZ0DrZoDrx023-0D3~urrA
    expect(baidu.dv).toMatch(/^tk0\./)
  })
  test('test getBaiduId', () => {
    // BAIDUID=F108291755F8AC6FDBBC8F533C309DBF:FG=1
    expect(baidu.cookie.getStr('BAIDUID')).toMatch(/^BAIDUID=\w*?:FG=1$/)
  })
  test('test token', () => {
    // c0327d77d9de85804d2c926a98b763dc
    expect(baidu.token).toMatch(/^\w{32}$/)
  })
  test('test pubkey', () => {
    /*
    -----BEGIN PUBLIC KEY-----
    ...
    -----END PUBLIC KEY-----
    */
    const regStr = `-----BEGIN PUBLIC KEY-----[\\d\\D]*-----END PUBLIC KEY-----`
    expect(baidu.pubkey).toMatch(new RegExp(regStr))
  })
  test('test rsakey', () => {
    // c0327d77d9de85804d2c926a98b763dc
    expect(baidu.rsakey).toMatch(/^\w{32}$/)
  })
})

describe('登陆测试', () => {
  const baidu = new Baidu()
  const qs = {
    username: '',
    password: ''
  }
  beforeEach(() => baidu.init())
  test('test logincheck', async () => {
    // 1602D74-9046-4303-A8EA-128DA1E7C1A2
    await expect(baidu.logincheck(qs.username)).resolves.toBe(
      `{"codestring": "", "traceid": "", "vcodetype": ""}`
    )
  })
})
