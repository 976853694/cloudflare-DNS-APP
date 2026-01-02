<template>
	<view class="page">
		<!-- 顶部装饰 -->
		<view class="header-bg">
			<view class="header-shape"></view>
		</view>
		
		<!-- 品牌区域 -->
		<view class="brand-section">
			<view class="brand-icon">
				<text class="brand-emoji">🌐</text>
			</view>
			<text class="brand-name">六趣DNS</text>
			<text class="brand-slogan">专业域名解析服务</text>
		</view>
		
		<!-- 登录表单卡片 -->
		<view class="form-card">
			<text class="form-title">账号登录</text>
			
			<view class="form-item">
				<view class="input-wrapper">
					<text class="input-icon">📧</text>
					<input class="input" type="text" v-model="form.email" placeholder="请输入邮箱" />
				</view>
			</view>
			
			<view class="form-item">
				<view class="input-wrapper">
					<text class="input-icon">🔒</text>
					<input class="input" type="password" v-model="form.password" placeholder="请输入密码" />
				</view>
			</view>
			
			<view class="form-item" v-if="needCaptcha">
				<view class="captcha-row">
					<view class="input-wrapper captcha-input-wrap">
						<text class="input-icon">🔐</text>
						<input class="input" type="number" v-model="form.captcha" placeholder="验证码" maxlength="4" />
					</view>
					<image class="captcha-img" :src="captchaUrl" @click="refreshCaptcha" mode="aspectFit"></image>
				</view>
			</view>
			
			<view class="btn-primary" @click="handleLogin">
				<text class="btn-text">登 录</text>
			</view>
			
			<view class="form-footer">
				<text class="forgot-link" @click="goToForgotPassword">忘记密码？</text>
			</view>
		</view>
		
		<!-- 底部注册引导 -->
		<view class="register-section">
			<text class="register-tip">还没有账号？</text>
			<text class="register-link" @click="goToRegister">立即注册</text>
		</view>
		
		<!-- 第三方登录 -->
		<view class="oauth-section" v-if="hasOAuthProvider">
			<view class="oauth-divider">
				<view class="divider-line"></view>
				<text class="divider-text">其他登录方式</text>
				<view class="divider-line"></view>
			</view>
			<view class="oauth-buttons">
				<view class="oauth-btn" v-if="oauthProviders.github.enabled" @click="handleOAuthLogin('github')">
					<text class="oauth-btn-icon">🐙</text>
					<text class="oauth-btn-text">GitHub</text>
				</view>
				<view class="oauth-btn" v-if="oauthProviders.google.enabled" @click="handleOAuthLogin('google')">
					<text class="oauth-btn-icon">🔍</text>
					<text class="oauth-btn-text">Google</text>
				</view>
				<view class="oauth-btn" v-if="oauthProviders.nodeloc.enabled" @click="handleOAuthLogin('nodeloc')">
					<text class="oauth-btn-icon">🌐</text>
					<text class="oauth-btn-text">NodeLoc</text>
				</view>
			</view>
		</view>
		
		<!-- 底部信息 -->
		<view class="footer">
			<text class="footer-text">© 2024 六趣DNS · 安全可靠的DNS服务</text>
		</view>
	</view>
</template>

