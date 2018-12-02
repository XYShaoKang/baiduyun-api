import getGid from '../../../src/login/get-gid'
import getdv from '../../../src/login/getdv'

const { baiduId, token, ubi, pubkey, rsakey, updateUbi, stoken } = {
  baiduId: 'baiduid',
  token: 'c0aaad77d9de85804d2c926a98b763dc',
  ubi: 'ubi',
  pubkey: '-----BEGIN PUBLIC KEY----- pubkey -----END PUBLIC KEY-----',
  rsakey: 'c0bbbd77d9de85804d2c926a98b763dc',
  updateUbi: 'updateUbi',
  stoken: 'stoken',
}
const getBaiduId = () => Promise.resolve([`BAIDUID=${baiduId}:FG=1`])
const getToken = () =>
  Promise.resolve(
    `{"errInfo":{        "no": "0"    },    "data": {        "rememberedUserName" : "",        "codeString" : "",        "token" : "${token}",        "cookie" : "1",        "usernametype":"",        "spLogin" : "rate",        "disable":"",        "loginrecord":{            'email':[            ],            'phone':[            ]        }    },    "traceid": ""}`,
  )
const loginhistory = () => Promise.resolve([`UBI=${ubi}`])
const getRsakey = () =>
  Promise.resolve(
    `{"errno":'0',"msg":'',"pubkey":'${pubkey}',"key":'${rsakey}',    "traceid": ""}`,
  )
const logincheck = () =>
  Promise.resolve({
    ubi: [`UBI=${updateUbi}`],
    errInfo: { no: '0' },
    data: {
      codeString: '',
      vcodetype: '',
      userid: '',
      mobile: '',
      displayname: '',
      isconnect: '',
    },
    traceid: '',
  })
const reggetcodestr = () => Promise.resolve()
const genimage = () => Promise.resolve()
const checkvcode = () => Promise.resolve()
const getRedirectUrl = () =>
  Promise.resolve({ redirectUrl: 'https://pan.baidu.com/disk/home' })
const updateStoken = () => Promise.resolve([`STOKEN=${stoken}`])
const login = () =>
  Promise.resolve({
    cookie: [],
    body: `href += "err_no=0&`,
  })

export {
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
  updateStoken,
  getRedirectUrl,
  login,
}
