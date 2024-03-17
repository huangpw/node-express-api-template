// 密码加密
const bcrypt = require('bcryptjs')
// 随机ID
const { nanoid } = require('nanoid')
// 获取当前日期时间
const { getNowDatetime } = require('../utils')

/**
 * 初始化用户
 * @param {*} db
 */
exports.initUser = async (db) => {
  // 查询用户是否存在
  let selectSql = `select count(*) num from sys_user`
  const [results] = await db.query(selectSql)
  if (results[0].num <= 0) {
    let user = {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('888', 10),
      nick_name: '用户' + nanoid(5),
      sex: '男',
      email: '1042850644@qq.com',
      mobile: 13232722996,
      avatar: '/default/1.jpg',
      status: 1,
      role: 1,
      create_by: null,
      create_time: getNowDatetime(),
      last_update_by: null,
      last_update_time: null
    }
    const insertSql = `insert into sys_user set ?`
    const [results] = await db.query(insertSql, user)
    if (results.affectedRows > 0) logger.info('用户初始化成功...')
  }
}
