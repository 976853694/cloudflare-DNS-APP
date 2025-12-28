<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">DNS记录管理</text>
			<text class="header-count">共 {{ records.length }} 条</text>
		</view>
		
		<!-- 筛选 -->
		<view class="filter-section">
			<view class="filter-bar">
				<picker :range="domainOptions" range-key="name" @change="onDomainFilter">
					<view class="filter-picker">
						<text class="picker-text">{{ filterDomain?.name || '全部域名' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
		</view>
		
		<!-- 记录列表 -->
		<view class="record-list">
			<view class="record-card" v-for="record in records" :key="record.id" @click="editRecord(record)">
				<view class="card-header">
					<view class="type-badge" :class="record.type.toLowerCase()">{{ record.type }}</view>
					<text class="record-name">{{ record.name }}</text>
				</view>
				<view class="record-body">
					<text class="record-content">{{ record.content }}</text>
				</view>
				<view class="card-footer">
					<view class="meta-tags">
						<text class="meta-tag">TTL: {{ record.ttl === 1 ? '自动' : record.ttl }}</text>
						<text class="meta-tag proxy" v-if="record.proxied">🛡️ 代理</text>
					</view>
					<text class="card-arrow">›</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="records.length === 0 && !loading">
				<text class="empty-icon">📡</text>
				<text class="empty-text">暂无DNS记录</text>
			</view>
		</view>
		
		<!-- 编辑弹窗 -->
		<view class="modal" v-if="showModal" @click.self="showModal = false">
			<view class="modal-content">
				<text class="modal-title">编辑DNS记录</text>
				
				<view class="detail-row">
					<text class="detail-label">类型</text>
					<text class="detail-value">{{ currentRecord.type }}</text>
				</view>
				
				<view class="detail-row">
					<text class="detail-label">名称</text>
					<text class="detail-value">{{ currentRecord.name }}</text>
				</view>
				
				<view class="form-item">
					<text class="label">记录值</text>
					<input class="input" v-model="editForm.content" placeholder="输入记录值" />
				</view>
				
				<view class="form-item">
					<text class="label">TTL</text>
					<picker :range="ttlOptions" range-key="label" @change="onTtlChange">
						<view class="picker">{{ getTtlLabel(editForm.ttl) }}</view>
					</picker>
				</view>
				
				<view class="form-item">
					<text class="label">CDN代理</text>
					<switch :checked="editForm.proxied" @change="e => editForm.proxied = e.detail.value" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn danger" @click="handleDelete">
						<text>删除</text>
					</view>
					<view class="modal-btn confirm" @click="handleSave">
						<text>保存</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getAdminDnsRecords, updateAdminDnsRecord, deleteAdminDnsRecord, getAdminDomains } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			records: [],
			domains: [],
			domainOptions: [{ id: 0, name: '全部域名' }],
			filterDomain: null,
			loading: false,
			showModal: false,
			currentRecord: {},
			userInfo: null,
			editForm: {
				content: '',
				ttl: 1,
				proxied: false
			},
			ttlOptions: [
				{ value: 1, label: '自动' },
				{ value: 300, label: '5分钟' },
				{ value: 1800, label: '30分钟' },
				{ value: 3600, label: '1小时' },
				{ value: 86400, label: '1天' }
			]
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
		this.loadRecords()
	},
	methods: {
		async loadDomains() {
			try {
				const res = await getAdminDomains()
				this.domains = res.data?.domains || []
				this.domainOptions = [{ id: 0, name: '全部域名' }, ...this.domains]
			} catch (e) {}
		},
		async loadRecords() {
			this.loading = true
			try {
				const params = {}
				if (this.filterDomain?.id) {
					params.domain_id = this.filterDomain.id
				}
				const res = await getAdminDnsRecords(params)
				this.records = res.data?.records || []
			} catch (e) {
				console.error('加载DNS记录失败:', e)
			}
			this.loading = false
		},
		onDomainFilter(e) {
			this.filterDomain = this.domainOptions[e.detail.value]
			if (this.filterDomain.id === 0) {
				this.filterDomain = null
			}
			this.loadRecords()
		},
		editRecord(record) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			this.currentRecord = record
			this.editForm = {
				content: record.content,
				ttl: record.ttl || 1,
				proxied: record.proxied || false
			}
			this.showModal = true
		},
		onTtlChange(e) {
			this.editForm.ttl = this.ttlOptions[e.detail.value].value
		},
		getTtlLabel(ttl) {
			const opt = this.ttlOptions.find(o => o.value === ttl)
			return opt ? opt.label : '自动'
		},
		async handleSave() {
			if (!this.editForm.content) {
				uni.showToast({ title: '请输入记录值', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '保存中...' })
				await updateAdminDnsRecord(this.currentRecord.id, {
					domain_id: this.currentRecord.domain_id,
					content: this.editForm.content,
					ttl: this.editForm.ttl,
					proxied: this.editForm.proxied
				})
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showModal = false
				this.loadRecords()
			} catch (e) {
				uni.hideLoading()
			}
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条DNS记录吗？',
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteAdminDnsRecord(this.currentRecord.id, {
								domain_id: this.currentRecord.domain_id
							})
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.showModal = false
							this.loadRecords()
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

.filter-section {
	margin: -40rpx 30rpx 20rpx;
	position: relative;
	z-index: 2;
}

.filter-bar {
	background: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
}

.filter-picker {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 24rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
}

.picker-text {
	font-size: 28rpx;
	color: #1a1a2e;
	font-weight: 500;
}

.picker-arrow {
	font-size: 20rpx;
	color: #8e8e93;
}

.record-list {
	padding: 0 30rpx;
}

.record-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.record-header {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 12rpx;
}

.card-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.type-badge {
	font-size: 20rpx;
	font-weight: 600;
	padding: 6rpx 14rpx;
	border-radius: 8rpx;
	color: #fff;
	background: #8e8e93;
}

.type-badge.a { background: #4C84FF; }
.type-badge.aaaa { background: #6c5ce7; }
.type-badge.cname { background: #00b894; }
.type-badge.txt { background: #fdcb6e; color: #1a1a2e; }
.type-badge.mx { background: #e17055; }

.record-name {
	font-size: 26rpx;
	font-weight: 600;
	color: #1a1a2e;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.record-body {
	background: #f8f9fa;
	padding: 16rpx;
	border-radius: 12rpx;
	margin-bottom: 12rpx;
}

.record-content {
	font-size: 24rpx;
	color: #666;
	word-break: break-all;
	font-family: monospace;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.meta-tags {
	display: flex;
	gap: 12rpx;
}

.meta-tag {
	font-size: 20rpx;
	color: #8e8e93;
	background: #f0f2f5;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}

.meta-tag.proxy {
	color: #00b894;
	background: rgba(0,184,148,0.1);
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

.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-content {
	width: 85%;
	background: #fff;
	border-radius: 16rpx;
	padding: 40rpx;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #333;
	text-align: center;
	margin-bottom: 30rpx;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.detail-label {
	font-size: 28rpx;
	color: #666;
}

.detail-value {
	font-size: 28rpx;
	color: #333;
}

.form-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.label {
	font-size: 28rpx;
	color: #333;
}

.input {
	width: 280rpx;
	text-align: right;
	font-size: 28rpx;
	color: #333;
}

.picker {
	font-size: 28rpx;
	color: #4C84FF;
}

.modal-btns {
	display: flex;
	gap: 20rpx;
	margin-top: 30rpx;
}

.modal-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
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
