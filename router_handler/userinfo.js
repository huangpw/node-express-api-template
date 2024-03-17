const db = require('../db')

/**
 * 修改头像
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateAvatar = async (req, res) => {
  if (!req.file || req.file.fieldname !== 'avatar')
    return res.new_send('头像上传失败，请检查图片类型！')
  const { old_avatar } = req.body
  const avatarUrl = '/avatar/' + req.file.filename
  // 更新头像
  const updateSql = `update sys_user set avatar = ? where id = ?`
  const [results] = await db.query(updateSql, [avatarUrl, req.body.id])
  if (results.affectedRows !== 1) return res.new_send('更换头像失败')
  // 删除原来的头像
  //  old_avatar && deleteFile(old_avatar)
  res.send({
    status: 0,
    message: '更换头像成功',
    avatar: avatarUrl
  })
}
