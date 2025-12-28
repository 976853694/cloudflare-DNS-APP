<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">渠道管理</text>
			<text class="header-count">共 {{ channels.length }} 个</text>
		</view>
		
		<!-- 渠道列表 -->
		<view class="account-list">
			<view class="account-card" v-for="channel in channels" :key="channel.id" @click="editChannel(channel)">
				<view class="card-icon">{{ getProviderIcon(channel.provider_type) }}</view>
				<view class="card-main">
					<text class="account-name">{{ channel.name }}</text>
					<text class="account-email">{{ getProviderName(channel.provider_type) }}</text>
					<view class="account-stats">
						<view class="auth-badge" :class="{ active: channel.status === 1 }">
							{{ channel.status === 1 ? '正常' : '禁用' }}
						</view>
						<text class="stat-text">{{ channel.domains_count || 0 }} 域名</text>
						<text class="stat-text" v-if="channel.remark">· {{ channel.remark }}</text>
					</view>
				</view>
				<text class="card-arrow">›</text>
			</view>
			
			<view class="empty-state" v-if="channels.length === 0">
				<text class="empty-icon">☁️</text>
				<text class="empty-text">暂无渠道</text>
			</view>
		</view>
		
		<!-- 添加按钮 -->
		<view class="fab" @click="showAdd">
			<text class="fab-icon">+</text>
		</view>
		
		<!-- 编辑弹窗 -->
		<view class="modal" v-if="showModal" @click.self="showModal = false">
			<scroll-view class="modal-content" scroll-y>
				<text class="modal-title">{{ isEdit ? '编辑渠道' : '添加渠道' }}</text>
				
				<view class="form-item">
					<text class="label">渠道名称</text>
					<input class="input" v-model="form.name" placeholder="输入名称" />
				</view>
				
				<view class="form-item" v-if="!isEdit">
					<text class="label">服务商</text>
					<picker :range="providers" range-key="name" @change="onProviderChange">
						<view class="picker">{{ selectedProvider?.name || '请选择' }}</view>
					</picker>
				</view>
				
				<view class="form-item" v-if="isEdit">
					<text class="label">服务商</text>
					<text class="value">{{ getProviderName(form.provider_type) }}</text>
				</view>
				
				<!-- 动态凭据字段 -->
				<view v-if="selectedProvider || isEdit">
					<view class="form-item" v-for="field in credentialFields" :key="field.key">
						<text class="label">{{ field.label }}</text>
						<input class="input" v-model="form.credentials[field.key]" 
							:placeholder="isEdit ? '留空不修改' : field.placeholder"
							:type="field.secret ? 'password' : 'text'" />
					</view>
				</view>
				
				<view class="form-item">
					<text class="label">备注</text>
					<input class="input" v-model="form.remark" placeholder="可选" />
				</view>
				
				<view class="form-item" v-if="isEdit">
					<text class="label">状态</text>
					<switch :checked="form.status === 1" @change="e => form.status = e.detail.value ? 1 : 0" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn verify" v-if="isEdit" @click="handleVerify">
						<text>验证</text>
					</view>
					<view class="modal-btn danger" v-if="isEdit" @click="handleDelete">
						<text>删除</text>
					</view>
					<view class="modal-btn confirm" @click="handleSave">
						<text>保存</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { getChannels, getChannelProviders, createChannel, updateChannel, deleteChannel, verifyChannel } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			channels: [],
			providers: [],
			showModal: false,
			isEdit: false,
			currentId: null,
			selectedProvider: null,
			userInfo: null,
			form: {
				name: '',
				provider_type: '',
				credentials: {},
				remark: '',
				status: 1
			}
		}
	},
	computed: {
		isDemo() {
			return this.userInfo?.role === 'demo'
		},
		credentialFields() {
			const providerType = this.isEdit ? this.form.provider_type : this.selectedProvider?.type
			const fieldMap = {
				cloudflare: [
					{ key: 'api_key', label: 'API Key', placeholder: '输入 Global API Key', secret: true },
					{ key: 'email', label: '邮箱', placeholder: '输入 Cloudflare 邮箱' }
				],
				aliyun: [
					{ key: 'access_key_id', label: 'AccessKey ID', placeholder: '输入 AccessKey ID' },
					{ key: 'access_key_secret', label: 'AccessKey Secret', placeholder: '输入 AccessKey Secret', secret: true }
				],
				dnspod: [
					{ key: 'secret_id', label: 'SecretId', placeholder: '输入 SecretId' },
					{ key: 'secret_key', label: 'SecretKey', placeholder: '输入 SecretKey', secret: true }
				],
				huawei: [
					{ key: 'ak', label: 'AK', placeholder: '输入 Access Key' },
					{ key: 'sk', label: 'SK', placeholder: '输入 Secret Key', secret: true }
				],
				westcn: [
					{ key: 'username', label: '用户名', placeholder: '输入用户名' },
					{ key: 'api_password', label: 'API密码', placeholder: '输入 API 密码', secret: true }
				],
				route53: [
					{ key: 'access_key_id', label: 'Access Key ID', placeholder: '输入 Access Key ID' },
					{ key: 'secret_access_key', label: 'Secret Access Key', placeholder: '输入 Secret Access Key', secret: true }
				],
				godaddy: [
					{ key: 'api_key', label: 'API Key', placeholder: '输入 API Key' },
					{ key: 'api_secret', label: 'API Secret', placeholder: '输入 API Secret', secret: true }
				],
				namecheap: [
					{ key: 'api_user', label: 'API User', placeholder: '输入 API User' },
					{ key: 'api_key', label: 'API Key', placeholder: '输入 API Key', secret: true },
					{ key: 'client_ip', label: 'Client IP', placeholder: '输入白名单 IP' }
				],
				namecom: [
					{ key: 'username', label: '用户名', placeholder: '输入用户名' },
					{ key: 'api_token', label: 'API Token', placeholder: '输入 API Token', secret: true }
				],
				baiducloud: [
					{ key: 'access_key', label: 'Access Key', placeholder: '输入 Access Key' },
					{ key: 'secret_key', label: 'Secret Key', placeholder: '输入 Secret Key', secret: true }
				],
				namesilo: [
					{ key: 'api_key', label: 'API Key', placeholder: '输入 API Key', secret: true }
				]
			}
			return fieldMap[providerType] || []
		}
	},
	onLoad() {
		this.userInfo = getStoredUserInfo()
		this.loadChannels()
		this.loadProviders()
	},
	methods: {
		async loadChannels() {
			try {
				const res = await getChannels()
				this.channels = res.data?.channels || []
			} catch (e) {
				console.error('加载渠道失败:', e)
			}
		},
		async loadProviders() {
			try {
				const res = await getChannelProviders()
				this.providers = res.data?.providers || []
			} catch (e) {
				// 使用默认列表
				this.providers = [
					{ type: 'cloudflare', name: 'Cloudflare' },
					{ type: 'aliyun', name: '阿里云DNS' },
					{ type: 'dnspod', name: '腾讯云DNSPod' },
					{ type: 'huawei', name: '华为云DNS' },
					{ type: 'westcn', name: '西部数码' },
					{ type: 'route53', name: 'AWS Route53' },
					{ type: 'godaddy', name: 'GoDaddy' },
					{ type: 'namecheap', name: 'Namecheap' },
					{ type: 'namecom', name: 'Name.com' },
					{ type: 'baiducloud', name: '百度智能云' },
					{ type: 'namesilo', name: 'NameSilo' }
				]
			}
		},
		getProviderIcon(type) {
			const icons = {
				cloudflare: '☁️',
				aliyun: '🌐',
				dnspod: '🔷',
				huawei: '🔴',
				westcn: '🌏',
				route53: '🟠',
				godaddy: '🟢',
				namecheap: '🔶',
				namecom: '📛',
				baiducloud: '🔵',
				namesilo: '🟣'
			}
			return icons[type] || '☁️'
		},
		getProviderName(type) {
			const provider = this.providers.find(p => p.type === type)
			return provider?.name || type
		},
		showAdd() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法添加', icon: 'none' })
				return
			}
			this.isEdit = false
			this.currentId = null
			this.selectedProvider = null
			this.form = {
				name: '',
				provider_type: '',
				credentials: {},
				remark: '',
				status: 1
			}
			this.showModal = true
		},
		editChannel(channel) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			this.isEdit = true
			this.currentId = channel.id
			this.selectedProvider = null
			this.form = {
				name: channel.name,
				provider_type: channel.provider_type,
				credentials: {},
				remark: channel.remark || '',
				status: channel.status
			}
			this.showModal = true
		},
		onProviderChange(e) {
			this.selectedProvider = this.providers[e.detail.value]
			this.form.provider_type = this.selectedProvider.type
			this.form.credentials = {}
		},
		async handleVerify() {
			try {
				uni.showLoading({ title: '验证中...' })
				await verifyChannel(this.currentId)
				uni.hideLoading()
				uni.showToast({ title: '验证成功', icon: 'success' })
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: '验证失败', icon: 'none' })
			}
		},
		async handleSave() {
			if (!this.form.name) {
				uni.showToast({ title: '请输入渠道名称', icon: 'none' })
				return
			}
			if (!this.isEdit && !this.form.provider_type) {
				uni.showToast({ title: '请选择服务商', icon: 'none' })
				return
			}
			
			// 验证凭据（新建时必填）
			if (!this.isEdit) {
				for (const field of this.credentialFields) {
					if (!this.form.credentials[field.key]) {
						uni.showToast({ title: `请输入${field.label}`, icon: 'none' })
						return
					}
				}
			}
			
			try {
				uni.showLoading({ title: '保存中...' })
				const data = {
					name: this.form.name,
					remark: this.form.remark
				}
				
				if (this.isEdit) {
					data.status = this.form.status
					// 只传有值的凭据
					const credentials = {}
					for (const key in this.form.credentials) {
						if (this.form.credentials[key]) {
							credentials[key] = this.form.credentials[key]
						}
					}
					if (Object.keys(credentials).length > 0) {
						data.credentials = credentials
					}
					await updateChannel(this.currentId, data)
				} else {
					data.provider_type = this.form.provider_type
					data.credentials = this.form.credentials
					await createChannel(data)
				}
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showModal = false
				this.loadChannels()
			} catch (e) {
				uni.hideLoading()
			}
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个渠道吗？需先删除该渠道下的所有域名。',
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteChannel(this.currentId)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.showModal = false
							this.loadChannels()
						} catch (e) {}
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
	padding-bottom: 150rpx;
}

