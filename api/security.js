/**
 * 安全设置 API
 * 根据 user.md 文档更新
 */
import request from '@/utils/request.js'

// ==================== 2FA 双因素认证 ====================

/**
 * 初始化 2FA 设置（生成密钥和二维码）
 */
export function setup2FA() {
  return request({
    url: '/security/2fa/setup',
    method: 'POST'
  })
}

/**
 * 启用 2FA
 * @param {Object} data - 参数
 * @param {string} data.code - 验证码
 */
export function enable2FA(data) {
  return request({
    url: '/security/2fa/enable',
    method: 'POST',
    data
  })
}

/**
 * 禁用 2FA
 * @param {Object} data - 参数
 * @param {string} data.password - 账户密码
 * @param {string} data.code - 2FA 验证码
 */
export function disable2FA(data) {
  return request({
    url: '/security/2fa/disable',
    method: 'POST',
    data
  })
}

/**
 * 获取 2FA 状态
 */
export function get2FAStatus() {
  return request({
    url: '/security/2fa/status',
    method: 'GET'
  })
}

/**
 * 重新生成备用码
 * @param {Object} data - 参数
 * @param {string} data.code - 2FA 验证码
 */
export function regenerateBackupCodes(data) {
  return request({
    url: '/security/2fa/backup-codes',
    method: 'POST',
    data
  })
}

// ==================== IP 限制 ====================

/**
 * 获取 IP 限制设置
 */
export function getIpRestriction() {
  return request({
    url: '/security/ip-restriction',
    method: 'GET'
  })
}

/**
 * 更新 IP 限制设置
 * @param {Object} data - 参数
 * @param {Array} data.allowed_ips - 允许的 IP 列表
 */
export function updateIpRestriction(data) {
  return request({
    url: '/security/ip-restriction',
    method: 'PUT',
    data
  })
}

// ==================== 登录历史 ====================

/**
 * 获取登录历史
 */
export function getLoginHistory() {
  return request({
    url: '/security/sessions',
    method: 'GET'
  })
}

// ==================== API 密钥管理 ====================

/**
 * 获取 API 密钥信息
 */
export function getApiKeys() {
  return request({
    url: '/security/api-keys',
    method: 'GET'
  })
}

/**
 * 生成/重置 API 密钥
 * @param {Object} data - 参数
 * @param {string} [data.password] - 已有密钥时需要验证密码
 */
export function generateApiKeys(data = {}) {
  return request({
    url: '/security/api-keys/generate',
    method: 'POST',
    data
  })
}

/**
 * 启用/禁用 API
 * @param {Object} data - 参数
 * @param {boolean} [data.enabled] - 是否启用
 */
export function toggleApiKeys(data = {}) {
  return request({
    url: '/security/api-keys/toggle',
    method: 'POST',
    data
  })
}

/**
 * 更新 API IP 白名单
 * @param {Object} data - 参数
 * @param {Array} data.ip_whitelist - IP 地址列表
 */
export function updateApiWhitelist(data) {
  return request({
    url: '/security/api-keys/whitelist',
    method: 'PUT',
    data
  })
}

/**
 * 查看 API Secret
 * @param {Object} data - 参数
 * @param {string} data.password - 账户密码
 */
export function viewApiSecret(data) {
  return request({
    url: '/security/api-keys/secret',
    method: 'POST',
    data
  })
}
