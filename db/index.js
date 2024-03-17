// 导入 mysql 模块
const mysql = require('mysql2/promise')
// 初始化用户
const { initUser } = require('./init')

// 数据库配置
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'node-express-template'
})

// 初始化用户
// initUser(db)

// 链接数据库
db.getConnection()
  .then((conn) => {
    logger.info('数据库连接成功')
    // 初始化用户
    initUser(conn)
  })
  .catch((err) => {
    logger.info('数据库连接失败', err)
  })

module.exports = db
