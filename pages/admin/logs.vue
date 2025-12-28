<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">操作日志</text>
			<view class="header-action" @click="handleClearAll">
				<text class="action-text">清空</text>
			</view>
		</view>
		
		<!-- 筛选栏 -->
		<view class="filter-section">
			<view class="filter-bar">
				<picker :range="actionList" :range-key="'label'" @change="onActionChange">
					<view class="filter-picker">
						<text class="picker-text">{{ currentActionLabel }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
		</view>
		
		<!-- 日志列表 -->
		<view class="log-list">
			<view class="log-card" v-for="log in logs" :key="log.id" @longpress="showDeleteConfirm(log)">
				<view class="card-header">
					<view class="user-info">
						<view class="user-avatar">{{ log.username?.charAt(0)?.toUpperCase() || 'U' }}</view>
						<text class="user-name">{{ log.username }}</text>
					</view>
					<view class="action-badge" :class="log.action">{{ getActionText(log.action) }}</view>
				</view>
				<view class="card-body">
					<text class="log-detail">{{ log.detail }}</text>
				</view>
				<view class="card-footer">
					<text class="log-target">{{ log.target_type }} #{{ log.target_id }}</text>
					<text class="log-ip">{{ log.ip_address }}</text>
					<text class="log-time">{{ formatTime(log.created_at) }}</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="logs.length === 0 && !loading">
				<text class="empty-icon">📜</text>
				<text class="empty-text">暂无日志</text>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore" @click="loadMore">
			<text>{{ loading ? '加载中...' : '加载更多' }}</text>
		</view>
	</view>
</template>

<script>
import { getAdminLogs, deleteAdminLog, batchDeleteAdminLogs } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			logs: [],
			page: 1,
			hasMore: true,
			loading: false,
			filterAction: '',
			userInfo: null,
			actionList: [
				{ value: '', label: '全部操作' },
				{ value: 'create', label: '创建' },
				{ value: 'update', label: '更新' },
				{ value: 'delete', label: '删除' },
				{ value: 'login', label: '登录' }
			]
		}
	},
	computed: {
		currentActionLabel() {
			const item = this.actionList.find(a => a.value === this.filterAction)
			return item ? item.label : '全部操作'
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
				if (this.filterAction) params.action = this.filterAction
				
				const res = await getAdminLogs(params)
				const list = res.data?.logs || []
				if (this.page === 1) {
					this.logs = list
				} else {
					this.logs = [...this.logs, ...list]
				}
				const pagination = res.data?.pagination || {}
				this.hasMore = this.page < pagination.pages
			} catch (e) {
				console.error(e)
			}
			this.loading = false
		},
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++
				this.loadData()
			}
		},
		onActionChange(e) {
			this.filterAction = this.actionList[e.detail.value].value
			this.page = 1
			this.loadData()
		},
		getActionText(action) {
			const map = {
				create: '创建',
				update: '更新',
				delete: '删除',
				login: '登录'
			}
			return map[action] || action
		},
		formatTime(str) {
			if (!str) return ''
			return str.replace('T', ' ').substring(0, 16)
		},
		showDeleteConfirm(log) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法删除', icon: 'none' })
				return
			}
			uni.showActionSheet({
				itemList: ['删除此条日志'],
				success: async (res) => {
					if (res.tapIndex === 0) {
						try {
							await deleteAdminLog(log.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.page = 1
							this.loadData()
						} catch (e) {}
					}
				}
			})
		},
		handleClearAll() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法清空', icon: 'none' })
				return
			}
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有日志吗？此操作不可恢复！',
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await batchDeleteAdminLogs({ clear_all: true })
							uni.showToast({ title: '清空成功', icon: 'success' })
							this.page = 1
							this.loadData()
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

.header-action {
	padding: 10rpx 24rpx;
	background: rgba(255,77,79,0.2);
	border-radius: 20rpx;
}

.action-text {
	font-size: 24rpx;
	color: #ff6b6b;
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

.log-list { padding: 0 30rpx; }

.log-card {
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
	margin-bottom: 16rpx;
}

.user-info {
	display: flex;
	align-items: center;
}

.user-avatar {
	width: 56rpx;
	height: 56rpx;
	border-radius: 14rpx;
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	color: #fff;
	font-size: 24rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16rpx;
}

.user-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.action-badge {
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	font-weight: 500;
}

.action-badge.create {
	color: #00b894;
	background: rgba(0,184,148,0.1);
}

.action-badge.update {
	color: #4C84FF;
	background: rgba(76,132,255,0.1);
}

.action-badge.delete {
	color: #ff4d4f;
	background: rgba(255,77,79,0.1);
}

.action-badge.login {
	color: #6c5ce7;
	background: rgba(108,92,231,0.1);
}

.card-body {
	background: #f8f9fa;
	padding: 16rpx 20rpx;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
}

.log-detail {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.card-footer {
	display: flex;
	gap: 20rpx;
	flex-wrap: wrap;
}

.log-target, .log-ip, .log-time {
	font-size: 22rpx;
	color: #8e8e93;
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
</style>
