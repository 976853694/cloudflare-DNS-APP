/**
 * DNS 记录管理 API
 * 根据 user.md 文档更新
 */
import request from '@/utils/request.js'

/**
 * 获取 DNS 记录列表
 * @param {number} subdomainId - 二级域名 ID
 */
export function getDnsRecords(subdomainId) {
  return request({
    url: `/subdomains/${subdomainId}/records`,
    method: 'GET'
  })
}

/**
 * 获取 DNS 服务能力
 * @param {number} subdomainId - 二级域名 ID
 */
export function getDnsCapabilities(subdomainId) {
  return request({
    url: `/subdomains/${subdomainId}/capabilities`,
    method: 'GET'
  })
}

/**
 * 添加 DNS 记录
 * @param {number} subdomainId - 二级域名 ID
 * @param {Object} data - 记录数据
 * @param {string} data.type - 记录类型 (A, AAAA, CNAME, TXT, MX, NS)
 * @param {string} [data.name='@'] - 名称前缀
 * @param {string} data.content - 记录值
 * @param {number} [data.ttl] - TTL（根据服务商不同）
 * @param {boolean} [data.proxied=false] - 是否开启代理（仅 Cloudflare 支持）
 * @param {number} [data.priority] - 优先级 (MX 记录需要)
 * @param {string} [data.line] - 线路（阿里云/DNSPod/华为云等支持）
 * @param {number} [data.weight] - 权重（部分服务商支持）
 */
export function addDnsRecord(subdomainId, data) {
  return request({
    url: `/subdomains/${subdomainId}/records`,
    method: 'POST',
    data
  })
}

/**
 * 更新 DNS 记录
 * @param {number} recordId - DNS 记录 ID
 * @param {Object} data - 记录数据
 * @param {string} [data.content] - 记录值
 * @param {number} [data.ttl] - TTL
 * @param {boolean} [data.proxied] - 是否代理（仅 Cloudflare 支持）
 * @param {string} [data.line] - 线路（部分服务商支持）
 * @param {number} [data.weight] - 权重（部分服务商支持）
 */
export function updateDnsRecord(recordId, data) {
  return request({
    url: `/records/${recordId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除 DNS 记录
 * @param {number} recordId - DNS 记录 ID
 */
export function deleteDnsRecord(recordId) {
  return request({
    url: `/records/${recordId}`,
    method: 'DELETE'
  })
}
