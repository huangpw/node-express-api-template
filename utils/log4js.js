const log4js = require('log4js')

log4js.configure({
  appenders: {
    // 定义输出到哪
    console: {
      type: 'console'
    },
    runtime: {
      // 设置类型为 dateFile
      type: 'dateFile',
      // 配置文件名为 myLog.log
      filename: './logs/runtime.log',
      // 指定编码格式为 utf-8
      encoding: 'utf-8',
      // 配置 layout，此处使用自定义模式 pattern
      layout: {
        type: 'pattern',
        // 配置模式，下面会有介绍
        // pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
        pattern: '%d %p %m'
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyy-MM-dd',
      numBackups: 7, // 删除5天前的日志
      // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
      keepFileExt: true,
      compress: true,
      // 输出的日志文件名是都始终包含 pattern 日期结尾
      alwaysIncludePattern: true
    }
    // access: {
    //   type: 'dateFile',
    //   pattern: '-yyyy-MM-dd.log',
    //   numBackups: 5,
    //   filename: './logs/access.log',
    //   keepFileExt: false,
    //   compress: true
    // }
  },
  categories: {
    // 定义两个分类，外部实例化的时候可以任选其一
    default: { appenders: ['console'], level: 'debug' },
    // access: { appenders: ['console', 'access'], level: 'debug' },
    default: { appenders: ['console', 'runtime'], level: 'debug' }
  }
})

exports.getLogger = (category) => {
  return log4js.getLogger(category)
}
