const getGid = function getGid() {
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, e => {
      const t = (16 * Math.random()) | 0

      const n = e === 'x' ? t : (3 & t) | 8
      return n.toString(16)
    })
    .toUpperCase()
}
export default getGid
