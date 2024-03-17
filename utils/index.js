const dayjs = require('dayjs')

/**
 * 错误统一处理
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.errror = (req, res, next) => {
  // 1 = 失败, 0 = 成功
  res.newSend = (err, status = 1) => {
    status === 1 ? logger.error(err) : logger.log(err)
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
}

// 获取当前日期时间
exports.getNowDatetime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// 格式化时间
exports.formatTime = (data) => {
  if (!data) return null
  return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 检查邮箱地址
 * @param {*} email
 */
exports.verifyEmail = (email) => {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 检查手机号码
 * @param {*} mobile
 */
exports.verifyMobile = (mobile) => {
  let mobileRegex = /^(13\d|14[5-9]|15[0-35-9]|166|17[0-8]|18\d|19[89])\d{8}$/
  return mobileRegex.test(mobile)
}

/**
 * 随机编码
 * @param length:长度
 */
exports.randomString = (length) => {
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  var randomString = ''
  for (var i = 0; i < length; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    )
  }
  return randomString
}

/**
 * 随机6位数字
 */
exports.generateSixDigitNumber = () => {
  let num = Math.floor(Math.random() * 900000) + 100000
  return num.toString().padStart(6, '0')
}

/**
 *
 */
exports.diffInMinutes = (value) => {
  const dateTime = dayjs()
  const minute = dateTime.diff(value, 'minutes')
  return minute
}
