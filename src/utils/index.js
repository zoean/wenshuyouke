/**
 * Created by ZOE on 20/02/22
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 * 将日期时间转换为时间戳
 */
export function parseToTimestamp(time,len){
  return new Date(time).getTime(time).toString().substring(0,len)
}
export function enCodeURI(string){
  return encodeURIComponent(string)
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') || (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
export function parseDateTime(time, cFormat){
  return time.replace(/T/g, " ").substring(0, 19)
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
* 今天起始时间戳-默认13位
* @returns {Array}
* 
*/
export function beforeToday(){
  let nowStamp = new Date().getTime()
  let beforeTodayTime = nowStamp-24*60*60*1000
  return [nowStamp, beforeTodayTime]
}
/**
* 本周起始时间戳-默认13位
* @returns {Array}
* 
*/
export function beforeAweek(){
  let nowStamp = new Date().getTime()
  let beforeAweekTime = nowStamp-(24*60*60*1000*7)
  return [nowStamp, beforeAweekTime]
}
/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
/**
 * [rN 电话号码替换-简单加密：数字换成对应的字母]
 * @param  {[type]} str [传入要替换的tel]
 * @return {[type]}     [description]
 */
export function rN(str){
  if(!str){
    return ''
  }
  return str.replace(/1/g, 'N')
            .replace(/2/g, 'D')
            .replace(/3/g, 'H')
            .replace(/4/g, 'J')
            .replace(/5/g, 'E')
            .replace(/6/g, 'B')
            .replace(/7/g, 'F')
            .replace(/8/g, 'U')
            .replace(/9/g, 'P')
            .replace(/0/g, 'I')
}
// export function rN(str){
//   var array1 = ['N','C',1]
//   var array2 = ['D','M',2]
//   var array3 = ['H','G',3]
//   var array4 = ['J','K',4]
//   var array5 = ['E','A',5]
//   var array6 = ['B','T',6]
//   var array7 = ['F','R',7]
//   var array8 = ['U','O',8]
//   var array9 = ['P','S',9]
//   var array0 = ['I','Q',0]
//   let result = str.replace(/1/g, array1[Math.floor(Math.random()*3)])
//             .replace(/2/g, array2[Math.floor(Math.random()*3)])
//             .replace(/3/g, array3[Math.floor(Math.random()*3)])
//             .replace(/4/g, array4[Math.floor(Math.random()*3)])
//             .replace(/5/g, array5[Math.floor(Math.random()*3)])
//             .replace(/6/g, array6[Math.floor(Math.random()*3)])
//             .replace(/7/g, array7[Math.floor(Math.random()*3)])
//             .replace(/8/g, array8[Math.floor(Math.random()*3)])
//             .replace(/9/g, array9[Math.floor(Math.random()*3)])
//             .replace(/0/g, array0[Math.floor(Math.random()*3)])
//   return 'uih45kjn0l' + result + 'ra8cmo3p9'
// }

export function setLocalStorage(itemKey, value){
  return localStorage.setItem(itemKey,value)
}
export function getLocalStorage(itemKey){
  return localStorage.getItem(itemKey)
}
export function removeLocalStorage(itemKey){
  return localStorage.removeItem(itemKey)
}