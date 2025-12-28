<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">二级域名管理</text>
			<text class="header-count">共 {{ subdomains.length }} 个</text>
		</view>
		
		<!-- 搜索筛选 -->
		<view class="search-section">
			<view class="search-bar">
				<text class="search-icon">🔍</text>
				<input class="search-input" v-model="searchKey" placeholder="搜索域名" @confirm="doSearch" />
				<view class="search-btn" @click="doSearch">搜索</view>
			</view>
		</view>
		
		<!-- 筛选条件 -->
		<view class="filter-row">
			<picker :range="statusList" :range-key="'label'" @change="onStatusChange">
				<view class="filter-chip">
					<text class="chip-text">{{ currentStatusLabel }}</text>
					<text class="chip-arrow">▼</text>
				</view>
			</picker>
			<picker :range="expiredList" :range-key="'label'" @change="onExpiredChange">
				<view class="filter-chip">
					<text class="chip-text">{{ currentExpiredLabel }}</text>
					<text class="chip-arrow">▼</text>
				</view>
			</picker>
		</view>
		
		<!-- 域名列表 -->
		<view class="subdomain-list">
			<view class="subdomain-card" v-for="item in subdomains" :key="item.id" @click="showDetail(item)">
				<view class="card-header">
					<text class="subdomain-name">{{ item.full_name }}</text>
					<view class="status-badge" :class="getStatusClass(item)">{{ getStatusText(item) }}</view>
				</view>
				<view class="card-info">
					<text class="info-item">👤 {{ item.user?.username }}</text>
					<text class="info-item">📝 {{ item.records_count }} 条记录</text>
				</view>
				<view class="card-footer">
					<text class="expire-tag" :class="{ expired: item.is_expired }">
						{{ item.is_expired ? '已过期' : '到期: ' + formatDate(item.expires_at) }}
					</text>
					<text class="card-arrow">›</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="subdomains.length === 0 && !loading">
				<text class="empty-icon">🔗</text>
				<text class="empty-text">暂无数据</text>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore" @click="loadMore">
			<text>{{ loading ? '加载中...' : '加载更多' }}</text>
		</view>
		
		<!-- 详情弹窗 -->
		<view class="modal" v-if="showModal" @click.self="showModal = false">
			<view class="modal-content">
				<text class="modal-title">域名详情</text>
				
				<view class="detail-item">
					<text class="detail-label">域名</text>
					<text class="detail-value">{{ currentItem.full_name }}</text>
				</view>
				<view class="detail-item">
					<text class="detail-label">所属用户</text>
					<text class="detail-value">{{ currentItem.user?.username }}</text>
				</view>
				<view class="detail-item">
					<text class="detail-label">状态</text>
					<picker :range="statusOptions" :range-key="'label'" @change="onEditStatusChange">
						<view class="picker">{{ getEditStatusLabel() }}</view>
					</picker>
				</view>
				<view class="detail-item">
					<text class="detail-label">延期天数</text>
					<input class="detail-input" type="number" v-model="extendDays" placeholder="输入天数" />
				</view>
				<view class="detail-item">
					<text class="detail-label">到期时间</text>
					<text class="detail-value">{{ formatDate(currentItem.expires_at) }}</text>
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showModal = false">取消</view>
					<view class="modal-btn danger" @click="handleDelete">删除</view>
					<view class="modal-btn confirm" @click="handleSave">保存</view>
				</view>
				
				<view class="extra-actions">
					<view class="action-btn" @click="handleSendEmail">发送到期提醒</view>
					<view class="action-btn warning" @click="handleClearDns">清理DNS记录</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getAdminSubdomains, updateAdminSubdomain, deleteAdminSubdomain, sendSubdomainExpiryEmail, clearSubdomainDns } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			subdomains: [],
			searchKey: '',
			page: 1,
			hasMore: true,
			loading: false,
			showModal: false,
			currentItem: {},
			extendDays: '',
			editStatus: 1,
			userInfo: null,
			statusList: [
				{ value: '', label: '全部状态' },
				{ value: 0, label: '禁用' },
				{ value: 1, label: '正常' },
				{ value: 2, label: '待审核' }
			],
			expiredList: [
				{ value: '', label: '全部' },
				{ value: '1', label: '已过期' },
				{ value: '0', label: '未过期' }
			],
			statusOptions: [
				{ value: 0, label: '禁用' },
				{ value: 1, label: '正常' },
				{ value: 2, label: '待审核' }
			],
			filterStatus: '',
			filterExpired: ''
		}
	},
	computed: {
		currentStatusLabel() {
			const item = this.statusList.find(s => s.value === this.filterStatus)
			return item ? item.label : '全部状态'
		},
		currentExpiredLabel() {
			const item = this.expiredList.find(s => s.value === this.filterExpired)
			return item ? item.label : '全部'
		},
		isDemo() {
			return this.userInfo?.role === 'demo'
		}
	},
	onLoad() {
		this.userInfo = getStoredUserInfo()
		this.loadData()
	},
	methods: {
		async loadData() {
			if (this.loading) return
			this.loading = true
			try {
				const params = { page: this.page, per_page: 20 }
				if (this.searchKey) params.search = this.searchKey
				if (this.filterStatus !== '') params.status = this.filterStatus
				if (this.filterExpired !== '') params.expired = this.filterExpired
				
				const res = await getAdminSubdomains(params)
				const list = res.data?.subdomains || []
				if (this.page === 1) {
					this.subdomains = list
				} else {
					this.subdomains = [...this.subdomains, ...list]
				}
				const pagination = res.data?.pagination || {}
				this.hasMore = this.page < pagination.pages
			} catch (e) {
				console.error(e)
			}
			this.loading = false
		},
		doSearch() {
			this.page = 1
			this.loadData()
		},
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++
				this.loadData()
			}
		},
		onStatusChange(e) {
			this.filterStatus = this.statusList[e.detail.value].value
			this.page = 1
			this.loadData()
		},
		onExpiredChange(e) {
			this.filterExpired = this.expiredList[e.detail.value].value
			this.page = 1
			this.loadData()
		},
		getStatusClass(item) {
			if (item.is_expired) return 'expired'
			if (item.status === 0) return 'disabled'
			if (item.status === 2) return 'pending'
			return 'normal'
		},
		getStatusText(item) {
			if (item.is_expired) return '已过期'
			if (item.status === 0) return '禁用'
			if (item.status === 2) return '待审核'
			return '正常'
		},
		formatDate(str) {
			if (!str) return '-'
			return str.replace('T', ' ').substring(0, 10)
		},
		showDetail(item) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			this.currentItem = { ...item }
			this.editStatus = item.status
			this.extendDays = ''
			this.showModal = true
		},
		onEditStatusChange(e) {
			this.editStatus = this.statusOptions[e.detail.value].value
		},
		getEditStatusLabel() {
			const item = this.statusOptions.find(s => s.value === this.editStatus)
			return item ? item.label : '正常'
		},
		async handleSave() {
			try {
				uni.showLoading({ title: '保存中...' })
				const data = { status: this.editStatus }
				if (this.extendDays) {
					data.extend_days = parseInt(this.extendDays)
				}
				await updateAdminSubdomain(this.currentItem.id, data)
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showModal = false
				this.page = 1
				this.loadData()
			} catch (e) {
				uni.hideLoading()
			}
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除 ${this.currentItem.full_name} 吗？将同时删除DNS记录！`,
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteAdminSubdomain(this.currentItem.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.showModal = false
							this.page = 1
							this.loadData()
						} catch (e) {}
					}
				}
			})
		},
		async handleSendEmail() {
			try {
				await sendSubdomainExpiryEmail(this.currentItem.id)
				uni.showToast({ title: '邮件已发送', icon: 'success' })
			} catch (e) {}
		},
		handleClearDns() {
			uni.showModal({
				title: '确认清理',
				content: '确定要清理该域名的所有DNS记录吗？',
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await clearSubdomainDns(this.currentItem.id)
							uni.showToast({ title: '清理成功', icon: 'success' })
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

.search-section {
	margin: -40rpx 30rpx 16rpx;
	position: relative;
	z-index: 2;
}

.search-bar {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 20rpx;
	padding: 16rpx 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
	gap: 16rpx;
}

.search-icon { font-size: 28rpx; }

.search-input {
	flex: 1;
	height: 56rpx;
	font-size: 28rpx;
	background: transparent;
}

.search-btn {
	height: 56rpx;
	padding: 0 28rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
	border-radius: 28rpx;
	display: flex;
	align-items: center;
	font-size: 26rpx;
}

.filter-row {
	display: flex;
	padding: 0 30rpx 16rpx;
	gap: 16rpx;
}

.filter-chip {
	display: flex;
	align-items: center;
	padding: 12rpx 20rpx;
	background: #fff;
	border-radius: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.chip-text {
	font-size: 24rpx;
	color: #1a1a2e;
}

.chip-arrow {
	margin-left: 8rpx;
	font-size: 18rpx;
	color: #8e8e93;
}

.subdomain-list { padding: 0 30rpx; }

.subdomain-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.subdomain-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.status-badge {
	font-size: 20rpx;
	padding: 6rpx 14rpx;
	border-radius: 8rpx;
	font-weight: 500;
}

.status-badge.normal {
	color: #00b894;
	background: rgba(0,184,148,0.1);
}

.status-badge.disabled {
	color: #ff4d4f;
	background: rgba(255,77,79,0.1);
}

.status-badge.pending {
	color: #fdcb6e;
	background: rgba(253,203,110,0.1);
}

.status-badge.expired {
	color: #8e8e93;
	background: #f0f2f5;
}

.card-info {
	display: flex;
	gap: 24rpx;
	margin-bottom: 12rpx;
}

.info-item {
	font-size: 24rpx;
	color: #8e8e93;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.expire-tag {
	font-size: 24rpx;
	color: #4C84FF;
}

.expire-tag.expired {
	color: #ff4d4f;
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

.load-more {
	padding: 30rpx;
	text-align: center;
	color: #8e8e93;
	font-size: 26rpx;
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
	max-height: 80vh;
	overflow-y: auto;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1a2e;
	text-align: center;
	margin-bottom: 40rpx;
}

.detail-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.detail-label {
	font-size: 28rpx;
	color: #8e8e93;
}

.detail-value {
	font-size: 28rpx;
	color: #1a1a2e;
	font-weight: 500;
}

.detail-input {
	width: 200rpx;
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
	font-weight: 500;
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

.extra-actions {
	margin-top: 30rpx;
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	height: 70rpx;
	border: 1rpx solid #4C84FF;
	color: #4C84FF;
	border-radius: 35rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
}

.action-btn.warning {
	border-color: #ff4d4f;
	color: #ff4d4f;
}
</style>
