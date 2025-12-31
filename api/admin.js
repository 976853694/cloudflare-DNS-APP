/**
 * 管理后台 API
 * 根据 admin.md 文档更新
 */
import request from '@/utils/request.js'

// ==================== 统计模块 ====================

/**
 * 获取系统统计数据
 */
export function getAdminStats() {
  return request({
    url: '/admin/stats',
    method: 'GET'
  })
}

/**
 * 检查版本更新
 */
export function checkUpdate() {
  return request({
    url: '/admin/check-update',
    method: 'GET'
  })
}

// ==================== 图表数据模块 ====================

/**
 * 获取概览图表数据
 * @param {Object} [params] - 查询参数
 * @param {number} [params.days=7] - 天数
 */
export function getChartsOverview(params = {}) {
  return request({
    url: '/admin/charts/overview',
    method: 'GET',
    data: params
  })
}

/**
 * 获取用户分布数据
 */
export function getUserDistribution() {
  return request({
    url: '/admin/charts/user-distribution',
    method: 'GET'
  })
}

/**
 * 获取域名统计数据
 */
export function getSubdomainStats() {
  return request({
    url: '/admin/charts/subdomain-stats',
    method: 'GET'
  })
}

/**
 * 获取收入统计数据
 * @param {Object} [params] - 查询参数
 * @param {number} [params.days=30] - 天数
 */
export function getIncomeStats(params = {}) {
  return request({
    url: '/admin/charts/income-stats',
    method: 'GET',
    data: params
  })
}

/**
 * 获取活动统计
 * @param {Object} [params] - 查询参数
 * @param {number} [params.days=7] - 天数
 */
export function getActivityStats(params = {}) {
  return request({
    url: '/admin/charts/activity',
    method: 'GET',
    data: params
  })
}

// ==================== 用户管理模块 ====================

/**
 * 获取用户列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.per_page=20] - 每页数量
 * @param {string} [params.search] - 搜索关键词
 * @param {number} [params.status] - 用户状态筛选
 */
export function getAdminUsers(params = {}) {
  return request({
    url: '/admin/users',
    method: 'GET',
    data: params
  })
}

/**
 * 获取用户详情
 * @param {number} userId - 用户 ID
 */
export function getAdminUser(userId) {
  return request({
    url: `/admin/users/${userId}`,
    method: 'GET'
  })
}

/**
 * 更新用户信息
 * @param {number} userId - 用户 ID
 * @param {Object} data - 用户数据
 */
