const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')

const {
  getNowDatetime,
  verifyEmail,
  verifyMobile,
  diffInMinutes
} = require('../utils')
const config = require('../utils/config')

// 注册用户的处理函数
exports.regUser = async (req, res) => {
  const { username, account, code, password, password_verify } = req.body
  // 校验密码是否一致
  if (password !== password_verify) {
    return res.newSend('两次输入的密码不一致')
  }

  // 新增数据
  const insertData = async (verify_type) => {
    try {
      const verifyCodeSql = `SELECT * 
      from sys_verify_code
      where (verify_type = ?) and (create_time = (select max(create_time)  from sys_verify_code where verify_type = ? and verify_account = ?))`
      const [results] = await db.query(verifyCodeSql, [
        verify_type,
        verify_type,
        account
      ])
      if (results[0].verify_code !== code) return res.newSend('验证码不正确')
      // 查询用户
      const selectSql = `select * from sys_user where username = ? and status = 1`
      const [results2] = await db.query(selectSql, username)
      if (results2.length > 0) return res.newSend('用户名已存在')
      // 密码加密
      const password_bcrypt = bcrypt.hashSync(password, 10)
      // 插入数据库
      const insertsql = 'insert into sys_user set ?'
      const [results3] = await db.query(insertsql, {
        username,
        password: password_bcrypt,
        nick_name: '用户' + nanoid(5),
        sex: null,
        email: account,
        mobile: null,
        avatar: '/default/1.jpg',
        status: 1,
        role: 1,
        create_by: null,
        create_time: getNowDatetime(),
        last_update_by: null,
        last_update_time: null
      })
      if (results3.affectedRows !== 1) return res.newSend('注册用户失败')
      res.newSend('注册成功', 0)
    } catch (err) {
      logger.info(err)
    }
  }
  // 检查account类型

  let mobileRegex = /^\d{11}$/
  if (verifyEmail(account)) {
    // 邮箱
    await insertData('email')
  } else if (verifyMobile(account)) {
    // 手机号码
    await insertData('mobile')
  } else {
    return res.newSend('内容既不是邮箱也不是手机号码')
  }
}

// 登录的处理函数
exports.login = async (req, res) => {
  try {
    // 接收表单数据
    const { username, password } = req.body
    // 用户名为空
    if (!username) {
      return res.newSend('用户名为空')
    }
    // 密码为空
    if (!password) {
      return res.newSend('密码为空')
    }
    // 查询用户(正常用户)
    const selectSql = `select * from sys_user where username = ? and status = 1`
    const [results] = await db.query(selectSql, username)
    if (results.length <= 0) return res.newSend('用户不存在')

    // 密码对比
    const compareResult = bcrypt.compareSync(password, results[0].password)
    if (!compareResult) return res.newSend('密码错误')

    // 生成Token
    const user = {
      id: results[0].id,
      username: results[0].username,
      nick_name: results[0].nick_name,
      sex: results[0].sex,
      email: results[0].email,
      mobile: results[0].mobile,
      avatar: results[0].avatar,
      role: results[0].role,
      status: results[0].status
    }

    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr,
      user
    })
  } catch (err) {
    logger.error(err)
    res.newSend(err.message)
  }
}

/**
 * 邮箱+验证码登录 或 手机号码+验证码登录
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.loginAccount = async (req, res) => {
  try {
    // 接收表单数据
    const { account, code } = req.body
    // 用户名为空
    if (!account) {
      return res.newSend('邮箱或手机号码为空')
    }

    let verify_type = 'email'
    let selectSql = ''
    if (verifyEmail(account)) {
      verify_type = 'email'
      selectSql = `select * from sys_user where email = ? and status = 1`
    } else if (verifyMobile(account)) {
      verify_type = 'mobile'
      selectSql = `select * from sys_user where mobile = ? and status = 1`
    } else {
      return res.newSend('邮箱或手机号码不正确')
    }
    // 检查验证码
    const verifyCodeSql = `SELECT * 
      from sys_verify_code
      where (verify_type = ?) and (create_time = (select max(create_time)  from sys_verify_code where verify_type = ? and verify_account = ?))`
    const [data] = await db.query(verifyCodeSql, [
      verify_type,
      verify_type,
      account
    ])
    if (data[0].verify_code !== code) return res.newSend('验证码不正确')
    // 检查验证码超过10分钟
    if (diffInMinutes(data[0].create_time) > 10)
      return res.newSend('验证码已失效')

    const [results] = await db.query(selectSql, account)
    if (results.length <= 0) return res.newSend('用户不存在')
    // 生成Token
    const user = {
      id: results[0].id,
      username: results[0].username,
      nick_name: results[0].nick_name,
      sex: results[0].sex,
      email: results[0].email,
      mobile: results[0].mobile,
      avatar: results[0].avatar,
      role: results[0].role,
      status: results[0].status
    }

    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr,
      user
    })
  } catch (err) {
    logger.error(err)
    res.newSend(err.message)
  }
}

/**
 * 忘记密码
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.forgotPassword = async (req, res) => {
  try {
    // 接收表单数据
    const { email, code, password, password_verify } = req.body
    // 邮箱为空
    if (!email) {
      return res.newSend('邮箱为空')
    }

    // 校验密码是否一致
    if (password !== password_verify) {
      return res.newSend('两次输入的密码不一致')
    }

    // 检查验证码
    const verifyCodeSql = `select * 
      from sys_verify_code
      where (verify_type = ?) and (create_time = (select max(create_time)  from sys_verify_code where verify_type = ? and verify_account = ?))`
    const [data] = await db.query(verifyCodeSql, ['email', 'email', email])
    if (data[0].verify_code !== code) return res.newSend('验证码不正确')
    // 检查验证码超过10分钟
    if (diffInMinutes(data[0].create_time) > 10)
      return res.newSend('验证码已失效')

    const selectSql = `select * from sys_user where email = ? and status = 1`
    const [results] = await db.query(selectSql, email)
    if (results.length <= 0) return res.newSend('用户不存在')

    const id = results[0].id
    const username = results[0].username
    const last_update_time = getNowDatetime()
    // 密码加密
    const password_bcrypt = bcrypt.hashSync(password, 10)
    const updateSql = `update sys_user set password = ?, last_update_by = ?, last_update_time = ? where id = ?`
    const [results2] = await db.query(updateSql, [
      password_bcrypt,
      username,
      last_update_time,
      id
    ])
    if (results2.affectedRows !== 1) return res.newSend('修改密码失败')
    res.newSend('修改密码成功', 0)
  } catch (err) {
    logger.error(err)
    res.newSend(err.message)
  }
}
