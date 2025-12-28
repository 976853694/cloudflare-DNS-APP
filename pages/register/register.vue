<template>
	<view class="page">
		<!-- 顶部装饰 -->
		<view class="header-bg">
			<view class="header-shape"></view>
		</view>
		
		<!-- 品牌区域 -->
		<view class="brand-section">
			<view class="brand-icon">
				<text class="brand-emoji">✨</text>
			</view>
			<text class="brand-name">创建账号</text>
			<text class="brand-slogan">加入六趣DNS，开启域名之旅</text>
		</view>
		
		<!-- 注册表单卡片 -->
		<view class="form-card">
			<!-- 步骤指示器 -->
			<view class="steps" v-if="smtpConfigured">
				<view class="step" :class="{ active: step >= 1 }">
					<view class="step-num">1</view>
					<text class="step-text">验证邮箱</text>
				</view>
				<view class="step-line" :class="{ active: step >= 2 }"></view>
				<view class="step" :class="{ active: step >= 2 }">
					<view class="step-num">2</view>
					<text class="step-text">完善信息</text>
				</view>
			</view>
			
			<!-- 邮箱验证注册 Step 1 -->
			<view class="form-content" v-if="smtpConfigured && step === 1">
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">📧</text>
						<input class="input" type="text" v-model="form.email" placeholder="请输入邮箱地址" />
					</view>
				</view>
				
				<view class="form-item">
					<view class="captcha-row">
						<view class="input-wrapper captcha-input-wrap">
							<text class="input-icon">🔐</text>
							<input class="input" type="number" v-model="form.captcha" placeholder="验证码" maxlength="4" />
						</view>
						<image class="captcha-img" :src="captchaUrl" @click="refreshCaptcha" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="btn-primary" @click="sendVerifyEmail">
					<text class="btn-text">发送验证邮件</text>
				</view>
			</view>
			
			<!-- 邮箱验证注册 Step 2 -->
			<view class="form-content" v-if="smtpConfigured && step === 2">
				<view class="tip-card">
					<text class="tip-icon">✅</text>
					<text class="tip-text">邮箱验证成功，请完善账号信息</text>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">👤</text>
						<input class="input" type="text" v-model="form.username" placeholder="用户名 (3-20个字符)" />
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">🔒</text>
						<input class="input" type="password" v-model="form.password" placeholder="密码 (6-32个字符)" />
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">🔐</text>
						<input class="input" type="password" v-model="form.confirmPassword" placeholder="确认密码" />
					</view>
				</view>
				
				<view class="btn-primary" @click="completeRegister">
					<text class="btn-text">完成注册</text>
				</view>
			</view>
			
			<!-- 传统注册 -->
			<view class="form-content" v-if="!smtpConfigured">
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">👤</text>
						<input class="input" type="text" v-model="form.username" placeholder="用户名 (3-20个字符)" />
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">📧</text>
						<input class="input" type="text" v-model="form.email" placeholder="请输入邮箱" />
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">🔒</text>
						<input class="input" type="password" v-model="form.password" placeholder="密码 (6-32个字符)" />
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">🔐</text>
						<input class="input" type="password" v-model="form.confirmPassword" placeholder="确认密码" />
					</view>
				</view>
				
				<view class="btn-primary" @click="handleRegister">
					<text class="btn-text">立即注册</text>
				</view>
			</view>
		</view>
		
		<!-- 底部登录引导 -->
		<view class="login-section">
			<text class="login-tip">已有账号？</text>
			<text class="login-link" @click="goToLogin">立即登录</text>
		</view>
	</view>
</template>

