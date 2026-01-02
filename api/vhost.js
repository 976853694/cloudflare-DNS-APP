/**
 * 虚拟主机用户端 API
 * 根据 user.md 文档实现
 */
import request from '@/utils/request.js'

// ==================== 套餐相关 ====================

/**
 * 获取可购买套餐列表
 */
export function getVHostPlans() {
  return request({
    url: '/vhost/plans',
    method: 'GET'
  })
}

// ==================== 购买相关 ====================

/**
 * 购买虚拟主机
 * @param {Object} data - 购买数据
 * @param {number} data.plan_id - 套餐ID
 * @param {string} data.domain - 主域名
 * @param {string} [data.coupon_code] - 优惠码
 */
export function purchaseVHost(data) {
  return request({
    url: '/vhost/purchase',
    method: 'POST',
    data
  })
}

// ==================== 实例相关 ====================

/**
 * 获取我的主机列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.status] - 状态筛选（1=正常 2=暂停 3=过期）
 */
export function getVHostInstances(params = {}) {
  return request({
    url: '/vhost/instances',
    method: 'GET',
    data: params
  })
}

/**
 * 获取主机详情
 * @param {number} id - 实例ID
 */
export function getVHostInstance(id) {
  return request({
    url: `/vhost/instances/${id}`,
    method: 'GET'
  })
}

/**
 * 续费主机
 * @param {number} id - 实例ID
 */
export function renewVHost(id) {
  return request({
    url: `/vhost/instances/${id}/renew`,
    method: 'POST'
  })
}

// ==================== 订单相关 ====================

/**
 * 获取我的订单
 */
export function getVHostOrders() {
  return request({
    url: '/vhost/orders',
    method: 'GET'
  })
}


// ==================== 域名绑定 ====================

/**
 * 获取绑定域名列表
 * @param {number} id - 实例ID
 */
export function getInstanceDomains(id) {
  return request({
    url: `/vhost/instances/${id}/domains`,
    method: 'GET'
  })
}

/**
 * 添加域名绑定
 * @param {number} id - 实例ID
 * @param {Object} data - 域名数据
 * @param {string} data.domain - 要绑定的域名
 */
export function addInstanceDomain(id, data) {
  return request({
    url: `/vhost/instances/${id}/domains`,
    method: 'POST',
    data
  })
}

/**
 * 删除域名绑定
 * @param {number} id - 实例ID
 * @param {number} domainId - 域名ID
 */
export function deleteInstanceDomain(id, domainId) {
  return request({
    url: `/vhost/instances/${id}/domains/${domainId}`,
    method: 'DELETE'
  })
}


// ==================== 文件管理 ====================

/**
 * 获取文件列表
 * @param {number} id - 实例ID
 * @param {string} [path='/'] - 目录路径
 */
export function getFiles(id, path = '/') {
  // 使用 URL 参数传递路径，兼容性更好
  const encodedPath = encodeURIComponent(path)
  return request({
    url: `/vhost/instances/${id}/files?path=${encodedPath}`,
    method: 'GET'
  })
}

/**
 * 读取文件内容
 * @param {number} id - 实例ID
 * @param {string} path - 文件路径
 */
export function readFile(id, path) {
  // 使用 URL 参数传递路径，兼容性更好
  const encodedPath = encodeURIComponent(path)
  return request({
    url: `/vhost/instances/${id}/files/read?path=${encodedPath}`,
    method: 'GET'
  })
}

/**
 * 保存文件内容
 * @param {number} id - 实例ID
 * @param {Object} data - 文件数据
 * @param {string} data.path - 文件路径
 * @param {string} data.content - 文件内容
 */
export function saveFile(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/save`,
    method: 'POST',
    data
  })
}

/**
 * 创建文件
 * @param {number} id - 实例ID
 * @param {Object} data - 文件数据
 * @param {string} data.path - 文件路径
 */
export function createFile(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/create`,
    method: 'POST',
    data
  })
}

/**
 * 创建目录
 * @param {number} id - 实例ID
 * @param {Object} data - 目录数据
 * @param {string} data.path - 目录路径
 */
export function createDir(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/mkdir`,
    method: 'POST',
    data
  })
}

/**
 * 删除文件或目录
 * @param {number} id - 实例ID
 * @param {Object} data - 删除数据
 * @param {string} data.path - 路径
 * @param {boolean} [data.is_dir] - 是否为目录
 */
export function deleteFile(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/delete`,
    method: 'POST',
    data
  })
}

/**
 * 重命名文件或目录
 * @param {number} id - 实例ID
 * @param {Object} data - 重命名数据
 * @param {string} data.path - 原路径
 * @param {string} data.new_name - 新名称
 */
