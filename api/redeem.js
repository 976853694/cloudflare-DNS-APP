/**
 * 卡密充值 API
 * 根据 user.md 文档更新
 */
import request from '@/utils/request.js'

/**
 * 验证卡密（查询卡密信息，不使用）
 * @param {Object} data - 参数
 * @param {string} data.code - 卡密码
 */
export function verifyRedeemCode(data) {
  return request({
    url: '/redeem/verify',
    method: 'POST',
    data
  })
}

/**
 * 使用卡密充值
 * @param {Object} data - 参数
 * @param {string} data.code - 卡密码
 */
export function useRedeemCode(data) {
  return request({
    url: '/redeem',
    method: 'POST',
    data
  })
}

// ==================== 兼容旧版本的别名导出 ====================

/**
 * 使用卡密充值（别名，兼容旧代码）
 * @deprecated 请使用 useRedeemCode
 */
export const redeemCode = useRedeemCode