<script>
import { login, getCaptcha, getGithubStatus, getGoogleStatus, getNodelocStatus, getOAuthAuthUrl } from '@/api/auth'
import { setToken, setUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			form: {
				email: '',
				password: '',
				captcha: '',
				captcha_id: ''
			},
			needCaptcha: true, // 始终需要验证码
			captchaUrl: '',
			// OAuth 第三方登录
			oauthProviders: {
				github: { enabled: false },
				google: { enabled: false },
				nodeloc: { enabled: false }
			}
		}
	},
	computed: {
		hasOAuthProvider() {
			return this.oauthProviders.github.enabled || 
				   this.oauthProviders.google.enabled || 
				   this.oauthProviders.nodeloc.enabled
		}
	},
	onLoad() {
		// 页面加载时直接获取验证码
		this.refreshCaptcha()
		// 检查 OAuth 提供商状态
		this.checkOAuthProviders()
		// 处理 OAuth 回调
		this.handleOAuthCallback()
	},
	methods: {
		async refreshCaptcha() {
			try {
				const res = await getCaptcha(this.form.captcha_id)
				// 使用新的响应字段名
				this.form.captcha_id = res.data?.id || ''
				this.captchaUrl = res.data?.image || ''
			} catch (e) {
				console.error('获取验证码失败', e)
			}
		},
		async handleLogin() {
			if (!this.form.email) {
				uni.showToast({ title: '请输入邮箱', icon: 'none' })
				return
			}
			if (!this.form.password) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return
			}
			if (!this.form.captcha) {
				uni.showToast({ title: '请输入验证码', icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '登录中...' })
				const res = await login({
					email: this.form.email,
					password: this.form.password,
					captcha_id: this.form.captcha_id,
					captcha_code: this.form.captcha
				})
				uni.hideLoading()
				
				setToken(res.data.access_token)
				setUserInfo(res.data.user)
				
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				
				setTimeout(() => {
					uni.reLaunch({ url: '/pages/mine/mine' })
				}, 1500)
			} catch (e) {
				uni.hideLoading()
				// 登录失败后刷新验证码
				this.form.captcha = ''
				this.refreshCaptcha()
			}
		},
		goToRegister() {
			uni.navigateTo({ url: '/pages/register/register' })
		},
		goToForgotPassword() {
			uni.navigateTo({ url: '/pages/forgot-password/forgot-password' })
		},
		
		// OAuth 相关方法
		async checkOAuthProviders() {
			try {
				const [githubRes, googleRes, nodelocRes] = await Promise.all([
					getGithubStatus().catch(() => ({ data: { enabled: false } })),
					getGoogleStatus().catch(() => ({ data: { enabled: false } })),
					getNodelocStatus().catch(() => ({ data: { enabled: false } }))
				])
				this.oauthProviders = {
					github: { enabled: githubRes.data?.enabled || false },
					google: { enabled: googleRes.data?.enabled || false },
					nodeloc: { enabled: nodelocRes.data?.enabled || false }
				}
			} catch (e) {
				console.error('检查OAuth状态失败', e)
			}
		},
		
		handleOAuthCallback() {
			// 处理 OAuth 登录回调
			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			const options = currentPage.options || {}
			
			// 检查各 provider 的 token
			const providers = ['github', 'google', 'nodeloc']
			for (const provider of providers) {
				const tokenKey = `${provider}_token`
				if (options[tokenKey]) {
					// 存储 token 并跳转
					setToken(options[tokenKey])
					uni.showToast({ title: '登录成功', icon: 'success' })
					setTimeout(() => {
						uni.reLaunch({ url: '/pages/mine/mine' })
					}, 1500)
					return
				}
			}
			
			// 检查错误
			if (options.error) {
				uni.showToast({ title: decodeURIComponent(options.error), icon: 'none' })
			}
		},
		
		async handleOAuthLogin(provider) {
			try {
				uni.showLoading({ title: '跳转中...' })
				const res = await getOAuthAuthUrl(provider)
				uni.hideLoading()
				if (res.data?.url) {
					// #ifdef H5
					window.location.href = res.data.url
					// #endif
					// #ifdef APP-PLUS
					plus.runtime.openURL(res.data.url)
					// #endif
					// #ifdef MP-WEIXIN
					uni.showToast({ title: '请在浏览器中完成登录', icon: 'none' })
					// #endif
				}
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: e.message || '获取授权链接失败', icon: 'none' })
			}
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #f0f2f5;
	position: relative;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 480rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	overflow: hidden;
}

.header-shape {
	position: absolute;
	bottom: -100rpx;
	left: -10%;
	right: -10%;
	height: 200rpx;
	background: #f0f2f5;
	border-radius: 50% 50% 0 0;
}

.brand-section {
	position: relative;
	z-index: 1;
	padding-top: 120rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.brand-icon {
	width: 120rpx;
	height: 120rpx;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 24rpx;
}

.brand-emoji {
	font-size: 56rpx;
}

.brand-name {
	font-size: 44rpx;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 12rpx;
	letter-spacing: 4rpx;
}

.brand-slogan {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.7);
}

.form-card {
	position: relative;
	z-index: 2;
	margin: 60rpx 40rpx 0;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 48rpx 40rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.form-title {
	display: block;
	font-size: 36rpx;
	font-weight: 600;
	color: #1a1a2e;
	text-align: center;
	margin-bottom: 48rpx;
}

.form-item {
	margin-bottom: 32rpx;
}

.input-wrapper {
	display: flex;
	align-items: center;
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 0 24rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.input-wrapper:focus-within {
	border-color: #4C84FF;
	background: #fff;
}

.input-icon {
	font-size: 32rpx;
	margin-right: 20rpx;
}

.input {
	flex: 1;
	height: 96rpx;
	font-size: 30rpx;
	color: #333;
	background: transparent;
}

.captcha-row {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.captcha-input-wrap {
	flex: 1;
}

.captcha-img {
	width: 200rpx;
	height: 96rpx;
	border-radius: 16rpx;
	background: #f0f0f0;
}

.btn-primary {
	width: 100%;
	height: 96rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba(26, 26, 46, 0.3);
}

.btn-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
	letter-spacing: 8rpx;
}

.form-footer {
	display: flex;
	justify-content: flex-end;
	padding-top: 24rpx;
}

.forgot-link {
	font-size: 26rpx;
	color: #8e8e93;
}

.register-section {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 48rpx 0;
	gap: 12rpx;
}

.register-tip {
	font-size: 28rpx;
	color: #8e8e93;
}

.register-link {
	font-size: 28rpx;
	color: #4C84FF;
	font-weight: 500;
}

.footer {
	position: absolute;
	bottom: 60rpx;
	left: 0;
	right: 0;
	text-align: center;
}

.footer-text {
	font-size: 22rpx;
	color: #c7c7cc;
}

/* OAuth 第三方登录样式 */
.oauth-section {
	padding: 0 40rpx 40rpx;
}

.oauth-divider {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
}

.divider-line {
	flex: 1;
	height: 1rpx;
	background: #e0e0e0;
}

.divider-text {
	padding: 0 24rpx;
	font-size: 24rpx;
	color: #8e8e93;
}

.oauth-buttons {
	display: flex;
	justify-content: center;
	gap: 32rpx;
}

.oauth-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24rpx 32rpx;
	background: #fff;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	min-width: 160rpx;
}

.oauth-btn-icon {
	font-size: 48rpx;
	margin-bottom: 12rpx;
}

.oauth-btn-text {
	font-size: 24rpx;
	color: #666;
}
</style>