<script>
import { checkSmtpStatus, sendRegisterEmail, completeRegister as completeReg, register, getCaptcha } from '@/api/auth'
import { setToken, setUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			smtpConfigured: true,
			step: 1,
			form: {
				email: '',
				username: '',
				password: '',
				confirmPassword: '',
				token: '',
				captcha: '',
				captcha_id: ''
			},
			captchaUrl: ''
		}
	},
	onLoad(options) {
		// 从 URL 获取 token 参数（邮件链接跳转）
		if (options.token) {
			this.form.token = options.token
			this.step = 2
			this.smtpConfigured = true
		} else {
			this.checkSmtp()
		}
	},
	methods: {
		async checkSmtp() {
			try {
				const res = await checkSmtpStatus()
				this.smtpConfigured = res.data?.configured || false
				// 获取验证码
				this.refreshCaptcha()
			} catch (e) {
				this.smtpConfigured = false
				this.refreshCaptcha()
			}
		},
		async refreshCaptcha() {
			try {
				const res = await getCaptcha(this.form.captcha_id)
				this.form.captcha_id = res.data?.id || ''
				this.captchaUrl = res.data?.image || ''
			} catch (e) {
				console.error('获取验证码失败', e)
			}
		},
		async sendVerifyEmail() {
			if (!this.form.email) {
				uni.showToast({ title: '请输入邮箱', icon: 'none' })
				return
			}
			if (!this.form.captcha) {
				uni.showToast({ title: '请输入验证码', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '发送中...' })
				await sendRegisterEmail({ 
					email: this.form.email,
					captcha_id: this.form.captcha_id,
					captcha_code: this.form.captcha
				})
				uni.hideLoading()
				uni.showModal({
					title: '验证邮件已发送',
					content: '请前往邮箱点击验证链接完成注册',
					showCancel: false,
					confirmText: '我知道了'
				})
			} catch (e) {
				uni.hideLoading()
				this.form.captcha = ''
				this.refreshCaptcha()
			}
		},
		async completeRegister() {
			if (!this.form.token) {
				uni.showToast({ title: '验证链接无效', icon: 'none' })
				return
			}
			if (!this.validateForm()) return
			try {
				uni.showLoading({ title: '注册中...' })
				const res = await completeReg({
					token: this.form.token,
					username: this.form.username,
					password: this.form.password
				})
				uni.hideLoading()
				setToken(res.data.access_token)
				setUserInfo(res.data.user)
				uni.showToast({ title: '注册成功', icon: 'success' })
				setTimeout(() => {
					uni.switchTab({ url: '/pages/mine/mine' })
				}, 1500)
			} catch (e) {
				uni.hideLoading()
			}
		},
		async handleRegister() {
			if (!this.validateForm()) return
			try {
				uni.showLoading({ title: '注册中...' })
				const res = await register({
					username: this.form.username,
					email: this.form.email,
					password: this.form.password
				})
				uni.hideLoading()
				if (res.data?.access_token) {
					setToken(res.data.access_token)
					setUserInfo(res.data.user)
				}
				uni.showToast({ title: '注册成功', icon: 'success' })
				setTimeout(() => {
					uni.switchTab({ url: '/pages/mine/mine' })
				}, 1500)
			} catch (e) {
				uni.hideLoading()
			}
		},
		validateForm() {
			if (!this.form.username || this.form.username.length < 3 || this.form.username.length > 20) {
				uni.showToast({ title: '用户名需3-20个字符', icon: 'none' })
				return false
			}
			if (!this.smtpConfigured && !this.form.email) {
				uni.showToast({ title: '请输入邮箱', icon: 'none' })
				return false
			}
			if (!this.form.password || this.form.password.length < 6 || this.form.password.length > 32) {
				uni.showToast({ title: '密码需6-32个字符', icon: 'none' })
				return false
			}
			if (this.form.password !== this.form.confirmPassword) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' })
				return false
			}
			return true
		},
		goToLogin() {
			uni.navigateTo({ url: '/pages/login/login' })
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
	height: 420rpx;
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
	padding-top: 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.brand-icon {
	width: 100rpx;
	height: 100rpx;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 26rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.brand-emoji {
	font-size: 48rpx;
}

.brand-name {
	font-size: 40rpx;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 8rpx;
}

.brand-slogan {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.7);
}

.form-card {
	position: relative;
	z-index: 2;
	margin: 40rpx 40rpx 0;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

/* 步骤指示器 */
.steps {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
	padding-bottom: 32rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.step {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.step-num {
	width: 48rpx;
	height: 48rpx;
	border-radius: 24rpx;
	background: #e0e0e0;
	color: #999;
	font-size: 24rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 8rpx;
}

.step.active .step-num {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}

.step-text {
	font-size: 22rpx;
	color: #999;
}

.step.active .step-text {
	color: #1a1a2e;
	font-weight: 500;
}

.step-line {
	width: 80rpx;
	height: 4rpx;
	background: #e0e0e0;
	margin: 0 20rpx;
	margin-bottom: 28rpx;
}

.step-line.active {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.form-content {
	padding-top: 16rpx;
}

.form-item {
	margin-bottom: 28rpx;
}

.input-wrapper {
	display: flex;
	align-items: center;
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 0 24rpx;
	border: 2rpx solid transparent;
}

.input-wrapper:focus-within {
	border-color: #4C84FF;
	background: #fff;
}

.input-icon {
	font-size: 28rpx;
	margin-right: 16rpx;
}

.input {
	flex: 1;
	height: 88rpx;
	font-size: 28rpx;
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
	height: 88rpx;
	border-radius: 16rpx;
	background: #f0f0f0;
}

.tip-card {
	display: flex;
	align-items: center;
	background: linear-gradient(135deg, #e8f4fd 0%, #d6eaf8 100%);
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 28rpx;
}

.tip-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
}

.tip-text {
	flex: 1;
	font-size: 24rpx;
	color: #1a73e8;
	line-height: 1.5;
}

.btn-primary {
	width: 100%;
	height: 92rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(26, 26, 46, 0.3);
}

.btn-text {
	font-size: 30rpx;
	color: #fff;
	font-weight: 600;
}

.login-section {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 40rpx 0;
	gap: 12rpx;
}

.login-tip {
	font-size: 28rpx;
	color: #8e8e93;
}

.login-link {
	font-size: 28rpx;
	color: #4C84FF;
	font-weight: 500;
}
</style>