.page-header {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 40rpx 30rpx 70rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.header-count {
	font-size: 24rpx;
	color: rgba(255,255,255,0.7);
	background: rgba(255,255,255,0.1);
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
}

.account-list {
	padding: 0 30rpx;
	margin-top: -40rpx;
	position: relative;
	z-index: 2;
}

.account-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.card-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.card-main { flex: 1; }

.account-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 6rpx;
	display: block;
}

.account-email {
	font-size: 24rpx;
	color: #4C84FF;
	margin-bottom: 10rpx;
	display: block;
}

.account-stats {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.auth-badge {
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	background: rgba(255,77,79,0.1);
	color: #ff4d4f;
	border-radius: 6rpx;
}

.auth-badge.active {
	background: rgba(0,184,148,0.1);
	color: #00b894;
}

.stat-text {
	font-size: 22rpx;
	color: #8e8e93;
}

.card-arrow {
	font-size: 32rpx;
	color: #c7c7cc;
}

.empty-state {
	padding: 100rpx;
	text-align: center;
}

.empty-icon {
	font-size: 80rpx;
	display: block;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #8e8e93;
}

.fab {
	position: fixed;
	right: 40rpx;
	bottom: 100rpx;
	width: 110rpx;
	height: 110rpx;
	border-radius: 55rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 12rpx 32rpx rgba(26,26,46,0.4);
}

.fab-icon {
	font-size: 48rpx;
	color: #fff;
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
	max-height: 80vh;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1a2e;
	text-align: center;
	margin-bottom: 30rpx;
}

.form-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.label {
	font-size: 28rpx;
	color: #8e8e93;
	flex-shrink: 0;
}

.value {
	font-size: 28rpx;
	color: #1a1a2e;
}

.input {
	width: 320rpx;
	text-align: right;
	font-size: 28rpx;
	color: #1a1a2e;
	background: #f8f9fa;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}

.picker {
	font-size: 28rpx;
	color: #4C84FF;
	font-weight: 500;
}

.modal-btns {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-top: 30rpx;
}

.modal-btn {
	flex: 1;
	min-width: 140rpx;
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

.modal-btn.verify {
	background: rgba(76,132,255,0.1);
	color: #4C84FF;
}

.modal-btn.danger {
	background: rgba(255,77,79,0.1);
	color: #ff4d4f;
}

.modal-btn.confirm {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}
</style>
