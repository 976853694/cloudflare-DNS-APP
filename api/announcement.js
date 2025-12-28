/**
 * 公告 API
 * 根据 user.md 文档更新
 */
import request from '@/utils/request.js'

/**
 * 获取公告列表（可选认证，登录后可获取已读状态）
 */
export function getAnnouncements() {
  return request({
    url: '/announcements',
    method: 'GET'
  })
}

/**
 * 获取未读公告
 */
export function getUnreadAnnouncements() {
  return request({
    url: '/announcements/unread',
    method: 'GET'
  })
}

/**
 * 标记公告为已读
 * @param {number} id - 公告 ID
 */
export function markAsRead(id) {
  return request({
    url: `/announcements/${id}/read`,
    method: 'POST'
  })
}

// ==================== 兼容旧版本的别名导出 ====================

/**
 * 标记公告为已读（别名，兼容旧代码）
 * @deprecated 请使用 markAsRead
 */
export const markAnnouncementRead = markAsRead
