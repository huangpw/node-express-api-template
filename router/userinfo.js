const express = require('express')
const router = express.Router()
const { upload_avatar } = require('../router_handler/upload')
const { updateAvatar } = require('../router_handler/userinfo')

// 修改头像
router.patch('/update/avatar', upload_avatar, updateAvatar)

// 将路由对象共享出去
module.exports = router
