const express = require('express')
const router = express.Router()

// 测试有token验证
router.get('/test/token', (req, res) => {
  res.send('token OK')
})

// 测试有token验证
router.get('/not/test/token', (req, res) => {
  res.send('not token OK')
})

// 将路由对象共享出去
module.exports = router
