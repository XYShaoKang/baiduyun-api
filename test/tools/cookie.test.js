import Cookie from '../../src/tools/cookie'

// 生成 cookie 字符串数据
function generateCookieStrs() {
  const cookies = [
    'baiduid1=xxx1',
    'baiduid2=xxx2',
    'baiduid3=xxx3',
    'baiduid4=xxx4',
    'baiduid5=xxx5',
    'baiduid6=xxx6',
  ]
  return [...cookies]
}

it('cookie constructor', () => {
  const cookie = new Cookie()
  expect(cookie.data).toEqual([])
})

describe('curd', () => {
  let cookie = new Cookie()

  beforeEach(() => {
    cookie = new Cookie()
    cookie.update(generateCookieStrs())
  })
  it('getArray', () => {
    const result = cookie.getArray()
    const cookieStrs = generateCookieStrs()
    expect(result).toEqual(cookieStrs)
  })
  it('getStr then one key', () => {
    const key = 'baiduid1'
    const result = cookie.getStr(key)
    expect(result).toContain(key)
  })
  it('getStr then array key', () => {
    const keys = ['baiduid1', 'baiduid2']
    const result = cookie.getStr(keys)
    expect(result).toContain(...keys)
  })
  it('getStr then empty param', () => {
    const result = cookie.getStr()
    const cookieStrs = generateCookieStrs()
    expect(result).toContain(...cookieStrs)
  })
  it('add 添加 cookie', () => {
    const cookieStr = 'baidu1=xxx'
    const [key, value] = cookieStr.split('=')

    cookie.add({ key, value })

    const result = cookie.getArray()
    expect(result).toContain(cookieStr)
  })
  it('remove 删除 cookie', () => {
    const key = 'baiduid1'

    cookie.remove(key)

    const result = cookie.getStr()
    expect(result).not.toContain(key)
  })
  it('update str', () => {
    const cookieStr = 'baidu=xxx'

    cookie.update(cookieStr)

    const result = cookie.getArray()
    expect(result).toContain(cookieStr)
  })
  it('update strs', () => {
    const cookieStrs = ['baidu1=xxx', 'baidu2=xxx']

    cookie.update(cookieStrs)

    const result = cookie.getArray()
    expect(result).toContain(...cookieStrs)
  })
  it('update repeat key', () => {
    const cookieStrs = ['baiduid1=yyy', 'baidu2=xxx']

    cookie.update(cookieStrs)

    const result = cookie.getArray()
    expect(result).toContain(...cookieStrs)
  })
})
