const multer = require('multer')
const path = require('path')
const { nanoid } = require('nanoid')
const { getNowDatetime } = require('../utils')

// 限制图片上传类型
const fileFilter = (req, file, cb) => {
  const fileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml'
  ]
  if (fileTypes.indexOf(file.mimetype) !== -1) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// 保存头像到本地路径
const storage_avatar = multer.diskStorage({
  destination: path.resolve('public/avatar/'),
  filename: (req, file, cb) => {
    // 后缀名
    let extName = path.extname(file.originalname)
    // 文件名(无后缀名)
    let basename = path.basename(file.originalname, extName)
    // 新文件名
    let fileName = basename + '_' + nanoid() + extName
    cb(null, fileName)
  }
})

// 保存图片到本地路径
const storage_image = multer.diskStorage({
  destination: path.resolve('public/images/'),
  filename: (req, file, cb) => {
    // 后缀名
    let extName = path.extname(file.originalname)
    // 文件名(无后缀名)
    let basename = path.basename(file.originalname, extName)
    let fileName = basename + '_' + nanoid() + extName
    cb(null, fileName)
  }
})

// 保存文件到本地路径
const storage_file = multer.diskStorage({
  destination: path.resolve('public/files/'),
  filename: (req, file, cb) => {
    // 后缀名
    let extName = path.extname(file.originalname)
    // 文件名(无后缀名)
    let basename = path.basename(file.originalname, extName)
    // 新文件名
    let fileName = basename + '_' + nanoid() + extName
    cb(null, fileName)
  }
})

// 文件最大内存大小
const limits = {
  fileSize: '100MB'
}

// 头像上传(单文件)
exports.upload_avatar = multer({
  fileFilter,
  storage: storage_avatar,
  limits
}).single('avatar')

// 图片上传(单文件)
exports.upload_image = multer({
  fileFilter,
  storage: storage_image,
  limits
}).single('image')

// 图片上传(多文件)
exports.upload_images = multer({
  fileFilter,
  storage: storage_image,
  limits
}).array('images', 100)

// 文件上传(单文件)
exports.upload_file = multer({
  storage: storage_file,
  limits
}).single('file')

// 文件上传(多文件)
exports.upload_files = multer({
  storage: storage_file,
  limits
}).array('files', 100)

// 图片上传(单文件)
exports.saveImage = (req, res) => {
  if (!req.file || req.file.fieldname !== 'image')
    return res.new_send('图片上传失败')

  // 图片上传成功处理
  const { filename } = req.file
  const file_url = '/images/' + filename
  res.send({
    status: 0,
    message: '图片上传成功',
    data: { file_url }
  })
}

// 图片上传(多文件)
exports.saveImages = async (req, res) => {
  if (req.files.length <= 0) return res.new_send('图片上传失败')

  // 图片上传成功处理
  let resData = []
  req.files.map((item) => {
    let file_url = '/images/' + item.filename
    // 返回结果
    resData.push({
      id: null,
      file_url
    })
  })
  res.send({
    status: 0,
    message: '图片上传成功',
    data: resData
  })
}

// 文件上传(单文件)
exports.saveFile = (req, res) => {
  if (!req.file || req.file.fieldname !== 'file')
    return res.new_send('文件上传失败')

  // 文件上传成功处理
  const { filename } = req.file
  const file_url = '/files/' + filename

  res.send({
    status: 0,
    message: '文件上传成功',
    data: { file_url }
  })
}

// 文件上传(多文件)
exports.saveFiles = (req, res) => {
  if (req.files.length <= 0) return res.new_send('文件上传失败')

  // 文件上传成功处理
  let resData = []
  req.files.map((item) => {
    let file_url = '/file/' + item.filename
    // 返回结果
    resData.push({
      id: null,
      file_url
    })
  })
  res.send({
    status: 0,
    message: '文件上传成功',
    data: resData
  })
}
