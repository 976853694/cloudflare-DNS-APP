<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">安全设置</text>
			<text class="header-subtitle">管理您的账户安全选项</text>
		</view>
		
		<view class="content">
			<!-- 双因素认证 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🔐 双因素认证 (2FA)</text>
					<view class="status-badge" :class="twoFAEnabled ? 'enabled' : 'disabled'">
						<text>{{ twoFAEnabled ? '已启用' : '未启用' }}</text>
					</view>
				</view>
				<view class="section-content">
					<text class="section-desc">启用双因素认证后，登录时需要输入验证器应用生成的验证码，大幅提升账户安全性。</text>
					<view class="btn-group">
						<view class="action-btn primary" v-if="!twoFAEnabled" @click="setup2FA">
							<text>启用 2FA</text>
						</view>
						<view class="action-btn danger" v-else @click="showDisable2FAModal = true">
							<text>禁用 2FA</text>
						</view>
						<view class="action-btn secondary" v-if="twoFAEnabled" @click="showBackupCodesModal = true">
							<text>备用码</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- API 密钥管理 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🔑 API 密钥</text>
					<view class="status-badge" :class="apiEnabled ? 'enabled' : 'disabled'">
						<text>{{ apiEnabled ? '已启用' : '未启用' }}</text>
					</view>
				</view>
				<view class="section-content">
					<text class="section-desc">API 密钥用于外部系统调用开放 API，请妥善保管您的密钥。</text>
					<view class="api-info" v-if="apiKey">
						<view class="info-row">
							<text class="info-label">API Key</text>
							<text class="info-value">{{ apiKey }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">API Secret</text>
							<text class="info-value">{{ apiSecretDisplay }}</text>
							<view class="view-btn" @click="showViewSecretModal = true">
								<text>查看</text>
							</view>
						</view>
					</view>
					<view class="btn-group">
						<view class="action-btn primary" v-if="!apiKey" @click="generateApiKey">
							<text>生成密钥</text>
						</view>
						<template v-else>
							<view class="action-btn" :class="apiEnabled ? 'warning' : 'success'" @click="toggleApi">
								<text>{{ apiEnabled ? '禁用 API' : '启用 API' }}</text>
							</view>
							<view class="action-btn danger" @click="showResetApiModal = true">
								<text>重置密钥</text>
							</view>
						</template>
					</view>
				</view>
			</view>
			
			<!-- IP 白名单 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🌐 API IP 白名单</text>
				</view>
				<view class="section-content">
					<text class="section-desc">限制只有指定 IP 才能调用 API，留空则不限制。</text>
					<view class="ip-list" v-if="apiIpWhitelist.length > 0">
						<view class="ip-item" v-for="(ip, index) in apiIpWhitelist" :key="index">
							<text class="ip-text">{{ ip }}</text>
							<text class="ip-remove" @click="removeIp(index)">×</text>
						</view>
					</view>
					<view class="empty-tip" v-else>
						<text>暂未设置 IP 白名单</text>
					</view>
					<view class="add-ip-row">
						<input class="ip-input" v-model="newIp" placeholder="输入 IP 地址" />
						<view class="add-btn" @click="addIp">
							<text>添加</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 登录 IP 限制 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🛡️ 登录 IP 限制</text>
				</view>
				<view class="section-content">
					<text class="section-desc">限制只有指定 IP 才能登录账户，留空则不限制。</text>
					<view class="ip-list" v-if="allowedIps.length > 0">
						<view class="ip-item" v-for="(ip, index) in allowedIps" :key="index">
							<text class="ip-text">{{ ip }}</text>
							<text class="ip-remove" @click="removeAllowedIp(index)">×</text>
						</view>
					</view>
					<view class="empty-tip" v-else>
						<text>暂未设置登录 IP 限制</text>
					</view>
					<view class="add-ip-row">
						<input class="ip-input" v-model="newAllowedIp" placeholder="输入 IP 地址" />
						<view class="add-btn" @click="addAllowedIp">
							<text>添加</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 第三方账号绑定 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">🔗 第三方账号绑定</text>
				</view>
				<view class="section-content">
					<text class="section-desc">绑定第三方账号后，可以使用该账号快速登录。</text>
					
					<!-- GitHub -->
					<view class="oauth-item" v-if="oauthStatus.github.enabled">
						<view class="oauth-info">
							<text class="oauth-icon">🐙</text>
							<view class="oauth-detail">
								<text class="oauth-name">GitHub</text>
								<text class="oauth-status" :class="oauthStatus.github.bound ? 'bound' : 'unbound'">
									{{ oauthStatus.github.bound ? '已绑定' : '未绑定' }}
								</text>
							</view>
						</view>
						<view class="oauth-action">
							<view class="action-btn primary" v-if="!oauthStatus.github.bound" @click="handleBindOAuth('github')">
								<text>绑定</text>
							</view>
							<view class="action-btn danger" v-else @click="handleUnbindOAuth('github')">
								<text>解绑</text>
							</view>
						</view>
					</view>
					
					<!-- Google -->
					<view class="oauth-item" v-if="oauthStatus.google.enabled">
						<view class="oauth-info">
							<text class="oauth-icon">🔍</text>
							<view class="oauth-detail">
								<text class="oauth-name">Google</text>
								<text class="oauth-status" :class="oauthStatus.google.bound ? 'bound' : 'unbound'">
									{{ oauthStatus.google.bound ? '已绑定' : '未绑定' }}
								</text>
							</view>
						</view>
						<view class="oauth-action">
							<view class="action-btn primary" v-if="!oauthStatus.google.bound" @click="handleBindOAuth('google')">
								<text>绑定</text>
							</view>
							<view class="action-btn danger" v-else @click="handleUnbindOAuth('google')">
								<text>解绑</text>
							</view>
						</view>
					</view>
					
					<!-- NodeLoc -->
					<view class="oauth-item" v-if="oauthStatus.nodeloc.enabled">
						<view class="oauth-info">
							<text class="oauth-icon">🌐</text>
							<view class="oauth-detail">
								<text class="oauth-name">NodeLoc</text>
								<text class="oauth-status" :class="oauthStatus.nodeloc.bound ? 'bound' : 'unbound'">
									{{ oauthStatus.nodeloc.bound ? '已绑定' : '未绑定' }}
								</text>
							</view>
						</view>
						<view class="oauth-action">
							<view class="action-btn primary" v-if="!oauthStatus.nodeloc.bound" @click="handleBindOAuth('nodeloc')">
								<text>绑定</text>
							</view>
							<view class="action-btn danger" v-else @click="handleUnbindOAuth('nodeloc')">
								<text>解绑</text>
							</view>
						</view>
					</view>
					
					<!-- 无可用的第三方登录 -->
					<view class="empty-tip" v-if="!oauthStatus.github.enabled && !oauthStatus.google.enabled && !oauthStatus.nodeloc.enabled">
						<text>暂无可用的第三方登录方式</text>
					</view>
				</view>
			</view>
			
			<!-- 登录历史 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">📋 登录历史</text>
					<view class="refresh-btn" @click="loadLoginHistory">
						<text>刷新</text>
					</view>
				</view>
				<view class="section-content">
					<view class="history-list" v-if="loginHistory.length > 0">
						<view class="history-item" v-for="(item, index) in loginHistory" :key="index">
							<view class="history-main">
								<text class="history-ip">{{ item.ip }}</text>
								<text class="history-time">{{ item.login_time || item.created_at }}</text>
							</view>
							<view class="history-sub">
								<text class="history-ua">{{ item.user_agent || '未知设备' }}</text>
							</view>
						</view>
					</view>
					<view class="empty-tip" v-else>
						<text>暂无登录记录</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 2FA 设置弹窗 -->
		<view class="modal" v-if="showSetup2FAModal" @click.self="showSetup2FAModal = false">
			<view class="modal-content large">
				<text class="modal-title">启用双因素认证</text>
				<view class="qr-section">
					<text class="qr-tip">请使用 Google Authenticator 或其他验证器应用扫描二维码</text>
					<image class="qr-image" :src="qrCodeUrl" mode="aspectFit" v-if="qrCodeUrl"></image>
					<view class="secret-row">
						<text class="secret-label">密钥：</text>
						<text class="secret-value">{{ twoFASecret }}</text>
					</view>
				</view>
				<view class="input-group">
					<text class="input-label">输入验证码确认</text>
					<input class="modal-input" type="number" v-model="verifyCode" placeholder="6位验证码" maxlength="6" />
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showSetup2FAModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="enable2FA">
						<text>确认启用</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 禁用 2FA 弹窗 -->
		<view class="modal" v-if="showDisable2FAModal" @click.self="showDisable2FAModal = false">
			<view class="modal-content">
				<text class="modal-title">禁用双因素认证</text>
				<view class="input-group">
					<text class="input-label">账户密码</text>
					<input class="modal-input" type="password" v-model="disableForm.password" placeholder="请输入密码" />
				</view>
				<view class="input-group">
					<text class="input-label">2FA 验证码</text>
					<input class="modal-input" type="number" v-model="disableForm.code" placeholder="6位验证码" maxlength="6" />
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showDisable2FAModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm danger" @click="disable2FA">
						<text>确认禁用</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 备用码弹窗 -->
		<view class="modal" v-if="showBackupCodesModal" @click.self="showBackupCodesModal = false">
			<view class="modal-content">
				<text class="modal-title">备用码管理</text>
				<text class="modal-tip">备用码可在无法使用验证器时登录账户，每个备用码只能使用一次。</text>
				<view class="backup-codes" v-if="backupCodes.length > 0">
					<text class="backup-code" v-for="(code, index) in backupCodes" :key="index">{{ code }}</text>
				</view>
				<view class="input-group" v-if="!backupCodes.length">
					<text class="input-label">输入 2FA 验证码重新生成</text>
					<input class="modal-input" type="number" v-model="backupCodeVerify" placeholder="6位验证码" maxlength="6" />
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showBackupCodesModal = false; backupCodes = []">
						<text>关闭</text>
					</view>
					<view class="modal-btn confirm" @click="regenerateBackupCodes" v-if="!backupCodes.length">
						<text>生成备用码</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 查看 API Secret 弹窗 -->
		<view class="modal" v-if="showViewSecretModal" @click.self="showViewSecretModal = false">
			<view class="modal-content">
				<text class="modal-title">查看 API Secret</text>
				<view class="input-group" v-if="!viewedSecret">
					<text class="input-label">请输入账户密码验证身份</text>
					<input class="modal-input" type="password" v-model="viewSecretPassword" placeholder="请输入密码" />
				</view>
				<view class="secret-display" v-else>
					<text class="secret-text">{{ viewedSecret }}</text>
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="closeViewSecret">
						<text>关闭</text>
					</view>
					<view class="modal-btn confirm" @click="viewSecret" v-if="!viewedSecret">
						<text>查看</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 重置 API 密钥弹窗 -->
		<view class="modal" v-if="showResetApiModal" @click.self="showResetApiModal = false">
			<view class="modal-content">
				<text class="modal-title">重置 API 密钥</text>
				<text class="modal-tip warning">⚠️ 重置后原密钥将立即失效，请确保已更新所有使用该密钥的应用。</text>
				<view class="input-group">
					<text class="input-label">请输入账户密码确认</text>
					<input class="modal-input" type="password" v-model="resetApiPassword" placeholder="请输入密码" />
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showResetApiModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm danger" @click="resetApiKey">
						<text>确认重置</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 新密钥展示弹窗 -->
		<view class="modal" v-if="showNewKeyModal" @click.self="closeNewKeyModal">
			<view class="modal-content">
				<text class="modal-title">🎉 API 密钥已生成</text>
				<text class="modal-tip warning">⚠️ 请立即保存 API Secret，此信息只显示一次！</text>
				<view class="key-display">
					<view class="key-row">
						<text class="key-label">API Key</text>
						<text class="key-value">{{ newApiKey }}</text>
					</view>
					<view class="key-row">
						<text class="key-label">API Secret</text>
						<text class="key-value secret">{{ newApiSecret }}</text>
					</view>
				</view>
				<view class="modal-btns">
					<view class="modal-btn confirm" @click="closeNewKeyModal">
						<text>我已保存</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { 
	setup2FA, enable2FA as enable2FAApi, disable2FA as disable2FAApi, 
	get2FAStatus, regenerateBackupCodes as regenerateBackupCodesApi,
	getIpRestriction, updateIpRestriction, getLoginHistory,
	getApiKeys, generateApiKeys, toggleApiKeys, updateApiWhitelist, viewApiSecret
} from '@/api/security'
import { getOAuthBindable, bindOAuth, unbindOAuth } from '@/api/auth'

export default {
	data() {
		return {
			// OAuth 第三方账号绑定
			oauthStatus: {
				github: { enabled: false, bound: false },
				google: { enabled: false, bound: false },
				nodeloc: { enabled: false, bound: false }
			},
			
			// 2FA
			twoFAEnabled: false,
			showSetup2FAModal: false,
			showDisable2FAModal: false,
			showBackupCodesModal: false,
			qrCodeUrl: '',
			twoFASecret: '',
			verifyCode: '',
			disableForm: { password: '', code: '' },
			backupCodes: [],
			backupCodeVerify: '',
			
			// API 密钥
			apiKey: '',
			apiSecretDisplay: '******',
			apiEnabled: false,
			apiIpWhitelist: [],
			newIp: '',
			showViewSecretModal: false,
			showResetApiModal: false,
			showNewKeyModal: false,
			viewSecretPassword: '',
			viewedSecret: '',
			resetApiPassword: '',
			newApiKey: '',
			newApiSecret: '',
			
			// 登录 IP 限制
			allowedIps: [],
			newAllowedIp: '',
			
			// 登录历史
			loginHistory: []
		}
	},
	onLoad() {
		this.loadData()
		this.handleOAuthCallback()
	},
	methods: {
		async loadData() {
			uni.showLoading({ title: '加载中...' })
			try {
				await Promise.all([
					this.loadOAuthStatus(),
					this.load2FAStatus(),
					this.loadApiKeys(),
					this.loadIpRestriction(),
					this.loadLoginHistory()
				])
			} catch (e) {
				console.error('加载数据失败', e)
			}
			uni.hideLoading()
		},
		
		// OAuth 相关
		async loadOAuthStatus() {
			try {
				const res = await getOAuthBindable()
				if (res.data) {
					this.oauthStatus = {
						github: res.data.github || { enabled: false, bound: false },
						google: res.data.google || { enabled: false, bound: false },
						nodeloc: res.data.nodeloc || { enabled: false, bound: false }
					}
				}
			} catch (e) {
				console.error('获取OAuth状态失败', e)
			}
		},
		
		handleOAuthCallback() {
			// 处理 OAuth 回调参数
			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			const options = currentPage.options || {}
			
			if (options.bind_success) {
				uni.showToast({ title: '绑定成功', icon: 'success' })
				this.loadOAuthStatus()
			} else if (options.error) {
				uni.showToast({ title: decodeURIComponent(options.error), icon: 'none' })
			}
		},
		
		async handleBindOAuth(provider) {
			try {
				uni.showLoading({ title: '跳转中...' })
				const res = await bindOAuth(provider)
				uni.hideLoading()
				if (res.data?.url) {
					// #ifdef H5
					window.location.href = res.data.url
					// #endif
					// #ifdef APP-PLUS
					plus.runtime.openURL(res.data.url)
					// #endif
					// #ifdef MP-WEIXIN
					uni.showToast({ title: '请在浏览器中完成绑定', icon: 'none' })
					// #endif
				}
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: e.message || '获取授权链接失败', icon: 'none' })
			}
		},
		
		handleUnbindOAuth(provider) {
			const providerNames = {
				github: 'GitHub',
				google: 'Google',
				nodeloc: 'NodeLoc'
			}
			uni.showModal({
				title: '确认解绑',
				content: `确定要解绑 ${providerNames[provider]} 账号吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '解绑中...' })
							await unbindOAuth(provider)
							uni.hideLoading()
							uni.showToast({ title: '解绑成功', icon: 'success' })
							this.loadOAuthStatus()
						} catch (e) {
							uni.hideLoading()
							uni.showToast({ title: e.message || '解绑失败', icon: 'none' })
						}
					}
				}
			})
		},
		
		async load2FAStatus() {
			try {
				const res = await get2FAStatus()
				this.twoFAEnabled = res.data?.enabled || false
			} catch (e) {
				console.error('获取2FA状态失败', e)
			}
		},
		
		async loadApiKeys() {
			try {
				const res = await getApiKeys()
				this.apiKey = res.data?.api_key || ''
				this.apiEnabled = res.data?.api_enabled || false
				this.apiIpWhitelist = res.data?.api_ip_whitelist || []
			} catch (e) {
				console.error('获取API密钥失败', e)
			}
		},
		
		async loadIpRestriction() {
			try {
				const res = await getIpRestriction()
				this.allowedIps = res.data?.allowed_ips || []
			} catch (e) {
				console.error('获取IP限制失败', e)
			}
		},
		
		async loadLoginHistory() {
			try {
				const res = await getLoginHistory()
				this.loginHistory = res.data?.sessions || res.data || []
			} catch (e) {
				console.error('获取登录历史失败', e)
			}
		},
		
		// 2FA 相关
		async setup2FA() {
			try {
				uni.showLoading({ title: '生成中...' })
				const res = await setup2FA()
				uni.hideLoading()
				this.qrCodeUrl = res.data?.qr_code || ''
				this.twoFASecret = res.data?.secret || ''
				this.verifyCode = ''
				this.showSetup2FAModal = true
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		async enable2FA() {
			if (!this.verifyCode || this.verifyCode.length !== 6) {
				uni.showToast({ title: '请输入6位验证码', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '验证中...' })
				const res = await enable2FAApi({ code: this.verifyCode })
				uni.hideLoading()
				this.showSetup2FAModal = false
				this.twoFAEnabled = true
				// 显示备用码
				if (res.data?.backup_codes) {
					this.backupCodes = res.data.backup_codes
					this.showBackupCodesModal = true
				}
				uni.showToast({ title: '2FA 已启用', icon: 'success' })
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		async disable2FA() {
			if (!this.disableForm.password || !this.disableForm.code) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '处理中...' })
				await disable2FAApi(this.disableForm)
				uni.hideLoading()
				this.showDisable2FAModal = false
				this.twoFAEnabled = false
				this.disableForm = { password: '', code: '' }
				uni.showToast({ title: '2FA 已禁用', icon: 'success' })
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		async regenerateBackupCodes() {
			if (!this.backupCodeVerify || this.backupCodeVerify.length !== 6) {
				uni.showToast({ title: '请输入6位验证码', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '生成中...' })
				const res = await regenerateBackupCodesApi({ code: this.backupCodeVerify })
				uni.hideLoading()
				this.backupCodes = res.data?.backup_codes || []
				this.backupCodeVerify = ''
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		// API 密钥相关
		async generateApiKey() {
			try {
				uni.showLoading({ title: '生成中...' })
				const res = await generateApiKeys()
				uni.hideLoading()
				this.newApiKey = res.data?.api_key || ''
				this.newApiSecret = res.data?.api_secret || ''
				this.showNewKeyModal = true
				this.loadApiKeys()
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		async toggleApi() {
			try {
				uni.showLoading({ title: '处理中...' })
				await toggleApiKeys({ enabled: !this.apiEnabled })
				uni.hideLoading()
				this.apiEnabled = !this.apiEnabled
				uni.showToast({ title: this.apiEnabled ? 'API 已启用' : 'API 已禁用', icon: 'success' })
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		async viewSecret() {
			if (!this.viewSecretPassword) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '验证中...' })
				const res = await viewApiSecret({ password: this.viewSecretPassword })
				uni.hideLoading()
				this.viewedSecret = res.data?.api_secret || ''
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		closeViewSecret() {
			this.showViewSecretModal = false
			this.viewSecretPassword = ''
			this.viewedSecret = ''
		},
		
		async resetApiKey() {
			if (!this.resetApiPassword) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '重置中...' })
				const res = await generateApiKeys({ password: this.resetApiPassword })
				uni.hideLoading()
				this.showResetApiModal = false
				this.resetApiPassword = ''
				this.newApiKey = res.data?.api_key || ''
				this.newApiSecret = res.data?.api_secret || ''
				this.showNewKeyModal = true
				this.loadApiKeys()
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		closeNewKeyModal() {
			this.showNewKeyModal = false
			this.newApiKey = ''
			this.newApiSecret = ''
		},
		
		// IP 白名单相关
		addIp() {
			if (!this.newIp) {
				uni.showToast({ title: '请输入 IP 地址', icon: 'none' })
				return
			}
			if (this.apiIpWhitelist.includes(this.newIp)) {
				uni.showToast({ title: 'IP 已存在', icon: 'none' })
				return
			}
			this.apiIpWhitelist.push(this.newIp)
			this.newIp = ''
			this.saveApiWhitelist()
		},
		
		removeIp(index) {
			this.apiIpWhitelist.splice(index, 1)
			this.saveApiWhitelist()
		},
		
		async saveApiWhitelist() {
			try {
				await updateApiWhitelist({ ip_whitelist: this.apiIpWhitelist })
				uni.showToast({ title: '已保存', icon: 'success' })
			} catch (e) {
				console.error('保存失败', e)
			}
		},
		
		// 登录 IP 限制相关
		addAllowedIp() {
			if (!this.newAllowedIp) {
				uni.showToast({ title: '请输入 IP 地址', icon: 'none' })
				return
			}
			if (this.allowedIps.includes(this.newAllowedIp)) {
				uni.showToast({ title: 'IP 已存在', icon: 'none' })
				return
			}
			this.allowedIps.push(this.newAllowedIp)
			this.newAllowedIp = ''
			this.saveIpRestriction()
		},
		
		removeAllowedIp(index) {
			this.allowedIps.splice(index, 1)
			this.saveIpRestriction()
		},
		
		async saveIpRestriction() {
			try {
				await updateIpRestriction({ allowed_ips: this.allowedIps })
				uni.showToast({ title: '已保存', icon: 'success' })
			} catch (e) {
				console.error('保存失败', e)
			}
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
	margin-bottom: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.status-badge {
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
}

.status-badge.enabled {
	background: rgba(0,184,148,0.1);
	color: #00b894;
}

.status-badge.disabled {
	background: rgba(142,142,147,0.1);
	color: #8e8e93;
}

.refresh-btn {
	padding: 6rpx 16rpx;
	background: #f0f2f5;
	border-radius: 12rpx;
}

.refresh-btn text {
	font-size: 24rpx;
	color: #666;
}

.section-content {
	padding: 24rpx;
}

.section-desc {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	display: block;
	margin-bottom: 20rpx;
}

.btn-group {
	display: flex;
	gap: 16rpx;
	flex-wrap: wrap;
}

.action-btn {
	padding: 16rpx 32rpx;
	border-radius: 40rpx;
	font-size: 26rpx;
	font-weight: 500;
}

.action-btn.primary {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}

.action-btn.secondary {
	background: #f0f2f5;
	color: #1a1a2e;
}

.action-btn.success {
	background: #00b894;
	color: #fff;
}

.action-btn.warning {
	background: #ff6b00;
	color: #fff;
}

.action-btn.danger {
	background: #ff4d4f;
	color: #fff;
}

.api-info {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.info-row {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.info-row:last-child {
	margin-bottom: 0;
}

.info-label {
	font-size: 24rpx;
	color: #8e8e93;
	width: 160rpx;
}

.info-value {
	flex: 1;
	font-size: 26rpx;
	color: #1a1a2e;
	font-family: monospace;
}

.view-btn {
	padding: 6rpx 16rpx;
	background: #4C84FF;
	border-radius: 8rpx;
}

.view-btn text {
	font-size: 22rpx;
	color: #fff;
}

.ip-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.ip-item {
	display: flex;
	align-items: center;
	background: #f0f2f5;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}

.ip-text {
	font-size: 26rpx;
	color: #1a1a2e;
	font-family: monospace;
}

.ip-remove {
	margin-left: 12rpx;
	font-size: 28rpx;
	color: #ff4d4f;
}

.empty-tip {
	padding: 20rpx 0;
}

.empty-tip text {
	font-size: 26rpx;
	color: #8e8e93;
}

/* OAuth 绑定样式 */
.oauth-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.oauth-item:last-child {
	border-bottom: none;
}

.oauth-info {
	display: flex;
	align-items: center;
}

.oauth-icon {
	font-size: 40rpx;
	margin-right: 16rpx;
}

.oauth-detail {
	display: flex;
	flex-direction: column;
}

.oauth-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #1a1a2e;
}

.oauth-status {
	font-size: 24rpx;
	margin-top: 4rpx;
}

.oauth-status.bound {
	color: #00b894;
}

.oauth-status.unbound {
	color: #8e8e93;
}

.oauth-action .action-btn {
	padding: 12rpx 24rpx;
	font-size: 24rpx;
}

.add-ip-row {
	display: flex;
	gap: 16rpx;
	margin-top: 16rpx;
}

.ip-input {
	flex: 1;
	height: 72rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
}

.add-btn {
	padding: 0 32rpx;
	height: 72rpx;
	background: #4C84FF;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.add-btn text {
	font-size: 28rpx;
	color: #fff;
}

.history-list {
	max-height: 400rpx;
	overflow-y: auto;
}

.history-item {
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.history-item:last-child {
	border-bottom: none;
}

.history-main {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.history-ip {
	font-size: 28rpx;
	color: #1a1a2e;
	font-family: monospace;
}

.history-time {
	font-size: 24rpx;
	color: #8e8e93;
}

.history-sub {
	margin-top: 8rpx;
}

.history-ua {
	font-size: 22rpx;
	color: #8e8e93;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* 弹窗样式 */
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
	max-height: 80vh;
	overflow-y: auto;
}

.modal-content.large {
	width: 90%;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1a2e;
	text-align: center;
	margin-bottom: 24rpx;
	display: block;
}

.modal-tip {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	text-align: center;
	margin-bottom: 24rpx;
	display: block;
}

.modal-tip.warning {
	color: #ff6b00;
	background: rgba(255,107,0,0.1);
	padding: 16rpx;
	border-radius: 12rpx;
}

.qr-section {
	text-align: center;
	margin-bottom: 24rpx;
}

.qr-tip {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-bottom: 20rpx;
}

.qr-image {
	width: 300rpx;
	height: 300rpx;
	margin: 0 auto 20rpx;
	display: block;
}

.secret-row {
	background: #f8f9fa;
	padding: 16rpx;
	border-radius: 12rpx;
}

.secret-label {
	font-size: 24rpx;
	color: #8e8e93;
}

.secret-value {
	font-size: 26rpx;
	color: #1a1a2e;
	font-family: monospace;
	word-break: break-all;
}

.input-group {
	margin-bottom: 20rpx;
}

.input-label {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-bottom: 12rpx;
}

.modal-input {
	width: 100%;
	height: 88rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 30rpx;
	box-sizing: border-box;
}

.backup-codes {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-bottom: 24rpx;
}

.backup-code {
	background: #f8f9fa;
	padding: 12rpx 20rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
	font-family: monospace;
	color: #1a1a2e;
}

.secret-display {
	background: #f8f9fa;
	padding: 24rpx;
	border-radius: 12rpx;
	margin-bottom: 24rpx;
}

.secret-text {
	font-size: 28rpx;
	font-family: monospace;
	color: #1a1a2e;
	word-break: break-all;
}

.key-display {
	background: #f8f9fa;
	padding: 24rpx;
	border-radius: 12rpx;
	margin-bottom: 24rpx;
}

.key-row {
	margin-bottom: 16rpx;
}

.key-row:last-child {
	margin-bottom: 0;
}

.key-label {
	font-size: 24rpx;
	color: #8e8e93;
	display: block;
	margin-bottom: 8rpx;
}

.key-value {
	font-size: 28rpx;
	font-family: monospace;
	color: #1a1a2e;
	word-break: break-all;
}

.key-value.secret {
	color: #00b894;
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

.modal-btn.confirm.danger {
	background: #ff4d4f;
}
</style>
