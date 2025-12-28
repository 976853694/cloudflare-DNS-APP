<template>
	<view class="page">
		<view class="section">
			<text class="section-title">站点设置</text>
			
			<view class="form-item">
				<text class="label">站点名称</text>
				<input class="input" v-model="settings.site_name" placeholder="输入站点名称" />
			</view>
			
			<view class="form-item column">
				<text class="label">站点描述</text>
				<textarea class="textarea" v-model="settings.site_description" placeholder="输入描述" />
			</view>
			
			<view class="form-item">
				<text class="label">管理员邮箱</text>
				<input class="input" v-model="settings.admin_email" placeholder="输入邮箱" />
			</view>
		</view>
		
		<view class="section">
			<text class="section-title">SMTP设置</text>
			
			<view class="form-item">
				<text class="label">SMTP服务器</text>
				<input class="input" v-model="settings.smtp_host" placeholder="smtp.example.com" />
			</view>
			
			<view class="form-item">
				<text class="label">SMTP端口</text>
				<input class="input" type="number" v-model="settings.smtp_port" placeholder="465" />
			</view>
			
			<view class="form-item">
				<text class="label">SMTP用户名</text>
				<input class="input" v-model="settings.smtp_user" placeholder="输入用户名" />
			</view>
			
			<view class="form-item">
				<text class="label">SMTP密码</text>
				<input class="input" type="password" v-model="settings.smtp_password" placeholder="输入密码" />
			</view>
			
			<view class="form-item">
				<text class="label">启用SSL</text>
				<switch :checked="settings.smtp_ssl === '1'" @change="e => settings.smtp_ssl = e.detail.value ? '1' : '0'" />
			</view>
			
			<view class="test-btn" @click="testSmtpConfig">
				<text>测试SMTP配置</text>
			</view>
		</view>
		
		<view class="section">
			<text class="section-title">卡密渠道</text>
			
			<view class="form-item">
				<text class="label">按钮文字</text>
				<input class="input" v-model="settings.redeem_channel_text" placeholder="购买卡密" />
			</view>
			
			<view class="form-item">
				<text class="label">链接地址</text>
				<input class="input" v-model="settings.redeem_channel_url" placeholder="https://..." />
			</view>
		</view>
		
		<view class="save-btn" @click="handleSave">
			<text class="save-text">保存设置</text>
		</view>
	</view>
</template>

<script>
import { getAdminSettings, updateAdminSettings, testSmtp } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			userInfo: null,
			settings: {
				site_name: '',
				site_description: '',
				admin_email: '',
				smtp_host: '',
				smtp_port: '',
				smtp_user: '',
				smtp_password: '',
				smtp_ssl: '1',
				redeem_channel_text: '',
				redeem_channel_url: ''
			}
		}
	},
	computed: {
		isDemo() {
			return this.userInfo?.role === 'demo'
		}
	},
	onLoad() {
		this.userInfo = getStoredUserInfo()
		if (this.isDemo) {
			uni.showToast({ title: '演示用户无权访问设置', icon: 'none' })
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
			return
		}
		this.loadSettings()
	},
	methods: {
		async loadSettings() {
			try {
				const res = await getAdminSettings()
				this.settings = { ...this.settings, ...res.data?.settings }
			} catch (e) {
				// 接口可能未实现
			}
		},
		async handleSave() {
			try {
				uni.showLoading({ title: '保存中...' })
				await updateAdminSettings(this.settings)
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
			} catch (e) {
				uni.hideLoading()
			}
		},
		testSmtpConfig() {
			uni.showModal({
				title: '测试SMTP',
				editable: true,
				placeholderText: '输入测试邮箱',
				success: async (res) => {
					if (res.confirm && res.content) {
						try {
							uni.showLoading({ title: '发送中...' })
							await testSmtp(res.content)
							uni.hideLoading()
							uni.showToast({ title: '发送成功', icon: 'success' })
						} catch (e) {
							uni.hideLoading()
						}
					}
				}
			})
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #f5f5f5;
	padding: 20rpx;
	padding-bottom: 150rpx;
}

.section {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 20rpx;
}

.form-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.form-item.column {
	flex-direction: column;
	align-items: flex-start;
}

.label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.input {
	width: 300rpx;
	text-align: right;
	font-size: 28rpx;
	color: #333;
}

.textarea {
	width: 100%;
	height: 150rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
}

.test-btn {
	margin-top: 20rpx;
	height: 72rpx;
	background: #f5f5f5;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #4C84FF;
}

.save-btn {
	position: fixed;
	left: 30rpx;
	right: 30rpx;
	bottom: 50rpx;
	height: 88rpx;
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.save-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 500;
}
</style>
