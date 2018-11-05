// dv获取
// console.log('tk' + Math.random() + new Date().getTime())

function d(e) {
  // true &&
  //     ((x = e.token + '@' + S(e, e.token)),
  //     // (1 & F.SendMethod) > 0
  //         -1 > 0 && c(x))
  const x = `${e.token}@${S(e, e.token)}`
  return x
}

// function c(n) {
//     var r = t.getElementById("dv_Input");
//     r && (r.value = n),
//     e.LG_DV_ARG.dvjsInput = n
// }

function S(e, t) {
  const r = new n(t)

  const o = {
    flashInfo: 0,
    mouseDown: 1,
    keyDown: 2,
    mouseMove: 3,
    version: 4,
    loadTime: 5,
    browserInfo: 6,
    token: 7,
    location: 8,
    screenInfo: 9
  }

  const a = [r.iary([2])]
  for (const i in e) {
    let d = e[i]
    if (void 0 !== d && void 0 !== o[i]) {
      var c
      typeof d === 'number'
        ? ((c = d >= 0 ? 1 : 2), (d = r.int(d)))
        : typeof d === 'boolean'
          ? ((c = 3), (d = r.int(d ? 1 : 0)))
          : typeof d === 'object' && d instanceof Array
            ? ((c = 4), (d = r.bary(d)))
            : ((c = 0), (d = r.str(`${d}`))),
        d && a.push(r.iary([o[i], c, d.length]) + d)
    }
  }
  return a.join('')
}
function n(e) {
  const t = [[48, 57], [65, 90], [97, 122], [45, 45], [126, 126]]

  let n = o(t)

  let a = o(t.slice(1))
  e && ((n = r(n, e)), (a = r(a, e))), (this.dict = n), (this.dict2 = a)
}
n.prototype = {
  int(e) {
    return a(e, this.dict)
  },
  iary(e) {
    for (var t = '', n = 0; n < e.length; n++) {
      const r = a(e[n], this.dict2)
      t += r.length > 1 ? r.length - 2 + r : r
    }
    return t
  },
  str(e) {
    for (var t = [], n = 0; n < e.length; n++) {
      const r = e.charCodeAt(n)
      r >= 1 && r <= 127
        ? t.push(r)
        : r > 2047
          ? (t.push(224 | ((r >> 12) & 15)),
            t.push(128 | ((r >> 6) & 63)),
            t.push(128 | ((r >> 0) & 63)))
          : (t.push(192 | ((r >> 6) & 31)), t.push(128 | ((r >> 0) & 63)))
    }
    for (var o = '', n = 0, a = t.length; a > n; ) {
      const i = t[n++]
      if (n >= a) {
        ;(o += this.dict[i >> 2]), (o += this.dict[(3 & i) << 4]), (o += '__')
        break
      }
      const d = t[n++]
      if (n >= a) {
        ;(o += this.dict[i >> 2]),
          (o += this.dict[((3 & i) << 4) | ((240 & d) >> 4)]),
          (o += this.dict[(15 & d) << 2]),
          (o += '_')
        break
      }
      const c = t[n++]
      ;(o += this.dict[i >> 2]),
        (o += this.dict[((3 & i) << 4) | ((240 & d) >> 4)]),
        (o += this.dict[((15 & d) << 2) | ((192 & c) >> 6)]),
        (o += this.dict[63 & c])
    }
    return o
  }
}
function a(e, t) {
  let n = ''

  let r = Math.abs(parseInt(e))
  if (r) for (; r; ) (n += t[r % t.length]), (r = parseInt(r / t.length))
  else n = t[0]
  return n
}
function r(e, t) {
  for (let n = t.split(''), r = 0; r < e.length; r++) {
    let o = r % n.length
    ;(o = n[o].charCodeAt(0)), (o %= e.length)
    const a = e[r]
    ;(e[r] = e[o]), (e[o] = a)
  }
  return e
}
function o(e) {
  for (var t = [], n = 0; n < e.length; n++)
    for (let r = e[n][0]; r <= e[n][1]; r++) t.push(String.fromCharCode(r))
  return t
}

const e = {
  browserInfo: '1,2,69',
  flashInfo: undefined,
  keyDown: '',
  loadTime: new Date().valueOf() / 1000,
  location: 'https://pan.baidu.com/,undefined',
  mouseDown: '',
  mouseMove: '',
  screenInfo: '0,-1600,1583,916,1600,900,1600,1600,900',
  token: `tk${Math.random()}${new Date().getTime()}`,
  version: 26
}
const getdv = () => d(e)
export default getdv
