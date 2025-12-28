<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">设置</text>
		</view>
		
		<!-- 账户设置 -->
		<view class="settings-section" v-if="isLoggedIn">
			<text class="section-label">账户设置</text>
			<view class="menu-group">
				<view class="menu-item" @click="changePassword">
					<view class="menu-icon">🔐</view>
					<text class="menu-text">修改密码</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="changeEmail">
					<view class="menu-icon">📧</view>
					<text class="menu-text">修改邮箱</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
		</view>
		
		<!-- 通用设置 -->
		<view class="settings-section">
			<text class="section-label">通用</text>
			<view class="menu-group">
				<view class="menu-item" @click="clearCache">
					<view class="menu-icon">🗑️</view>
					<text class="menu-text">清除缓存</text>
					<text class="menu-value">{{ cacheSize }}</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item">
					<view class="menu-icon">📱</view>
					<text class="menu-text">当前版本</text>
					<text class="menu-value">v1.0.0</text>
				</view>
			</view>
		</view>
		
		<!-- 其他 -->
		<view class="settings-section">
			<text class="section-label">其他</text>
			<view class="menu-group">
				<view class="menu-item" @click="showAbout">
					<view class="menu-icon">ℹ️</view>
					<text class="menu-text">关于我们</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
		</view>
		
		<!-- 修改密码弹窗 -->
		<view class="modal" v-if="showPasswordModal" @click.self="showPasswordModal = false">
			<view class="modal-content">
				<text class="modal-title">修改密码</text>
				<text class="modal-tip">请输入验证码后发送验证邮件</text>
				
				<view class="modal-captcha">
					<view class="captcha-row">
						<input class="captcha-input" type="number" v-model="passwordForm.captcha" placeholder="验证码" maxlength="4" />
						<image class="captcha-img" :src="passwordCaptchaUrl" @click="refreshPasswordCaptcha" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showPasswordModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="sendPasswordEmail">
						<text>发送验证邮件</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 修改邮箱弹窗 -->
		<view class="modal" v-if="showEmailModal" @click.self="showEmailModal = false">
			<view class="modal-content">
				<text class="modal-title">修改邮箱</text>
				<text class="modal-tip">请输入验证码后发送验证邮件</text>
				
				<view class="modal-captcha">
					<view class="captcha-row">
						<input class="captcha-input" type="number" v-model="emailForm.captcha" placeholder="验证码" maxlength="4" />
						<image class="captcha-img" :src="emailCaptchaUrl" @click="refreshEmailCaptcha" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showEmailModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="sendEmailCode">
						<text>发送验证邮件</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { sendChangePasswordEmail, sendChangeEmailVerification, getCaptcha } from '@/api/auth'
import { isLoggedIn } from '@/utils/storage'

