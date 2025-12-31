<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">系统设置</text>
			<text class="header-subtitle">配置系统参数</text>
		</view>
		
		<view class="content">
			<!-- 站点设置 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🌐 站点设置</text>
				</view>
				<view class="section-body">
					<view class="form-item">
						<text class="label">站点名称</text>
						<input class="input" v-model="settings.site_name" placeholder="输入站点名称" />
					</view>
					<view class="form-item column">
						<text class="label">站点描述</text>
						<textarea class="textarea" v-model="settings.site_description" placeholder="输入描述" />
					</view>
					<view class="form-item">
						<text class="label">站点 URL</text>
						<input class="input" v-model="settings.site_url" placeholder="https://example.com" />
					</view>
					<view class="form-item">
						<text class="label">管理员邮箱</text>
						<input class="input" v-model="settings.admin_email" placeholder="admin@example.com" />
					</view>
				</view>
			</view>
			
			<!-- 注册设置 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">📝 注册设置</text>
				</view>
				<view class="section-body">
					<view class="form-item">
						<text class="label">开放注册</text>
						<switch :checked="settings.allow_register === '1'" @change="e => settings.allow_register = e.detail.value ? '1' : '0'" color="#4C84FF" />
					</view>
					<view class="form-item">
						<text class="label">新用户默认域名配额</text>
						<input class="input short" type="number" v-model="settings.default_max_domains" placeholder="10" />
					</view>
					<view class="form-item">
						<text class="label">邮箱后缀限制</text>
						<switch :checked="settings.email_suffix_enabled === '1'" @change="e => settings.email_suffix_enabled = e.detail.value ? '1' : '0'" color="#4C84FF" />
					</view>
					<view class="form-item" v-if="settings.email_suffix_enabled === '1'">
						<text class="label">限制模式</text>
						<view class="radio-group">
							<view class="radio-item" :class="{ active: settings.email_suffix_mode === 'whitelist' }" @click="settings.email_suffix_mode = 'whitelist'">
								<text>白名单</text>
							</view>
							<view class="radio-item" :class="{ active: settings.email_suffix_mode === 'blacklist' }" @click="settings.email_suffix_mode = 'blacklist'">
								<text>黑名单</text>
							</view>
						</view>
					</view>
					<view class="form-item column" v-if="settings.email_suffix_enabled === '1'">
						<text class="label">邮箱后缀列表（每行一个）</text>
						<textarea class="textarea" v-model="settings.email_suffix_list" placeholder="@gmail.com&#10;@qq.com" />
					</view>
				</view>
			</view>
			
			<!-- 验证码设置 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🔒 验证码设置</text>
				</view>
				<view class="section-body">
					<view class="form-item">
						<text class="label">启用 Turnstile</text>
						<switch :checked="settings.turnstile_enabled === 'true'" @change="e => settings.turnstile_enabled = e.detail.value ? 'true' : 'false'" color="#4C84FF" />
					</view>
					<template v-if="settings.turnstile_enabled === 'true'">
						<view class="form-item">
							<text class="label">Site Key</text>
							<input class="input" v-model="settings.turnstile_site_key" placeholder="Turnstile Site Key" />
						</view>
						<view class="form-item">
							<text class="label">Secret Key</text>
							<input class="input" type="password" v-model="settings.turnstile_secret_key" placeholder="Turnstile Secret Key" />
						</view>
					</template>
					<view class="divider"></view>
					<view class="form-item">
						<text class="label">登录需要验证码</text>
						<switch :checked="settings.captcha_login === '1'" @change="e => settings.captcha_login = e.detail.value ? '1' : '0'" color="#4C84FF" />
					</view>
					<view class="form-item">
						<text class="label">注册需要验证码</text>
						<switch :checked="settings.captcha_register === '1'" @change="e => settings.captcha_register = e.detail.value ? '1' : '0'" color="#4C84FF" />
					</view>
					<view class="form-item">
						<text class="label">找回密码需要验证码</text>
						<switch :checked="settings.captcha_forgot_password === '1'" @change="e => settings.captcha_forgot_password = e.detail.value ? '1' : '0'" color="#4C84FF" />
					</view>
				</view>
			</view>
			
			<!-- OAuth 设置 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🔗 OAuth 登录</text>
					<text class="section-tip">回调 URL: {{ settings.site_url }}/api/auth/{provider}/callback</text>
				</view>
				<view class="section-body">
					<!-- GitHub -->
					<view class="oauth-group">
						<text class="oauth-title">GitHub</text>
						<view class="form-item">
							<text class="label">Client ID</text>
							<input class="input" v-model="settings.github_client_id" placeholder="GitHub Client ID" />
						</view>
						<view class="form-item">
							<text class="label">Client Secret</text>
							<input class="input" type="password" v-model="settings.github_client_secret" placeholder="GitHub Client Secret" />
						</view>
					</view>
					<!-- Google -->
					<view class="oauth-group">
						<text class="oauth-title">Google</text>
						<view class="form-item">
							<text class="label">Client ID</text>
							<input class="input" v-model="settings.google_client_id" placeholder="Google Client ID" />
						</view>
						<view class="form-item">
							<text class="label">Client Secret</text>
							<input class="input" type="password" v-model="settings.google_client_secret" placeholder="Google Client Secret" />
						</view>
					</view>
					<!-- NodeLoc -->
					<view class="oauth-group">
						<text class="oauth-title">NodeLoc</text>
						<view class="form-item">
							<text class="label">Client ID</text>
							<input class="input" v-model="settings.nodeloc_client_id" placeholder="NodeLoc Client ID" />
						</view>
						<view class="form-item">
							<text class="label">Client Secret</text>
							<input class="input" type="password" v-model="settings.nodeloc_client_secret" placeholder="NodeLoc Client Secret" />
						</view>
					</view>
				</view>
			</view>

			<!-- SMTP 设置 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">📧 SMTP 设置</text>
				</view>
				<view class="section-body">
					<view class="form-item">
						<text class="label">SMTP 服务器</text>
						<input class="input" v-model="settings.smtp_host" placeholder="smtp.example.com" />
					</view>
					<view class="form-item">
						<text class="label">SMTP 端口</text>
						<input class="input short" type="number" v-model="settings.smtp_port" placeholder="465" />
					</view>
					<view class="form-item">
						<text class="label">SMTP 用户名</text>
						<input class="input" v-model="settings.smtp_user" placeholder="输入用户名" />
					</view>
					<view class="form-item">
						<text class="label">SMTP 密码</text>
						<input class="input" type="password" v-model="settings.smtp_password" placeholder="输入密码" />
					</view>
					<view class="form-item">
						<text class="label">启用 SSL</text>
						<switch :checked="settings.smtp_ssl === '1'" @change="e => settings.smtp_ssl = e.detail.value ? '1' : '0'" color="#4C84FF" />
					</view>
					<view class="action-btn" @click="testSmtpConfig">
						<text>📤 测试 SMTP 配置</text>
					</view>
				</view>
			</view>
			
			<!-- 卡密渠道 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🎫 卡密渠道</text>
				</view>
				<view class="section-body">
					<view class="form-item">
						<text class="label">按钮文字</text>
						<input class="input" v-model="settings.redeem_channel_text" placeholder="购买卡密" />
					</view>
					<view class="form-item">
						<text class="label">链接地址</text>
						<input class="input" v-model="settings.redeem_channel_url" placeholder="https://..." />
					</view>
				</view>
			</view>
			
			<!-- 统计代码 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">📊 网站统计</text>
				</view>
				<view class="section-body">
					<view class="form-item column">
						<text class="label">统计代码（支持 HTML）</text>
						<textarea class="textarea code" v-model="settings.analytics_code" placeholder="<script>...</script>" />
					</view>
				</view>
			</view>
		</view>
		
		<!-- 保存按钮 -->
		<view class="save-bar">
			<view class="save-btn" @click="handleSave">
				<text>保存设置</text>
			</view>
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
				// 站点设置
				site_name: '',
				site_description: '',
				site_url: '',
				admin_email: '',
				// 注册设置
				allow_register: '1',
				default_max_domains: '10',
				email_suffix_enabled: '0',
				email_suffix_mode: 'whitelist',
				email_suffix_list: '',
				// 验证码设置
				turnstile_enabled: 'false',
				turnstile_site_key: '',
				turnstile_secret_key: '',
				captcha_login: '1',
				captcha_register: '1',
				captcha_forgot_password: '1',
				// OAuth 设置
				github_client_id: '',
				github_client_secret: '',
				google_client_id: '',
				google_client_secret: '',
				nodeloc_client_id: '',
				nodeloc_client_secret: '',
				// SMTP 设置
				smtp_host: '',
				smtp_port: '',
				smtp_user: '',
				smtp_password: '',
				smtp_ssl: '1',
				// 卡密渠道
				redeem_channel_text: '',
				redeem_channel_url: '',
				// 统计代码
				analytics_code: ''
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
			setTimeout(() => uni.navigateBack(), 1500)
			return
		}
		this.loadSettings()
	},
	methods: {
		async loadSettings() {
			uni.showLoading({ title: '加载中...' })
			try {
				const res = await getAdminSettings()
				const data = res.data?.settings || res.data || {}
				// 合并设置，保留默认值
				Object.keys(this.settings).forEach(key => {
					if (data[key] !== undefined && data[key] !== null) {
						this.settings[key] = String(data[key])
					}
				})
			} catch (e) {
				console.error('加载设置失败', e)
			}
			uni.hideLoading()
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
				title: '测试 SMTP',
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
	background: #f0f2f5;
	padding-bottom: 140rpx;
}

.page-header {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 40rpx 30rpx 60rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
	display: block;
}

.header-subtitle {
	font-size: 24rpx;
	color: rgba(255,255,255,0.7);
	margin-top: 8rpx;
	display: block;
}

.content {
	padding: 0 30rpx;
	margin-top: -30rpx;
	position: relative;
	z-index: 2;
}

.section {
	background: #fff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.section-header {
	padding: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
	display: block;
}

.section-tip {
	font-size: 22rpx;
	color: #8e8e93;
	margin-top: 8rpx;
	display: block;
}

.section-body {
	padding: 16rpx 24rpx;
}

.form-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
	border-bottom: none;
}