export function renameFile(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/rename`,
    method: 'POST',
    data
  })
}

/**
 * 复制文件或目录
 * @param {number} id - 实例ID
 * @param {Object} data - 复制数据
 * @param {string} data.source - 源路径
 * @param {string} data.dest - 目标路径
 */
export function copyFile(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/copy`,
    method: 'POST',
    data
  })
}

/**
 * 移动文件或目录
 * @param {number} id - 实例ID
 * @param {Object} data - 移动数据
 * @param {string} data.source - 源路径
 * @param {string} data.dest - 目标路径
 */
export function moveFile(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/move`,
    method: 'POST',
    data
  })
}

/**
 * 压缩文件或目录
 * @param {number} id - 实例ID
 * @param {Object} data - 压缩数据
 * @param {string} data.source - 源路径
 * @param {string} data.zip_name - 压缩包名称
 */
export function zipFile(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/zip`,
    method: 'POST',
    data
  })
}

/**
 * 解压文件
 * @param {number} id - 实例ID
 * @param {Object} data - 解压数据
 * @param {string} data.zip_path - 压缩包路径
 * @param {string} [data.dest_path] - 解压目标路径
 */
export function unzipFile(id, data) {
  return request({
    url: `/vhost/instances/${id}/files/unzip`,
    method: 'POST',
    data
  })
}


// ==================== PHP 版本管理 ====================

/**
 * 获取可用 PHP 版本
 * @param {number} id - 实例ID
 */
export function getPhpVersions(id) {
  return request({
    url: `/vhost/instances/${id}/php-versions`,
    method: 'GET'
  })
}

/**
 * 设置 PHP 版本
 * @param {number} id - 实例ID
 * @param {Object} data - 版本数据
 * @param {string} data.version - PHP版本号（如 80、81）
 */
export function setPhpVersion(id, data) {
  return request({
    url: `/vhost/instances/${id}/php-version`,
    method: 'POST',
    data
  })
}

// ==================== 运行目录管理 ====================

/**
 * 获取运行目录
 * @param {number} id - 实例ID
 */
export function getRunPath(id) {
  return request({
    url: `/vhost/instances/${id}/run-path`,
    method: 'GET'
  })
}

/**
 * 设置运行目录
 * @param {number} id - 实例ID
 * @param {Object} data - 目录数据
 * @param {string} data.run_path - 运行目录（如 /public）
 */
export function setRunPath(id, data) {
  return request({
    url: `/vhost/instances/${id}/run-path`,
    method: 'POST',
    data
  })
}

// ==================== 伪静态管理 ====================

/**
 * 获取伪静态规则
 * @param {number} id - 实例ID
 */
export function getRewrite(id) {
  return request({
    url: `/vhost/instances/${id}/rewrite`,
    method: 'GET'
  })
}

/**
 * 设置伪静态规则
 * @param {number} id - 实例ID
 * @param {Object} data - 规则数据
 * @param {string} data.content - 伪静态规则内容
 */
export function setRewrite(id, data) {
  return request({
    url: `/vhost/instances/${id}/rewrite`,
    method: 'POST',
    data
  })
}

/**
 * 获取伪静态模板
 * @param {number} id - 实例ID
 * @param {string} name - 模板名称（wordpress、thinkphp、laravel等）
 */
export function getRewriteTemplate(id, name) {
  return request({
    url: `/vhost/instances/${id}/rewrite/template/${name}`,
    method: 'GET'
  })
}

// ==================== SSL 证书管理 ====================

/**
 * 获取 SSL 状态
 * @param {number} id - 实例ID
 */
export function getSslStatus(id) {
  return request({
    url: `/vhost/instances/${id}/ssl`,
    method: 'GET'
  })
}

/**
 * 部署 SSL 证书
 * @param {number} id - 实例ID
 * @param {Object} data - 证书数据
 * @param {string} data.key - 证书私钥
 * @param {string} data.csr - 证书内容
 */
export function deploySsl(id, data) {
  return request({
    url: `/vhost/instances/${id}/ssl`,
    method: 'POST',
    data
  })
}

/**
 * 关闭 SSL
 * @param {number} id - 实例ID
 */
export function closeSsl(id) {
  return request({
    url: `/vhost/instances/${id}/ssl`,
    method: 'DELETE'
  })
}

/**
 * 设置强制 HTTPS
 * @param {number} id - 实例ID
 * @param {Object} data - 设置数据
 * @param {boolean} data.enable - 是否启用强制HTTPS
 */
export function setForceHttps(id, data) {
  return request({
    url: `/vhost/instances/${id}/ssl/force-https`,
    method: 'POST',
    data
  })
}
