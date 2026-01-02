/**
 * 认证相关 API
 * 根据 user.md 文档更新
 */
import request from '@/utils/request.js'

/**
 * 获取图形验证码
 * 登录时必须提供验证码
 * @param {string} [id] - 验证码 ID，用于刷新同一验证码
 * @returns {Promise<{id: string, image: string}>} 验证码ID和Base64图片
 */
export function getCaptcha(id) {
  return request({
    url: '/auth/captcha',
    method: 'GET',
    data: id ? { id } : {}
  })
}

/**
 * 获取验证码配置
 * 前端根据此接口决定显示哪种验证码
 * APP 端会自动带上 X-Client-Type: app 请求头，返回 type: "image"
 * H5 端返回 type: "turnstile"
 * @returns {Promise<{type: string, turnstile_site_key: string}>}
 */
export function getCaptchaConfig() {
  return request({
    url: '/auth/captcha-config',
    method: 'GET'
  })
}

/**
 * 检查是否开放注册
 * @returns {Promise<{allowed: boolean}>}
 */
export function checkRegisterStatus() {
  return request({
    url: '/auth/register-status',
    method: 'GET'
  })
}

/**
 * 检查登录是否需要验证码
 * 当前版本始终返回需要验证码
 * @param {string} [email] - 用户邮箱（当前版本忽略此参数）
 */
export function checkCaptchaStatus(email) {
  return request({
    url: '/auth/login/captcha-status',
    method: 'GET',
    data: email ? { email } : {}
  })
}

/**
 * 发送注册验证邮件
 * @param {Object} data - 参数
 * @param {string} data.email - 邮箱地址
 * @param {string} data.captcha_id - 验证码ID
 * @param {string} data.captcha_code - 4位数字验证码
 */
export function sendRegisterEmail(data) {
  return request({
    url: '/auth/register/send',
    method: 'POST',
    data
  })
}

/**
 * 完成注册（邮件验证方式）
 * @param {Object} data - 注册参数
 * @param {string} data.token - 邮件中的验证 token
 * @param {string} data.username - 用户名 (3-20字符)
 * @param {string} data.password - 密码 (6-32字符)
 */
export function completeRegister(data) {
  return request({
    url: '/auth/register/complete',
    method: 'POST',
    data
  })
}

/**
 * 传统注册（SMTP 未配置时）
 * @param {Object} data - 注册参数
 * @param {string} data.username - 用户名
 * @param {string} data.email - 邮箱地址
 * @param {string} data.password - 密码
 */
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'POST',
    data
  })
}

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.email - 邮箱地址
 * @param {string} data.password - 密码
 * @param {string} data.captcha_id - 验证码ID（必填）
 * @param {string} data.captcha_code - 4位数字验证码（必填）
 * @param {string} [data.totp_code] - 2FA验证码（启用双因素认证时需要）
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

/**
 * 获取当前用户信息
 */
export function getUserInfo() {
  return request({
    url: '/auth/me',
    method: 'GET'
  })
}


/**
 * 传统修改密码（验证旧密码）
 * @param {Object} data - 参数
 * @param {string} data.old_password - 旧密码
 * @param {string} data.new_password - 新密码
 */
export function changePassword(data) {
  return request({
    url: '/auth/password',
    method: 'PUT',
    data
  })
}

/**
 * 发送修改密码验证邮件
 * @param {Object} data - 参数
 * @param {string} data.captcha_id - 验证码ID
 * @param {string} data.captcha_code - 4位数字验证码
 */
export function sendChangePasswordEmail(data) {
  return request({
    url: '/auth/change-password/send',
    method: 'POST',
    data
  })
}

/**
 * 通过邮件验证修改密码
 * @param {Object} data - 参数
 * @param {string} data.token - 邮件中的验证 token
 * @param {string} data.password - 新密码
 */
export function confirmChangePassword(data) {
  return request({
    url: '/auth/change-password/confirm',
    method: 'POST',
    data
  })
}

/**
 * 忘记密码
 * @param {Object} data - 参数
 * @param {string} data.email - 注册邮箱
 * @param {string} data.captcha_id - 验证码ID
 * @param {string} data.captcha_code - 4位数字验证码
 */
