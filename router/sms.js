// 导入 express 模块
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入发送短信函数模块
const { sendSms } = require('../router_handler/sms')

// 发送短信验证码
router.post('/send/sms', sendSms)

// 将路由对象共享出去
module.exports = router
