/**
 * APP 更新相关 API
 * 根据 user.md 文档
 */
import request from '@/utils/request.js'

/**
 * 检查 APP 更新
 * @param {Object} params - 查询参数
 * @param {string} params.platform - 平台 (android/ios)
 * @param {string} params.version - 当前版本号 (如1.0.0)
 * @returns {Promise<{has_update: boolean, force_update?: boolean, latest_version?: string, download_url?: string, update_log?: string}>}
 */
export function checkAppUpdate(params) {
  return request({
    url: '/app/check-update',
    method: 'GET',
    data: params
  })
}

/**
 * 下载并记录（重定向到下载地址）
 * @param {number} versionId - 版本 ID
 */
export function downloadApp(versionId) {
  return request({
    url: `/app/download/${versionId}`,
    method: 'GET'
  })
}
