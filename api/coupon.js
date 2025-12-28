/**
 * 优惠券 API
 * 根据 user.md 文档更新
 */
import request from '@/utils/request.js'

/**
 * 验证优惠码
 * @param {Object} data - 参数
 * @param {string} data.code - 优惠码
 * @param {number} [data.plan_id] - 套餐 ID
 * @param {number} [data.price] - 原价
 */
export function validateCoupon(data) {
  return request({
    url: '/coupon/validate',
    method: 'POST',
    data
  })
}
