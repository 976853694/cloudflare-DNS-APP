const BASE_URL = 'http://192.168.20.190:5000/api'

// 请求拦截
const request = (options) => {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token')
		
		const header = {
			'Content-Type': 'application/json',
			...options.header
		}
		
		if (token) {
			header['Authorization'] = `Bearer ${token}`
		}
		
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data,
			header,
			success: (res) => {
				if (res.statusCode === 401) {
					// Token 过期，清除登录状态
					uni.removeStorageSync('token')
					uni.removeStorageSync('userInfo')
					uni.showToast({
						title: '请重新登录',
						icon: 'none'
					})
					// 跳转登录页
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 1500)
					reject(res.data)
					return
				}
				
				if (res.data.code >= 200 && res.data.code < 300) {
					resolve(res.data)
				} else {
					uni.showToast({
						title: res.data.message || '请求失败',
						icon: 'none'
					})
					reject(res.data)
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

export const get = (url, data) => request({ url, method: 'GET', data })
export const post = (url, data) => request({ url, method: 'POST', data })
export const put = (url, data) => request({ url, method: 'PUT', data })
export const del = (url, data) => request({ url, method: 'DELETE', data })

export default request
