/**
 * 域名管理 API
 * 根据 user.md 文档更新
 */
import request from '@/utils/request.js'

/**
 * 获取可用主域名列表（无需认证）
 */
export function getAvailableDomains() {
  return request({
    url: '/domains',
    method: 'GET'
  })
}

/**
 * 检查域名前缀是否可用
 * @param {number} domainId - 主域名 ID
 * @param {string} name - 域名前缀
 */
export function checkDomainAvailable(domainId, name) {
  return request({
    url: `/domains/${domainId}/check`,
    method: 'GET',
    data: { name }
  })
}

/**
 * 获取域名下的套餐
 * @param {number} domainId - 主域名 ID
 */
export function getDomainPlans(domainId) {
  return request({
    url: `/domains/${domainId}/plans`,
    method: 'GET'
  })
}

/**
 * 获取用户的二级域名列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.per_page=10] - 每页数量
 * @param {number} [params.domain_id] - 按主域名 ID 筛选
 */
export function getMySubdomains(params = {}) {
  return request({
    url: '/subdomains',
    method: 'GET',
    data: params
  })
}

/**
 * 获取二级域名详情
 * @param {number} subdomainId - 二级域名 ID
 */
export function getSubdomainDetail(subdomainId) {
  return request({
    url: `/subdomains/${subdomainId}`,
    method: 'GET'
  })
}

/**
 * 删除二级域名
 * @param {number} subdomainId - 二级域名 ID
 * @param {Object} [params] - 参数
 * @param {string} [params.totp_code] - 2FA 验证码（启用 2FA 时需要）
 */
export function deleteSubdomain(subdomainId, params = {}) {
  return request({
    url: `/subdomains/${subdomainId}`,
    method: 'DELETE',
    data: params
  })
}

/**
 * 购买域名
 * @param {Object} data - 购买参数
 * @param {number} data.plan_id - 套餐 ID
 * @param {string} data.name - 二级域名前缀
 * @param {number} [data.domain_id] - 域名ID（多域名套餐时）
 * @param {string} [data.coupon_code] - 优惠码
 */
export function purchaseDomain(data) {
  return request({
    url: '/purchase',
    method: 'POST',
    data
  })
}

/**
 * 续费域名
 * @param {number} subdomainId - 二级域名 ID
 * @param {Object} data - 续费参数
 * @param {number} data.plan_id - 续费套餐 ID
 */
export function renewSubdomain(subdomainId, data) {
  return request({
    url: `/subdomains/${subdomainId}/renew`,
    method: 'POST',
    data
  })
}

/**
 * 获取续费套餐
 * @param {number} subdomainId - 二级域名 ID
 */
export function getRenewPlans(subdomainId) {
  return request({
    url: `/subdomains/${subdomainId}/renew-plans`,
    method: 'GET'
  })
}

/**
 * 修改 NS 服务器
 * @param {number} subdomainId - 二级域名 ID
 * @param {Object} data - 参数
 * @param {Array} data.ns_servers - NS 服务器列表 (1-10个)
 */
export function updateNsServers(subdomainId, data) {
  return request({
    url: `/subdomains/${subdomainId}/ns`,
    method: 'PUT',
    data
  })
}

/**
 * 重置 NS 为默认
 * @param {number} subdomainId - 二级域名 ID
 */
export function resetNsToDefault(subdomainId) {
  return request({
    url: `/subdomains/${subdomainId}/ns/reset`,
    method: 'POST'
  })
}

/**
 * 切换自动续费
 * @param {number} subdomainId - 二级域名 ID
 * @param {Object} data - 参数
 * @param {boolean} data.auto_renew - 是否开启自动续费
 */
export function toggleAutoRenew(subdomainId, data) {
  return request({
    url: `/subdomains/${subdomainId}/auto-renew`,
    method: 'PUT',
    data
  })
}

// ==================== 兼容旧版本的别名导出 ====================

/**
 * 获取可用主域名列表（别名，兼容旧代码）
 * @deprecated 请使用 getAvailableDomains
 */
export const getDomains = getAvailableDomains

/**
 * 获取用户的二级域名列表（别名，兼容旧代码）
 * @deprecated 请使用 getMySubdomains
 */
export const getSubdomains = getMySubdomains

/**
 * 续费域名（别名，兼容旧代码）
 * @deprecated 请使用 renewSubdomain
 */
export const renewDomain = renewSubdomain

/**
 * 重置 NS 为 Cloudflare（别名，兼容旧代码）
 * @deprecated 请使用 resetNsToDefault
 */
export const resetNsToCloudflare = resetNsToDefault