.form-item.column {
	flex-direction: column;
	align-items: flex-start;
}

.label {
	font-size: 28rpx;
	color: #666;
	flex-shrink: 0;
}

.form-item.column .label {
	margin-bottom: 12rpx;
}

.input {
	flex: 1;
	text-align: right;
	font-size: 28rpx;
	color: #1a1a2e;
	max-width: 400rpx;
}

.input.short {
	max-width: 200rpx;
}

.textarea {
	width: 100%;
	height: 150rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 26rpx;
	box-sizing: border-box;
}

.textarea.code {
	font-family: monospace;
	height: 200rpx;
}

.radio-group {
	display: flex;
	gap: 16rpx;
}

.radio-item {
	padding: 12rpx 24rpx;
	background: #f0f2f5;
	border-radius: 8rpx;
	font-size: 26rpx;
	color: #666;
}

.radio-item.active {
	background: #4C84FF;
	color: #fff;
}

.divider {
	height: 1rpx;
	background: #f0f0f0;
	margin: 16rpx 0;
}

.oauth-group {
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.oauth-group:last-child {
	border-bottom: none;
}

.oauth-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
	display: block;
	margin-bottom: 12rpx;
}

.oauth-group .form-item {
	padding: 12rpx 0;
}

.action-btn {
	margin-top: 16rpx;
	height: 72rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.action-btn text {
	font-size: 28rpx;
	color: #4C84FF;
}

.save-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: #fff;
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}

.save-btn {
	height: 88rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.save-btn text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 500;
}
</style>