export function updateAdminUser(userId, data) {
  return request({
    url: `/admin/users/${userId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除用户
 * @param {number} userId - 用户 ID
 */
export function deleteAdminUser(userId) {
  return request({
    url: `/admin/users/${userId}`,
    method: 'DELETE'
  })
}

/**
 * 解绑用户 OAuth 账号
 * @param {number} userId - 用户 ID
 * @param {string} provider - OAuth 提供商 (github/google/nodeloc)
 */
export function unbindUserOAuth(userId, provider) {
  return request({
    url: `/admin/users/${userId}/oauth/${provider}`,
    method: 'DELETE'
  })
}

// ==================== 主域名管理模块 ====================

/**
 * 获取所有主域名
 */
export function getAdminDomains() {
  return request({
    url: '/admin/domains',
    method: 'GET'
  })
}

/**
 * 添加主域名
 * @param {Object} data - 域名数据
 * @param {number} data.dns_channel_id - DNS 渠道 ID
 * @param {string} data.name - 域名
 * @param {string} data.zone_id - Zone ID
 * @param {boolean} [data.allow_register=true] - 是否开放注册
 * @param {string} [data.description] - 域名描述
 */
export function addAdminDomain(data) {
  return request({
    url: '/admin/domains',
    method: 'POST',
    data
  })
}

/**
 * 更新主域名
 * @param {number} domainId - 域名 ID
 * @param {Object} data - 域名数据
 * @param {boolean} [data.allow_register] - 是否开放注册
 * @param {number} [data.status] - 状态
 * @param {string} [data.description] - 域名描述
 * @param {string} [data.zone_id] - Zone ID
 * @param {number} [data.dns_channel_id] - DNS 渠道 ID
 */
export function updateAdminDomain(domainId, data) {
  return request({
    url: `/admin/domains/${domainId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除主域名
 * @param {number} domainId - 域名 ID
 */
export function deleteAdminDomain(domainId) {
  return request({
    url: `/admin/domains/${domainId}`,
    method: 'DELETE'
  })
}

/**
 * 获取域名 DNS 服务能力
 * @param {number} domainId - 域名 ID
 */
export function getDomainCapabilities(domainId) {
  return request({
    url: `/admin/domains/${domainId}/capabilities`,
    method: 'GET'
  })
}

// ==================== 渠道管理模块 ====================

/**
 * 获取渠道列表
 */
export function getChannels() {
  return request({
    url: '/admin/channels',
    method: 'GET'
  })
}

/**
 * 获取支持的服务商列表
 */
export function getChannelProviders() {
  return request({
    url: '/admin/channels/providers',
    method: 'GET'
  })
}

/**
 * 创建渠道
 * @param {Object} data - 渠道数据
 * @param {string} data.name - 渠道名称
 * @param {string} data.provider_type - 服务商类型
 * @param {Object} data.credentials - 凭据信息
 * @param {string} [data.remark] - 备注
 * @param {Object} [data.config] - 额外配置
 */
export function createChannel(data) {
  return request({
    url: '/admin/channels',
    method: 'POST',
    data
  })
}

/**
 * 获取渠道详情
 * @param {number} channelId - 渠道 ID
 */
export function getChannel(channelId) {
  return request({
    url: `/admin/channels/${channelId}`,
    method: 'GET'
  })
}

/**
 * 更新渠道
 * @param {number} channelId - 渠道 ID
 * @param {Object} data - 渠道数据
 */
export function updateChannel(channelId, data) {
  return request({
    url: `/admin/channels/${channelId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除渠道
 * @param {number} channelId - 渠道 ID
 */
export function deleteChannel(channelId) {
  return request({
    url: `/admin/channels/${channelId}`,
    method: 'DELETE'
  })
}

/**
 * 验证渠道凭据
 * @param {number} channelId - 渠道 ID
 */
export function verifyChannel(channelId) {
  return request({
    url: `/admin/channels/${channelId}/verify`,
    method: 'POST'
  })
}

/**
 * 获取渠道的域名列表（Zone）
 * @param {number} channelId - 渠道 ID
 * @param {Object} [params] - 查询参数
 * @param {string} [params.keyword] - 搜索关键词
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.page_size=20] - 每页数量
 */
export function getChannelZones(channelId, params = {}) {
  return request({
    url: `/admin/channels/${channelId}/zones`,
    method: 'GET',
    data: params
  })
}

/**
 * 获取渠道能力
 * @param {number} channelId - 渠道 ID
 */
export function getChannelCapabilities(channelId) {
  return request({
    url: `/admin/channels/${channelId}/capabilities`,
    method: 'GET'
  })
}

// ==================== Cloudflare 账户管理模块（兼容旧版本） ====================

/**
 * 获取 CF 账户列表
 */
export function getCfAccounts() {
  return request({
    url: '/admin/cf-accounts',
    method: 'GET'
  })
}

/**
 * 添加 CF 账户
 * @param {Object} data - 账户数据
 * @param {string} data.name - 账户名称
 * @param {string} data.email - Cloudflare 邮箱
 * @param {string} data.auth_type - 认证方式 (api_key/api_token)
 * @param {string} [data.api_key] - Global API Key
 * @param {string} [data.api_token] - API Token
 */
export function addCfAccount(data) {
  return request({
    url: '/admin/cf-accounts',
    method: 'POST',
    data
  })
}

/**
 * 更新 CF 账户
 * @param {number} accountId - 账户 ID
 * @param {Object} data - 账户数据
 */
export function updateCfAccount(accountId, data) {
  return request({
    url: `/admin/cf-accounts/${accountId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除 CF 账户
 * @param {number} accountId - 账户 ID
 */
export function deleteCfAccount(accountId) {
  return request({
    url: `/admin/cf-accounts/${accountId}`,
    method: 'DELETE'
  })
}

/**
 * 获取 CF 账户的 Zone 列表
 * @param {number} accountId - 账户 ID
 */
export function getCfAccountZones(accountId) {
  return request({
    url: `/admin/cf-accounts/${accountId}/zones`,
    method: 'GET'
  })
}

// ==================== 套餐管理模块 ====================

/**
 * 获取套餐列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.domain_id] - 筛选域名
 */
export function getAdminPlans(params = {}) {
  return request({
    url: '/admin/plans',
    method: 'GET',
    data: params
  })
}

/**
 * 创建套餐
 * @param {Object} data - 套餐数据
 */
export function addAdminPlan(data) {
  return request({
    url: '/admin/plans',
    method: 'POST',
    data
  })
}

/**
 * 更新套餐
 * @param {number} planId - 套餐 ID
 * @param {Object} data - 套餐数据
 */
export function updateAdminPlan(planId, data) {
  return request({
    url: `/admin/plans/${planId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除套餐
 * @param {number} planId - 套餐 ID
 */
export function deleteAdminPlan(planId) {
  return request({
    url: `/admin/plans/${planId}`,
    method: 'DELETE'
  })
}


// ==================== 卡密管理模块 ====================

/**
 * 获取卡密列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.per_page] - 每页数量
 * @param {number} [params.status] - 状态 (0未使用/1已使用/2已禁用)
 * @param {string} [params.batch_no] - 批次号
 * @param {string} [params.search] - 搜索卡密码
 */
export function getRedeemCodes(params = {}) {
  return request({
    url: '/admin/redeem-codes',
    method: 'GET',
    data: params
  })
}

/**
 * 批量生成卡密
 * @param {Object} data - 生成参数
 * @param {number} data.amount - 充值金额 (-1为无限余额)
 * @param {number} [data.count=1] - 生成数量 (1-100)
 * @param {number} [data.expires_days] - 过期天数
 */
export function generateRedeemCodes(data) {
  return request({
    url: '/admin/redeem-codes/generate',
    method: 'POST',
    data
  })
}

/**
 * 更新卡密状态
 * @param {number} codeId - 卡密 ID
 * @param {Object} data - 更新数据
 * @param {number} [data.status] - 状态 (0未使用/2禁用)
 */
export function updateRedeemCode(codeId, data) {
  return request({
    url: `/admin/redeem-codes/${codeId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除卡密
 * @param {number} codeId - 卡密 ID
 */
export function deleteRedeemCode(codeId) {
  return request({
    url: `/admin/redeem-codes/${codeId}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除卡密
 * @param {Object} data - 删除参数
 * @param {string} [data.batch_no] - 按批次号删除
 * @param {Array} [data.ids] - 按 ID 列表删除
 */
export function batchDeleteRedeemCodes(data) {
  return request({
    url: '/admin/redeem-codes/batch-delete',
    method: 'POST',
    data
  })
}

/**
 * 导出卡密
 * @param {Object} [params] - 查询参数
 * @param {string} [params.batch_no] - 批次号
 * @param {number} [params.status] - 状态
 */
export function exportRedeemCodes(params = {}) {
  return request({
    url: '/admin/redeem-codes/export',
    method: 'GET',
    data: params
  })
}

// ==================== 优惠券管理模块 ====================

/**
 * 获取优惠券列表
 * @param {Object} [params] - 查询参数
 */
export function getCoupons(params = {}) {
  return request({
    url: '/admin/coupons',
    method: 'GET',
    data: params
  })
}

/**
 * 创建优惠券
 * @param {Object} data - 优惠券数据
 */
export function createCoupon(data) {
  return request({
    url: '/admin/coupons',
    method: 'POST',
    data
  })
}

/**
 * 更新优惠券
 * @param {number} couponId - 优惠券 ID
 * @param {Object} data - 优惠券数据
 */
export function updateCoupon(couponId, data) {
  return request({
    url: `/admin/coupons/${couponId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除优惠券
 * @param {number} couponId - 优惠券 ID
 */
export function deleteCoupon(couponId) {
  return request({
    url: `/admin/coupons/${couponId}`,
    method: 'DELETE'
  })
}

/**
 * 获取优惠券使用记录
 * @param {number} couponId - 优惠券 ID
 */
export function getCouponUsages(couponId) {
  return request({
    url: `/admin/coupons/${couponId}/usages`,
    method: 'GET'
  })
}


// ==================== 订单管理模块 ====================

/**
 * 获取购买记录列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.per_page=20] - 每页数量
 * @param {number} [params.user_id] - 按用户 ID 筛选
 * @param {string} [params.search] - 搜索 (域名/套餐名)
 */
export function getAdminOrders(params = {}) {
  return request({
    url: '/admin/purchase-records',
    method: 'GET',
    data: params
  })
}

/**
 * 删除购买记录
 * @param {number} recordId - 记录 ID
 */
export function deleteAdminOrder(recordId) {
  return request({
    url: `/admin/purchase-records/${recordId}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除购买记录
 * @param {Array} ids - 记录 ID 数组
 */
export function batchDeleteAdminOrders(ids) {
  return request({
    url: '/admin/purchase-records/batch-delete',
    method: 'POST',
    data: { ids }
  })
}

// ==================== DNS 记录管理模块 ====================

/**
 * 获取所有 DNS 记录
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.per_page] - 每页数量
 * @param {number} [params.domain_id] - 筛选主域名
 * @param {string} [params.type] - 记录类型
 * @param {string} [params.source] - 来源 (system/provider)
 * @param {string} [params.search] - 搜索
 */
export function getAdminDnsRecords(params = {}) {
  return request({
    url: '/admin/dns-records',
    method: 'GET',
    data: params
  })
}

/**
 * 创建 DNS 记录
 * @param {Object} data - 记录数据
 * @param {number} data.domain_id - 域名 ID
 * @param {string} [data.name] - 记录名称
 * @param {string} data.type - 记录类型
 * @param {string} data.content - 记录值
 * @param {number} [data.ttl] - TTL
 * @param {boolean} [data.proxied] - 是否代理
 * @param {string} [data.line] - 线路
 * @param {number} [data.weight] - 权重
 * @param {number} [data.priority] - 优先级
 */
export function createAdminDnsRecord(data) {
  return request({
    url: '/admin/dns-records',
    method: 'POST',
    data
  })
}

/**
 * 更新 DNS 记录
 * @param {number} recordId - 记录 ID
 * @param {Object} data - 记录数据
 * @param {number} data.domain_id - 域名 ID
 * @param {string} [data.name] - 记录名称
 * @param {string} [data.type] - 记录类型
 * @param {string} [data.content] - 记录值
 * @param {number} [data.ttl] - TTL
 * @param {boolean} [data.proxied] - 是否代理
 * @param {string} [data.line] - 线路
 * @param {number} [data.weight] - 权重
 */
export function updateAdminDnsRecord(recordId, data) {
  return request({
    url: `/admin/dns-records/${recordId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除 DNS 记录
 * @param {number} recordId - 记录 ID
 * @param {Object} [params] - 查询参数
 * @param {number} params.domain_id - 域名 ID
 */
export function deleteAdminDnsRecord(recordId, params = {}) {
  return request({
    url: `/admin/dns-records/${recordId}`,
    method: 'DELETE',
    data: params
  })
}

// ==================== 公告管理模块 ====================

/**
 * 获取公告列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.per_page] - 每页数量
 * @param {number} [params.status] - 状态筛选
 */
export function getAdminAnnouncements(params = {}) {
  return request({
    url: '/admin/announcements',
    method: 'GET',
    data: params
  })
}

/**
 * 创建公告
 * @param {Object} data - 公告数据
 * @param {string} data.title - 标题
 * @param {string} data.content - 内容
 * @param {string} [data.type='info'] - 类型 (info/warning/success/error)
 * @param {boolean} [data.is_pinned=false] - 是否置顶
 * @param {boolean} [data.is_popup=false] - 是否弹窗显示
 * @param {number} [data.status=1] - 状态 (0草稿/1发布)
 */
export function createAdminAnnouncement(data) {
  return request({
    url: '/admin/announcements',
    method: 'POST',
    data
  })
}

/**
 * 更新公告
 * @param {number} id - 公告 ID
 * @param {Object} data - 公告数据
 */
export function updateAdminAnnouncement(id, data) {
  return request({
    url: `/admin/announcements/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除公告
 * @param {number} id - 公告 ID
 */
export function deleteAdminAnnouncement(id) {
  return request({
    url: `/admin/announcements/${id}`,
    method: 'DELETE'
  })
}


// ==================== 系统设置模块 ====================

/**
 * 获取系统设置
 */
export function getAdminSettings() {
  return request({
    url: '/admin/settings',
    method: 'GET'
  })
}

/**
 * 更新系统设置
 * @param {Object} data - 设置数据
 */
export function updateAdminSettings(data) {
  return request({
    url: '/admin/settings',
    method: 'PUT',
    data
  })
}

/**
 * 测试 SMTP 配置
 * @param {string} email - 测试邮箱
 */
export function testSmtp(email) {
  return request({
    url: '/admin/settings/test-smtp',
    method: 'POST',
    data: { email }
  })
}

// ==================== 操作日志模块 ====================

/**
 * 获取操作日志
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.per_page] - 每页数量
 * @param {string} [params.action] - 操作类型筛选
 */
export function getAdminLogs(params = {}) {
  return request({
    url: '/admin/logs',
    method: 'GET',
    data: params
  })
}

/**
 * 删除单条日志
 * @param {number} logId - 日志 ID
 */
export function deleteAdminLog(logId) {
  return request({
    url: `/admin/logs/${logId}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除日志
 * @param {Object} data - 删除参数
 * @param {Array} [data.ids] - 日志 ID 数组
 * @param {boolean} [data.clear_all] - 是否清空所有日志
 */
export function batchDeleteAdminLogs(data) {
  return request({
    url: '/admin/logs/batch-delete',
    method: 'POST',
    data
  })
}

// ==================== 用户域名（二级域名）管理模块 ====================

/**
 * 获取所有二级域名
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.per_page] - 每页数量
 * @param {number} [params.user_id] - 按用户筛选
 * @param {number} [params.domain_id] - 按主域名筛选
 * @param {number} [params.status] - 状态筛选
 * @param {string} [params.search] - 搜索域名
 * @param {string} [params.expired] - 是否过期 (1=已过期/0=未过期)
 */
export function getAdminSubdomains(params = {}) {
  return request({
    url: '/admin/subdomains',
    method: 'GET',
    data: params
  })
}

/**
 * 获取二级域名详情
 * @param {number} subdomainId - 二级域名 ID
 */
export function getAdminSubdomain(subdomainId) {
  return request({
    url: `/admin/subdomains/${subdomainId}`,
    method: 'GET'
  })
}

/**
 * 更新二级域名
 * @param {number} subdomainId - 二级域名 ID
 * @param {Object} data - 更新数据
 * @param {number} [data.status] - 状态 (0禁用/1正常/2待审核)
 * @param {string} [data.expires_at] - 到期时间 (ISO格式)
 * @param {number} [data.extend_days] - 延期天数
 */
export function updateAdminSubdomain(subdomainId, data) {
  return request({
    url: `/admin/subdomains/${subdomainId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除二级域名
 * @param {number} subdomainId - 二级域名 ID
 */
export function deleteAdminSubdomain(subdomainId) {
  return request({
    url: `/admin/subdomains/${subdomainId}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除二级域名
 * @param {Array} ids - 域名 ID 数组
 */
export function batchDeleteAdminSubdomains(ids) {
  return request({
    url: '/admin/subdomains/batch-delete',
    method: 'POST',
    data: { ids }
  })
}

/**
 * 批量更新二级域名
 * @param {Object} data - 更新数据
 * @param {Array} data.ids - 域名 ID 数组
 * @param {number} [data.status] - 状态
 * @param {number} [data.extend_days] - 延期天数
 */
export function batchUpdateAdminSubdomains(data) {
  return request({
    url: '/admin/subdomains/batch-update',
    method: 'POST',
    data
  })
}

/**
 * 发送到期提醒邮件
 * @param {number} subdomainId - 二级域名 ID
 */
export function sendSubdomainExpiryEmail(subdomainId) {
  return request({
    url: `/admin/subdomains/${subdomainId}/send-expiry-email`,
    method: 'POST'
  })
}

/**
 * 清理域名 DNS 记录
 * @param {number} subdomainId - 二级域名 ID
 */
export function clearSubdomainDns(subdomainId) {
  return request({
    url: `/admin/subdomains/${subdomainId}/clear-dns`,
    method: 'POST'
  })
}

/**
 * 获取二级域名 NS 信息
 * @param {number} subdomainId - 二级域名 ID
 */
export function getSubdomainNs(subdomainId) {
  return request({
    url: `/admin/subdomains/${subdomainId}/ns`,
    method: 'GET'
  })
}

/**
 * 更新二级域名 NS
 * @param {number} subdomainId - 二级域名 ID
 * @param {Object} data - NS 数据
 * @param {Array} [data.ns_servers] - NS 服务器列表
 */
export function updateSubdomainNs(subdomainId, data) {
  return request({
    url: `/admin/subdomains/${subdomainId}/ns`,
    method: 'PUT',
    data
  })
}

/**
 * 重置二级域名 NS
 * @param {number} subdomainId - 二级域名 ID
 */
export function resetSubdomainNs(subdomainId) {
  return request({
    url: `/admin/subdomains/${subdomainId}/ns`,
    method: 'DELETE'
  })
}


// ==================== IP 黑名单管理模块 ====================

/**
 * 获取 IP 黑名单列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.per_page] - 每页数量
 * @param {string} [params.search] - 搜索 IP
 */
export function getIpBlacklist(params = {}) {
  return request({
    url: '/admin/ip-blacklist',
    method: 'GET',
    data: params
  })
}

/**
 * 添加 IP 到黑名单
 * @param {Object} data - 黑名单数据
 * @param {string} data.ip_address - IP 地址
 * @param {string} [data.reason] - 封禁原因
 * @param {number} [data.duration_days] - 封禁天数 (不填为永久)
 */
export function addIpToBlacklist(data) {
  return request({
    url: '/admin/ip-blacklist',
    method: 'POST',
    data
  })
}

/**
 * 从黑名单移除 IP
 * @param {number} id - 黑名单记录 ID
 */
export function removeIpFromBlacklist(id) {
  return request({
    url: `/admin/ip-blacklist/${id}`,
    method: 'DELETE'
  })
}

/**
 * 检查 IP 是否被封禁
 * @param {string} ip - IP 地址
 */
export function checkIpBlacklist(ip) {
  return request({
    url: '/admin/ip-blacklist/check',
    method: 'GET',
    data: { ip }
  })
}

// ==================== 数据导入导出模块 ====================

/**
 * 批量导入用户
 * @param {Object} data - 导入数据
 * @param {string} data.csv_content - CSV 数据内容
 * @param {string} [data.default_password='123456'] - 默认密码
 */
export function importUsers(data) {
  return request({
    url: '/admin/import/users',
    method: 'POST',
    data
  })
}

/**
 * 批量导入卡密
 * @param {Object} data - 导入数据
 * @param {string} data.csv_content - CSV 数据内容
 */
export function importRedeemCodes(data) {
  return request({
    url: '/admin/import/redeem-codes',
    method: 'POST',
    data
  })
}

/**
 * 导出用户 CSV
 */
export function exportUsers() {
  return request({
    url: '/admin/export/users',
    method: 'GET'
  })
}

/**
 * 导出二级域名 CSV
 */
export function exportSubdomains() {
  return request({
    url: '/admin/export/subdomains',
    method: 'GET'
  })
}

// ==================== 授权管理模块 ====================

/**
 * 获取授权详情
 */
export function getLicense() {
  return request({
    url: '/admin/license',
    method: 'GET'
  })
}

/**
 * 清除本地授权
 */
export function clearLicense() {
  return request({
    url: '/admin/license',
    method: 'DELETE'
  })
}

/**
 * 手动验证授权
 */
export function verifyLicense() {
  return request({
    url: '/admin/license/verify',
    method: 'POST'
  })
}

/**
 * 获取授权配置说明
 */
export function getLicenseConfig() {
  return request({
    url: '/admin/license/config',
    method: 'PUT'
  })
}

// ==================== 公共授权 API ====================

/**
 * 获取授权状态 (无需管理员权限)
 */
export function getLicenseStatus() {
  return request({
    url: '/license/status',
    method: 'GET'
  })
}

/**
 * 激活授权 (无需管理员权限)
 * @param {Object} data - 激活数据
 * @param {string} data.license_key - 授权码
 */
export function activateLicense(data) {
  return request({
    url: '/license/activate',
    method: 'POST',
    data
  })
}

/**
 * 获取机器码 (无需管理员权限)
 */
export function getMachineCode() {
  return request({
    url: '/license/machine-code',
    method: 'GET'
  })
}

/**
 * 清除本地授权 (测试用，无需管理员权限)
 */
export function clearLocalLicense() {
  return request({
    url: '/license/clear',
    method: 'POST'
  })
}

// ==================== 邮件模板管理模块 ====================

/**
 * 获取所有邮件模板
 */
export function getEmailTemplates() {
  return request({
    url: '/admin/email-templates',
    method: 'GET'
  })
}

/**
 * 获取单个邮件模板
 * @param {string} code - 模板代码
 */
export function getEmailTemplate(code) {
  return request({
    url: `/admin/email-templates/${code}`,
    method: 'GET'
  })
}

/**
 * 更新邮件模板
 * @param {string} code - 模板代码
 * @param {Object} data - 模板数据
 * @param {string} [data.subject] - 邮件主题
 * @param {string} [data.content] - 邮件内容
 * @param {number} [data.status] - 状态
 */
export function updateEmailTemplate(code, data) {
  return request({
    url: `/admin/email-templates/${code}`,
    method: 'PUT',
    data
  })
}

/**
 * 重置邮件模板为默认
 * @param {string} code - 模板代码
 */
export function resetEmailTemplate(code) {
  return request({
    url: `/admin/email-templates/${code}/reset`,
    method: 'POST'
  })
}

/**
 * 预览邮件模板
 * @param {string} code - 模板代码
 * @param {Object} data - 预览数据
 * @param {string} data.subject - 邮件主题
 * @param {string} data.content - 邮件内容
 */
export function previewEmailTemplate(code, data) {
  return request({
    url: `/admin/email-templates/${code}/preview`,
    method: 'POST',
    data
  })
}

/**
 * 发送测试邮件
 * @param {string} code - 模板代码
 */
export function testEmailTemplate(code) {
  return request({
    url: `/admin/email-templates/${code}/test`,
    method: 'POST'
  })
}


// ==================== APP 版本管理模块 ====================

/**
 * 获取版本列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.per_page=10] - 每页数量
 * @param {string} [params.platform] - 平台筛选 (android/ios)
 */
export function getAppVersions(params = {}) {
  return request({
    url: '/admin/app-versions',
    method: 'GET',
    data: params
  })
}

/**
 * 创建新版本
 * @param {Object} data - 版本数据
 * @param {string} data.platform - 平台 (android/ios)
 * @param {string} data.version - 版本号 (如1.0.0)
 * @param {number} data.build - 构建号
 * @param {string} data.download_url - 下载地址
 * @param {string} [data.file_size] - 文件大小
 * @param {string} [data.update_log] - 更新日志
 * @param {boolean} [data.force_update=false] - 是否强制更新
 * @param {string} [data.min_version] - 最低支持版本
 * @param {boolean} [data.status=true] - 是否发布
 */
export function createAppVersion(data) {
  return request({
    url: '/admin/app-versions',
    method: 'POST',
    data
  })
}

/**
 * 获取版本详情
 * @param {number} versionId - 版本 ID
 */
export function getAppVersion(versionId) {
  return request({
    url: `/admin/app-versions/${versionId}`,
    method: 'GET'
  })
}

/**
 * 更新版本
 * @param {number} versionId - 版本 ID
 * @param {Object} data - 版本数据
 * @param {string} [data.download_url] - 下载地址
 * @param {string} [data.file_size] - 文件大小
 * @param {string} [data.update_log] - 更新日志
 * @param {boolean} [data.force_update] - 是否强制更新
 * @param {string} [data.min_version] - 最低支持版本
 * @param {number} [data.status] - 状态 (0禁用/1启用)
 */
export function updateAppVersion(versionId, data) {
  return request({
    url: `/admin/app-versions/${versionId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除版本
 * @param {number} versionId - 版本 ID
 */
export function deleteAppVersion(versionId) {
  return request({
    url: `/admin/app-versions/${versionId}`,
    method: 'DELETE'
  })
}
