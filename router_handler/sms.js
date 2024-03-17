const tencentcloud = require('tencentcloud-sdk-nodejs')
const { generateSixDigitNumber, verifyMobile } = require('../utils')
const { saveVerifyCode } = require('./email')

// 导入对应产品模块的client models。
const smsClient = tencentcloud.sms.v20210111.Client

/* 实例化要请求产品(以sms为例)的client对象 */
const client = new smsClient({
  credential: {
    /* 必填：腾讯云账户密钥对secretId，secretKey。
     * 这里采用的是从环境变量读取的方式，需要在环境变量中先设置这两个值。
     * 您也可以直接在代码中写死密钥对，但是小心不要将代码复制、上传或者分享给他人，
     * 以免泄露密钥对危及您的财产安全。
     * SecretId、SecretKey 查询: https://console.cloud.tencent.com/cam/capi */
    //  需要放开
    secretId: '',
    secretKey: ''
  },
  /* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */
  region: 'ap-guangzhou',
  profile: {
    /* 非必填:
     * 客户端配置对象，可以指定超时时间等配置 */
    signMethod: 'HmacSHA256',
    httpProfile: {
      /* SDK默认使用POST方法。
       * 如果您一定要使用GET方法，可以在这里设置。GET方法无法处理一些较大的请求 */
      reqMethod: 'POST',
      /* SDK有默认的超时时间，非必要请不要进行调整
       * 如有需要请在代码中查阅以获取最新的默认值 */
      reqTimeout: 30,
      /**
       * 指定接入地域域名，默认就近地域接入域名为 sms.tencentcloudapi.com ，也支持指定地域域名访问，例如广州地域的域名为 sms.ap-guangzhou.tencentcloudapi.com
       */
      endpoint: 'sms.tencentcloudapi.com'
    }
  }
})

const params = (TemplateParamSet, PhoneNumberSet) => {
  return {
    /* 短信应用ID: 短信SmsSdkAppId在 [短信控制台] 添加应用后生成的实际SmsSdkAppId，示例如1400006666 */
    // 应用 ID 可前往 [短信控制台](https://console.cloud.tencent.com/smsv2/app-manage) 查看
    SmsSdkAppId: '1400887247',
    /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名 */
    // 签名信息可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-sign) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-sign) 的签名管理查看
    SignName: 'notehpwCom网',
    /* 模板 ID: 必须填写已审核通过的模板 ID */
    // 模板 ID 可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-template) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-template) 的正文模板管理查看
    TemplateId: '2066202',
    /* 模板参数: 模板参数的个数需要与 TemplateId 对应模板的变量个数保持一致，若无模板参数，则设置为空 */
    TemplateParamSet, //['1234'],
    /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
     * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
    PhoneNumberSet, // ['+8613232722996'], //["+8613711112222"]
    /* 用户的 session 内容（无需要可忽略）: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
    SessionContext: '',
    /* 短信码号扩展号（无需要可忽略）: 默认未开通，如需开通请联系 [腾讯云短信小助手] */
    ExtendCode: '',
    /* 国内短信无需填写该项；国际/港澳台短信已申请独立 SenderId 需要填写该字段，默认使用公共 SenderId，无需填写该字段。注：月度使用量达到指定量级可申请独立 SenderId 使用，详情请联系 [腾讯云短信小助手](https://cloud.tencent.com/document/product/382/3773#.E6.8A.80.E6.9C.AF.E4.BA.A4.E6.B5.81)。 */
    SenderId: ''
  }
}

exports.sendSms = async (req, res) => {
  try {
    const { mobile } = req.body
    if (!verifyMobile(mobile)) res.newSend('手机号码不正确')
    const code = generateSixDigitNumber().toString()
    const data = await saveVerifyCode('mobile', mobile, code)
    if (!data) return res.newSend('发送验证码失败')

    const PhoneNumberSet = ['+86' + mobile]
    console.log(code, PhoneNumberSet, 'PhoneNumberSet')
    const result = await client.SendSms(params([code], PhoneNumberSet))
    console.log(result)
    res.send({
      status: 0,
      message: '发送成功'
    })
  } catch (err) {
    logger.error(err)
    res.newSend(err.message)
  }
}
