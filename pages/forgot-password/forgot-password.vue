<template>
	<view class="page">
		<!-- 顶部装饰 -->
		<view class="header-bg">
			<view class="header-shape"></view>
		</view>
		
		<!-- 品牌区域 -->
		<view class="brand-section">
			<view class="brand-icon">
				<text class="brand-emoji">🔑</text>
			</view>
			<text class="brand-name">{{ hasToken ? '重置密码' : '忘记密码' }}</text>
			<text class="brand-slogan">{{ hasToken ? '设置您的新密码' : '通过邮箱找回您的密码' }}</text>
		</view>
		
		<!-- 表单卡片 -->
		<view class="form-card">
			<!-- 步骤指示器 -->
			<view class="steps" v-if="!hasToken">
				<view class="step" :class="{ active: step >= 1 }">
					<view class="step-num">1</view>
					<text class="step-text">验证邮箱</text>
				</view>
				<view class="step-line" :class="{ active: step >= 2 }"></view>
				<view class="step" :class="{ active: step >= 2 }">
					<view class="step-num">2</view>
					<text class="step-text">重置密码</text>
				</view>
			</view>
			
			<!-- Step 1: 输入邮箱 -->
			<view class="form-content" v-if="!hasToken && step === 1">
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">📧</text>
						<input class="input" type="text" v-model="form.email" placeholder="请输入注册邮箱" />
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
				
				<view class="btn-primary" @click="sendResetEmail">
					<text class="btn-text">发送重置邮件</text>
				</view>
			</view>
			
			<!-- Step 2: 邮件已发送提示 -->
			<view class="form-content" v-if="!hasToken && step === 2">
				<view class="success-card">
					<text class="success-icon">📬</text>
					<text class="success-title">邮件已发送</text>
					<text class="success-text">重置密码邮件已发送到 {{ form.email }}</text>
					<text class="success-tip">请前往邮箱点击链接重置密码</text>
				</view>
				
				<view class="btn-secondary" @click="step = 1">
					<text class="btn-text-secondary">重新发送</text>
				</view>
			</view>
			
			<!-- 重置密码表单（从邮件链接跳转） -->
			<view class="form-content" v-if="hasToken">
				<view class="tip-card">
					<text class="tip-icon">✅</text>
					<text class="tip-text">验证成功，请设置新密码</text>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">🔒</text>
						<input class="input" type="password" v-model="form.password" placeholder="新密码 (6-32个字符)" />
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<text class="input-icon">🔐</text>
						<input class="input" type="password" v-model="form.confirmPassword" placeholder="确认新密码" />
					</view>
				</view>
				
				<view class="btn-primary" @click="resetPassword">
					<text class="btn-text">确认重置</text>
				</view>
			</view>
		</view>
		
		<!-- 底部返回登录 -->
		<view class="login-section">
			<text class="login-tip">想起密码了？</text>
			<text class="login-link" @click="goToLogin">返回登录</text>
		</view>
	</view>
</template>

<script>
import { forgotPassword, resetPassword as resetPwd, getCaptcha } from '@/api/auth'

export default {
	data() {
		return {
			hasToken: false,
			step: 1,
			form: {
				email: '',
				token: '',
				password: '',
				confirmPassword: '',
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
			this.hasToken = true
		} else {
			this.refreshCaptcha()
		}
	},
	methods: {
		async refreshCaptcha() {
			try {
				const res = await getCaptcha(this.form.captcha_id)
				this.form.captcha_id = res.data?.id || ''
				this.captchaUrl = res.data?.image || ''
			} catch (e) {
				console.error('获取验证码失败', e)
			}
		},
		async sendResetEmail() {
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
				await forgotPassword({ 
					email: this.form.email,
					captcha_id: this.form.captcha_id,
					captcha_code: this.form.captcha
				})
				uni.hideLoading()
				this.step = 2
			} catch (e) {
				uni.hideLoading()
				this.form.captcha = ''
				this.refreshCaptcha()
			}
		},
		async resetPassword() {
			if (!this.form.password || this.form.password.length < 6 || this.form.password.length > 32) {
				uni.showToast({ title: '密码需6-32个字符', icon: 'none' })
				return
			}
			if (this.form.password !== this.form.confirmPassword) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '重置中...' })
				await resetPwd({
					token: this.form.token,
					password: this.form.password
				})
				uni.hideLoading()
				uni.showModal({
					title: '重置成功',
					content: '密码已重置，请使用新密码登录',
					showCancel: false,
					success: () => {
						uni.redirectTo({ url: '/pages/login/login' })
					}
				})
			} catch (e) {
				uni.hideLoading()
			}
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
	background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
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
	font-size: 26rpx;
	color: #2e7d32;
	line-height: 1.5;
}

.success-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 20rpx;
	margin-bottom: 32rpx;
}

.success-icon {
	font-size: 80rpx;
	margin-bottom: 24rpx;
}

.success-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 16rpx;
}

.success-text {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.success-tip {
	font-size: 24rpx;
	color: #999;
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

.btn-secondary {
	width: 100%;
	height: 92rpx;
	background: #f0f2f5;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn-text-secondary {
	font-size: 30rpx;
	color: #666;
	font-weight: 500;
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
