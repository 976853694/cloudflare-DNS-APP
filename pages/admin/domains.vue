<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">域名管理</text>
			<text class="header-count">共 {{ domains.length }} 个</text>
		</view>
		
		<!-- 域名列表 -->
		<view class="domain-list">
			<view class="domain-card" v-for="domain in domains" :key="domain.id">
				<view class="card-main" @click="editDomain(domain)">
					<view class="domain-row">
						<text class="domain-name">{{ domain.name }}</text>
						<view class="status-badge" :class="{ open: domain.allow_register }">
							{{ domain.allow_register ? '开放' : '关闭' }}
						</view>
					</view>
					<view class="domain-stats">
						<view class="stat-item">
							<text class="stat-label">二级域名</text>
							<text class="stat-value">{{ domain.subdomains_count }}</text>
						</view>
						<view class="stat-item" v-if="domain.channel">
							<text class="stat-label">渠道</text>
							<text class="stat-value">{{ domain.channel.name }}</text>
						</view>
					</view>
					<text class="domain-desc" v-if="domain.description">{{ domain.description }}</text>
				</view>
				<view class="card-action">
					<switch :checked="domain.status === 1" @change="toggleStatus(domain)" />
				</view>
			</view>
			
			<view class="empty-state" v-if="domains.length === 0">
				<text class="empty-icon">🌐</text>
				<text class="empty-text">暂无域名</text>
			</view>
		</view>
		
		<!-- 添加按钮 -->
		<view class="fab" @click="showAdd">
			<text class="fab-icon">+</text>
		</view>
		
		<!-- 添加/编辑域名弹窗 -->
		<view class="modal" v-if="showModal" @click.self="showModal = false">
			<scroll-view class="modal-content" scroll-y>
				<text class="modal-title">{{ isEdit ? '编辑域名' : '添加域名' }}</text>
				
				<view class="form-item">
					<text class="label">DNS渠道</text>
					<picker :range="channels" range-key="name" @change="onChannelChange" :disabled="isEdit">
						<view class="picker">{{ selectedChannel?.name || '请选择' }}</view>
					</picker>
				</view>
				
				<view class="form-item" v-if="!isEdit">
					<text class="label">Zone</text>
					<picker :range="zones" range-key="name" @change="onZoneChange" :disabled="!selectedChannel || zonesLoading">
						<view class="picker">
							{{ zonesLoading ? '加载中...' : (selectedZone?.name || '请选择') }}
						</view>
					</picker>
				</view>
				
				<view class="form-item" v-if="isEdit">
					<text class="label">域名</text>
					<text class="value">{{ form.name }}</text>
				</view>
				
				<view class="form-item">
					<text class="label">描述</text>
					<input class="input" v-model="form.description" placeholder="可选" />
				</view>
				
				<view class="form-item">
					<text class="label">开放注册</text>
					<switch :checked="form.allow_register" @change="e => form.allow_register = e.detail.value" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn danger" v-if="isEdit" @click="handleDelete">
						<text>删除</text>
					</view>
					<view class="modal-btn confirm" @click="handleSave">
						<text>{{ isEdit ? '保存' : '添加' }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { getAdminDomains, addAdminDomain, updateAdminDomain, deleteAdminDomain } from '@/api/admin'
import { getChannels, getChannelZones } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			domains: [],
			channels: [],
			zones: [],
			selectedChannel: null,
			selectedZone: null,
			showModal: false,
			isEdit: false,
			currentId: null,
			zonesLoading: false,
			userInfo: null,
			form: {
				name: '',
				description: '',
				allow_register: true,
				zone_id: '',
				dns_channel_id: null
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
		this.loadDomains()
		this.loadChannels()
	},
	methods: {
		async loadDomains() {
			try {
				const res = await getAdminDomains()
				this.domains = res.data?.domains || []
			} catch (e) {
				console.error('加载域名失败:', e)
			}
		},
		async loadChannels() {
			try {
				const res = await getChannels()
				this.channels = res.data?.channels || []
			} catch (e) {
				console.error('加载渠道失败:', e)
			}
		},
		async onChannelChange(e) {
			this.selectedChannel = this.channels[e.detail.value]
			this.selectedZone = null
			this.zones = []
			if (this.selectedChannel) {
				this.zonesLoading = true
				try {
					const res = await getChannelZones(this.selectedChannel.id)
					this.zones = res.data?.zones || []
				} catch (e) {
					console.error('加载Zone失败:', e)
				} finally {
					this.zonesLoading = false
				}
			}
		},
		onZoneChange(e) {
			this.selectedZone = this.zones[e.detail.value]
		},
		showAdd() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法添加', icon: 'none' })
				return
			}
			this.isEdit = false
			this.currentId = null
			this.selectedChannel = null
			this.selectedZone = null
			this.zones = []
			this.form = {
				name: '',
				description: '',
				allow_register: true,
				zone_id: '',
				dns_channel_id: null
			}
			this.showModal = true
		},
		editDomain(domain) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			this.isEdit = true
			this.currentId = domain.id
			this.selectedChannel = domain.channel
			this.selectedZone = null
			this.form = {
				name: domain.name,
				description: domain.description || '',
				allow_register: domain.allow_register,
				zone_id: domain.zone_id,
				dns_channel_id: domain.dns_channel_id
			}
			this.showModal = true
		},
		async toggleStatus(domain) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法修改', icon: 'none' })
				return
			}
			try {
				await updateAdminDomain(domain.id, {
					status: domain.status === 1 ? 0 : 1
				})
				this.loadDomains()
			} catch (e) {
				console.error('更新状态失败:', e)
			}
		},
		async handleSave() {
			if (!this.isEdit) {
				if (!this.selectedChannel || !this.selectedZone) {
					uni.showToast({ title: '请选择渠道和Zone', icon: 'none' })
					return
				}
			}
			
			try {
				uni.showLoading({ title: this.isEdit ? '保存中...' : '添加中...' })
				
				if (this.isEdit) {
					await updateAdminDomain(this.currentId, {
						description: this.form.description,
						allow_register: this.form.allow_register
					})
				} else {
					await addAdminDomain({
						dns_channel_id: this.selectedChannel.id,
						name: this.selectedZone.name,
						zone_id: this.selectedZone.id,
						description: this.form.description,
						allow_register: this.form.allow_register
					})
				}
				
				uni.hideLoading()
				uni.showToast({ title: this.isEdit ? '保存成功' : '添加成功', icon: 'success' })
				this.showModal = false
				this.loadDomains()
			} catch (e) {
				uni.hideLoading()
			}
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个域名吗？需先删除该域名下的所有二级域名和套餐。',
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteAdminDomain(this.currentId)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.showModal = false
							this.loadDomains()
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

.domain-list {
	padding: 0 30rpx;
	margin-top: -40rpx;
	position: relative;
	z-index: 2;
}

.domain-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.card-main { flex: 1; }

.domain-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.domain-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.status-badge {
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	background: rgba(255,77,79,0.1);
	color: #ff4d4f;
}

.status-badge.open {
	background: rgba(0,184,148,0.1);
	color: #00b894;
}

.domain-stats {
	display: flex;
	gap: 24rpx;
	margin-bottom: 8rpx;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.stat-label {
	font-size: 22rpx;
	color: #8e8e93;
}

.stat-value {
	font-size: 22rpx;
	color: #1a1a2e;
	font-weight: 500;
}

.domain-desc {
	font-size: 22rpx;
	color: #8e8e93;
	display: block;
}

.card-action {
	margin-left: 16rpx;
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
	margin-bottom: 40rpx;
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
	gap: 16rpx;
	margin-top: 40rpx;
}

.modal-btn {
	flex: 1;
	height: 84rpx;
	border-radius: 42rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.modal-btn.cancel {
	background: #f0f2f5;
	color: #666;
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
