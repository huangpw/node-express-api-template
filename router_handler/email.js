const nodemailer = require('nodemailer')
const db = require('../db')
const { getNowDatetime } = require('../utils')

/**
 * 保存验证码到数据库
 * @param {*} verify_type
 * @param {*} verify_account
 * @param {*} verify_code
 * @returns
 */
exports.saveVerifyCode = async (verify_type, verify_account, verify_code) => {
  const insertSql = 'insert into sys_verify_code set ?'
  const [results] = await db.query(insertSql, {
    verify_type,
    verify_account,
    verify_code,
    create_time: getNowDatetime()
  })
  if (results.affectedRows !== 1) return false
  return true
}

//创建一个SMTP客户端配置对象
const transporter = nodemailer.createTransport({
  // 默认支持的邮箱服务包括：”QQ”、”163”、”126”、”iCloud”、”Hotmail”、”Yahoo”等
  service: 'QQ',
  auth: {
    // 发件人邮箱账号
    user: '1042850644@qq.com',
    //发件人邮箱的授权码 需要在自己的邮箱设置中生成,并不是邮件的登录密码
    pass: 'yqxaruxitecxbdbd'
  }
})

/**
 * 发送邮箱
 * @param {*} toUserEmail
 * @param {*} title
 * @param {*} content
 * @returns
 */
exports.sendEmail = (toUserEmail, title, content) => {
  return new Promise((resolve) => {
    // 配置收件人信息
    const receiver = {
      // 发件人 邮箱  '昵称<发件人邮箱>'
      from: `1042850644@qq.com`,
      // 主题
      subject: title,
      // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
      to: toUserEmail,
      // 可以使用html标签
      html: content
    }

    // 发送邮件
    transporter.sendMail(receiver, (error, info) => {
      if (error) {
        return resolve({
          status: 1,
          message: error
        })
      }
      transporter.close()
      return resolve({
        status: 0,
        message: '发送成功'
      })
    })
  })
}
