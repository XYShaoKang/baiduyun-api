const getList = () =>
  Promise.resolve({
    errno: 0,
    guid_info: '',
    list: [
      {
        category: 6,
        unlist: 0,
        fs_id: 10000000000000,
        dir_empty: 0,
        oper_id: 0,
        server_ctime: 1493410683,
        local_mtime: 1493410683,
        size: 0,
        share: 0,
        isdir: 1,
        path: '/\u8d44\u6e90',
        local_ctime: 1493410683,
        server_filename: '\u8d44\u6e90',
        empty: 0,
        server_mtime: 1493411032
      },
      {
        server_mtime: 1540242382,
        category: 4,
        unlist: 0,
        fs_id: 200000000000000,
        isdir: 0,
        oper_id: 3844144782,
        server_ctime: 1540242382,
        thumbs: {
          url3: '${value}',
          url2: '${value}',
          url1: '${value}'
        },
        lodocpreview: '${value}',
        local_mtime: 1540242378,
        size: 6,
        docpreview: '${value}',
        share: 0,
        md5: '${value}',
        path: '/temp.txt',
        local_ctime: 1540242382,
        server_filename: 'temp.txt'
      }
    ],
    request_id: 7066221872973620821,
    guid: 0
  })
export { getList }
