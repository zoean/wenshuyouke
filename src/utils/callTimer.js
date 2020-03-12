/**
 * 计时器
 * @param {number} time 初始时间
 * @param {boolean} type 默认为true正计时，false为倒计时
 */
function Timer(time, type) {
  this.init(time, type)
}

/**
 * 初始化
 */
Timer.prototype.init = function (time, type) {
  this.time = time || parseInt(Math.random() * 3600)
  this.timerId = null

  if (type === undefined) {
    this.type = true
  } else {
    this.type = type
  }
}

/**
 * 开始/恢复
 */
Timer.prototype.start = function () {
  !this.timerId && this.reTime()
}

/**
 * 暂停/停止
 */
Timer.prototype.pause = function () {
  if (this.timerId) {
    clearTimeout(this.timerId)
    this.timerId = null
  }
}

/**
 * 刷新时间
 * @return {string} 时间
 */
Timer.prototype.reTime = function () {
  if (this.type) {
    this.time++
  } else if (this.time > 0) {
    this.time--
  } else {
    // 等于零结束计时
    console.log('00:00:00')
    return false
  }

  // 输出时间
  this.formatOutput()
  // 递归
  this.timerId = setTimeout(this.reTime.bind(this), 1000)
}

/**
 * 输出时间
 */
Timer.prototype.formatOutput = function () {
  // 获取时分秒
  let h = parseInt(this.time / 3600)
  let m = parseInt((this.time - h * 3600) / 60)
  let s = this.time - h * 3600 - m * 60

  // 格式化
  h < 10 ? h = `0${h}` : ''
  m < 10 ? m = `0${m}` : ''
  s < 10 ? s = `0${s}` : ''

  console.log(`${h}:${m}:${s}`)
}
export default Timer