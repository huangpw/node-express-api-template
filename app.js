// 导入 http 模块
const http = require('http')
// 导入 express 模块
const express = require('express')
// 导入 WebSocket 通信协议
const WebSocket = require('ws')
// 导入 cors 中间件
const cors = require('cors')
// 导入 log4js 模块
const log4js = require('log4js')
// 创建 express 的服务器实例
const app = express()
// 集成 log4js 日志
const { getLogger } = require('./utils/log4js')
global.logger = getLogger('runtime')
// 导入错误统一处理
const { errror } = require('./utils')

// 将 cors 注册为全局中间件
app.use(cors())
// 配置解析 application/x-www-form-urlencoded 表单
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('./public'))
app.use(errror)

// 设置 WebSocket 服务
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
// 设置 WebSocket 为全局变量
global.wss = wss

// 过滤Token校验接口
const { expressjwt } = require('express-jwt')
const config = require('./utils/config')
app.use(
  expressjwt({
    secret: config.jwtSecretKey,
    algorithms: ['HS256']
  }).unless({
    path: [/^\/login/, /^\/reguser/, /^\/forgot/, /^\/send/, /^\/test/]
  })
)

// 导入并注册用户路由模块
const router = require('./router')
app.use(router)

// 错误级别中间件
const joi = require('joi')
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.newSend(err)
  if (err.name === 'UnauthorizedError') return res.newSend('身份认证失败', 401)
  res.newSend(err)
})

// 调用 app.listen 方法，指定端口号并启动web服务器
server.listen(8001, () => {
  console.log('Server is running on port http://127.0.0.1:8001')
})
