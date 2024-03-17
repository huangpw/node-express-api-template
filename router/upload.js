const express = require('express')
const router = express.Router()
// 导入文件上传函数模块
const {
  upload_image,
  saveImage,
  upload_images,
  saveImages,
  upload_file,
  saveFile,
  upload_files,
  saveFiles
} = require('../router_handler/upload')

// 图片上传(单文件)
router.post('/upload/image', upload_image, saveImage)

// 图片上传(多文件)
router.post('/upload/images', upload_images, saveImages)

// 文件上传(单文件)
router.post('/upload/file', upload_file, saveFile)

// 文件上传(多文件)
router.post('/upload/files', upload_files, saveFiles)

module.exports = router
