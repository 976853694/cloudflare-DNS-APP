/**
 * 健康检查 API
 * 根据 user.md 文档
 */
import request from '@/utils/request.js'

/**
 * 健康检查
 * 无需认证
 */
export function healthCheck() {
  return request({
    url: '/health',
    method: 'GET'
  })
}

/**
 * 就绪检查
 * 检查应用是否准备好接收流量
 */
export function readyCheck() {
  return request({
    url: '/health/ready',
    method: 'GET'
  })
}

/**
 * 存活检查
 * 检查应用进程是否存活
 */
export function liveCheck() {
  return request({
    url: '/health/live',
    method: 'GET'
  })
}
