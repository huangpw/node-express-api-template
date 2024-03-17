const express = require('express')
const router = express.Router()
const fs = require('fs')

// 读取所有的路由
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js') {
    let r = require('./' + file)
    router.use(r)
  }
})

module.exports = router