export default {
	data() {
		return {
			isLoggedIn: false,
			cacheSize: '0KB',
			showPasswordModal: false,
			showEmailModal: false,
			passwordForm: {
				captcha: '',
				captcha_id: ''
			},
			emailForm: {
				captcha: '',
				captcha_id: ''
			},
			passwordCaptchaUrl: '',
			emailCaptchaUrl: ''
		}
	},
	onShow() {
		this.isLoggedIn = isLoggedIn()
		this.getCacheSize()
	},
	methods: {
		getCacheSize() {
			try {
				const res = uni.getStorageInfoSync()
				const size = res.currentSize || 0
				if (size < 1024) {
					this.cacheSize = size + 'KB'
				} else {
					this.cacheSize = (size / 1024).toFixed(2) + 'MB'
				}
			} catch (e) {
				this.cacheSize = '0KB'
			}
		},
		async refreshPasswordCaptcha() {
			try {
				const res = await getCaptcha(this.passwordForm.captcha_id)
				this.passwordForm.captcha_id = res.data?.id || ''
				this.passwordCaptchaUrl = res.data?.image || ''
			} catch (e) {
				console.error('获取验证码失败', e)
			}
		},
		async refreshEmailCaptcha() {
			try {
				const res = await getCaptcha(this.emailForm.captcha_id)
				this.emailForm.captcha_id = res.data?.id || ''
				this.emailCaptchaUrl = res.data?.image || ''
			} catch (e) {
				console.error('获取验证码失败', e)
			}
		},
		changePassword() {
			this.showPasswordModal = true
			this.passwordForm.captcha = ''
			this.refreshPasswordCaptcha()
		},
		async sendPasswordEmail() {
			if (!this.passwordForm.captcha) {
				uni.showToast({ title: '请输入验证码', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '发送中...' })
				await sendChangePasswordEmail({
					captcha_id: this.passwordForm.captcha_id,
					captcha_code: this.passwordForm.captcha
				})
				uni.hideLoading()
				uni.showToast({ title: '验证邮件已发送', icon: 'success' })
				this.showPasswordModal = false
			} catch (e) {
				uni.hideLoading()
				this.passwordForm.captcha = ''
				this.refreshPasswordCaptcha()
			}
		},
		changeEmail() {
			this.showEmailModal = true
			this.emailForm.captcha = ''
			this.refreshEmailCaptcha()
		},
		async sendEmailCode() {
			if (!this.emailForm.captcha) {
				uni.showToast({ title: '请输入验证码', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '发送中...' })
				await sendChangeEmailVerification({
					captcha_id: this.emailForm.captcha_id,
					captcha_code: this.emailForm.captcha
				})
				uni.hideLoading()
				uni.showToast({ title: '验证邮件已发送', icon: 'success' })
				this.showEmailModal = false
			} catch (e) {
				uni.hideLoading()
				this.emailForm.captcha = ''
				this.refreshEmailCaptcha()
			}
		},
		clearCache() {
			uni.showModal({
				title: '提示',
				content: '确定要清除缓存吗？',
				success: (res) => {
					if (res.confirm) {
						try {
							uni.clearStorageSync()
							this.cacheSize = '0KB'
							uni.showToast({ title: '清除成功', icon: 'success' })
						} catch (e) {
							uni.showToast({ title: '清除失败', icon: 'none' })
						}
					}
				}
			})
		},
		showAbout() {
			uni.showModal({
				title: '关于我们',
				content: '域名管理系统 v1.0.0\n提供便捷的二级域名管理服务',
				showCancel: false
			})
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #f0f2f5;
}

.page-header {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 40rpx 30rpx 70rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.settings-section {
	padding: 0 30rpx;
	margin-top: -40rpx;
	position: relative;
	z-index: 2;
}

.settings-section:first-of-type {
	margin-top: -40rpx;
}

.settings-section:not(:first-of-type) {
	margin-top: 0;
}

.section-label {
	font-size: 24rpx;
	color: #8e8e93;
	display: block;
	padding: 20rpx 0 12rpx 8rpx;
}

.menu-group {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
}

.menu-text {
	flex: 1;
	font-size: 28rpx;
	color: #1a1a2e;
}

.menu-value {
	font-size: 26rpx;
	color: #8e8e93;
	margin-right: 8rpx;
}

.menu-arrow {
	font-size: 28rpx;
	color: #c7c7cc;
}

.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-content {
	width: 85%;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1a2e;
	text-align: center;
	margin-bottom: 20rpx;
	display: block;
}

.modal-tip {
	font-size: 26rpx;
	color: #8e8e93;
	line-height: 1.6;
	text-align: center;
	margin-bottom: 24rpx;
	display: block;
}

.modal-captcha {
	margin-bottom: 24rpx;
}

.captcha-row {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.captcha-input {
	flex: 1;
	height: 80rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #333;
}

.captcha-img {
	width: 180rpx;
	height: 80rpx;
	border-radius: 12rpx;
	background: #f0f0f0;
}

.modal-btns {
	display: flex;
	gap: 16rpx;
}

.modal-btn {
	flex: 1;
	height: 84rpx;
	border-radius: 42rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 500;
}

.modal-btn.cancel {
	background: #f0f2f5;
	color: #666;
}

.modal-btn.confirm {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}
</style>
