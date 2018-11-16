const getUserInfo = () =>
  Promise.resolve({
    errno: 0,
    request_id: '${value}',
    records: [
      {
        uk: '${value}',
        uname: '${value}',
        nick_name: '',
        intro: '',
        avatar_url: '${value}',
        follow_flag: 0,
        black_flag: 0,
        follow_source: '',
        display_name: '',
        remark: '',
        priority_name: '${value}'
      }
    ]
  })

export { getUserInfo }