export function forgotPassword(data) {
  return request({
    url: '/auth/forgot-password',
    method: 'POST',
    data
  })
}

/**
 * 重置密码
 * @param {Object} data - 参数
 * @param {string} data.token - 邮件中的验证 token
 * @param {string} data.password - 新密码
 */
export function resetPassword(data) {
  return request({
    url: '/auth/reset-password',
    method: 'POST',
    data
  })
}

/**
 * 发送修改邮箱验证邮件
 * @param {Object} data - 参数
 * @param {string} data.captcha_id - 验证码ID
 * @param {string} data.captcha_code - 4位数字验证码
 */
export function sendChangeEmailVerification(data) {
  return request({
    url: '/auth/change-email/send',
    method: 'POST',
    data
  })
}

/**
 * 验证并设置新邮箱
 * @param {Object} data - 参数
 * @param {string} data.token - 邮件中的验证 token
 * @param {string} data.new_email - 新邮箱地址
 */
export function verifyChangeEmail(data) {
  return request({
    url: '/auth/change-email/verify',
    method: 'POST',
    data
  })
}

/**
 * 检查修改邮箱验证链接
 * @param {string} token - 验证 token
 */
export function checkChangeEmailToken(token) {
  return request({
    url: '/auth/change-email/check',
    method: 'GET',
    data: { token }
  })
}

/**
 * 检查 SMTP 状态
 */
export function checkSmtpStatus() {
  return request({
    url: '/auth/smtp-status',
    method: 'GET'
  })
}

/**
 * 验证 Token 有效性
 * @param {Object} params - 参数
 * @param {string} params.token - 验证 token
 * @param {string} [params.type] - 验证类型
 */
export function verifyToken(params) {
  return request({
    url: '/auth/verify',
    method: 'GET',
    data: params
  })
}

// ==================== 兼容旧版本的别名导出 ====================

/**
 * 发送修改邮箱验证邮件（别名，兼容旧代码）
 * @deprecated 请使用 sendChangeEmailVerification
 */
export const sendChangeEmailCode = sendChangeEmailVerification


// ==================== OAuth 第三方登录相关 ====================

/**
 * 获取 GitHub OAuth 状态
 * @returns {Promise<{enabled: boolean}>}
 */
export function getGithubStatus() {
  return request({
    url: '/auth/github/status',
    method: 'GET'
  })
}

/**
 * 获取 Google OAuth 状态
 * @returns {Promise<{enabled: boolean}>}
 */
export function getGoogleStatus() {
  return request({
    url: '/auth/google/status',
    method: 'GET'
  })
}

/**
 * 获取 NodeLoc OAuth 状态
 * @returns {Promise<{enabled: boolean}>}
 */
export function getNodelocStatus() {
  return request({
    url: '/auth/nodeloc/status',
    method: 'GET'
  })
}

/**
 * 获取 OAuth 可绑定状态
 * 返回各 provider 的启用状态和当前用户的绑定状态
 * @returns {Promise<{github: {enabled: boolean, bound: boolean}, google: {enabled: boolean, bound: boolean}, nodeloc: {enabled: boolean, bound: boolean}}>}
 */
export function getOAuthBindable() {
  return request({
    url: '/auth/oauth/bindable',
    method: 'GET'
  })
}

/**
 * 获取 OAuth 授权 URL
 * @param {string} provider - OAuth 提供商 (github/google/nodeloc)
 * @returns {Promise<{url: string}>}
 */
export function getOAuthAuthUrl(provider) {
  return request({
    url: `/auth/${provider}`,
    method: 'GET'
  })
}

/**
 * 绑定 OAuth 账号
 * @param {string} provider - OAuth 提供商 (github/google/nodeloc)
 * @returns {Promise<{url: string}>}
 */
export function bindOAuth(provider) {
  return request({
    url: `/auth/oauth/bind/${provider}`,
    method: 'GET'
  })
}

/**
 * 解绑 OAuth 账号
 * @param {string} provider - OAuth 提供商 (github/google/nodeloc)
 * @returns {Promise}
 */
export function unbindOAuth(provider) {
  return request({
    url: `/auth/oauth/unbind/${provider}`,
    method: 'POST'
  })
}
