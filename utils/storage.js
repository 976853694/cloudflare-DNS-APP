// Token 管理
export const setToken = (token) => {
	uni.setStorageSync('token', token)
}

export const getToken = () => {
	return uni.getStorageSync('token')
}

export const removeToken = () => {
	uni.removeStorageSync('token')
}

// 用户信息管理
export const setUserInfo = (userInfo) => {
	uni.setStorageSync('userInfo', JSON.stringify(userInfo))
}

export const getUserInfo = () => {
	const info = uni.getStorageSync('userInfo')
	return info ? JSON.parse(info) : null
}

export const removeUserInfo = () => {
	uni.removeStorageSync('userInfo')
}

// 检查是否登录
export const isLoggedIn = () => {
	return !!getToken()
}

// 清除所有登录信息
export const clearAuth = () => {
	removeToken()
	removeUserInfo()
}
