// 导入 express 模块
const express = require('express')

// 创建路由对象
const router = express.Router()
// 验证邮箱
const { verifyEmail, randomString } = require('../utils')
// 导入发送短信函数模块
const { sendEmail, saveVerifyCode } = require('../router_handler/email')

/**
 * 发送邮箱验证码
 */
router.post('/send/email', async (req, res) => {
  try {
    const { email } = req.body
    if (!verifyEmail(email)) res.newSend('邮箱地址不正确')
    const code = randomString(6)
    const data = await saveVerifyCode('email', email, code)
    if (!data) return res.newSend('发送验证码失败')

    const content = `<div>
          <h3>邮箱验证码</h3>
          <p>您的验证码是：<span style="color:lightskyblue;font-weight: bold;padding: 0 10px;">${code}</span>，请在 10 分钟内进行验证！<p>
          <p>如果该验证码不为您本人申请，请忽略无视！</p>
      </div>`
    const title = '欢迎注册！'

    const result = await sendEmail(email, title, content)
    res.send(result)
  } catch (err) {
    logger.error(err)
    res.newSend(err.message)
  }
})

// 将路由对象共享出去
module.exports = router
