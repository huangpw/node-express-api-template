// 导入 express 模块
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入用户路由处理函数模块
const {
  regUser,
  login,
  loginAccount,
  forgotPassword
} = require('../router_handler/user')

// 注册新用户
router.post('/reguser', regUser)

// 登录
router.post('/login', login)

// 邮箱+验证码登录 或 手机号码+验证码登录
router.post('/login/account', loginAccount)

// 忘记密码
router.post('/forgot/password', forgotPassword)

// 将路由对象共享出去
module.exports = router
