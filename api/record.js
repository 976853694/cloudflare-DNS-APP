/**
 * 购买记录 API
 * 根据 user.md 文档更新
 */
import request from '@/utils/request.js'

/**
 * 获取购买记录列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.per_page=20] - 每页数量
 */
export function getPurchaseRecords(params = {}) {
  return request({
    url: '/purchase-records',
    method: 'GET',
    data: params
  })
}
