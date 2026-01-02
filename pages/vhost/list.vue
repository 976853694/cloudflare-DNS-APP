<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">虚拟主机</text>
				<text class="header-count">共 {{ instances.length }} 个</text>
			</view>
		</view>
		
		<!-- 状态筛选 -->
		<view class="filter-bar">
			<view 
				class="filter-item" 
				:class="{ active: statusFilter === '' }"
				@click="filterByStatus('')"
			>
				<text>全部</text>
			</view>
			<view 
				class="filter-item" 
				:class="{ active: statusFilter === 1 }"
				@click="filterByStatus(1)"
			>
				<text>正常</text>
			</view>
			<view 
				class="filter-item" 
				:class="{ active: statusFilter === 3 }"
				@click="filterByStatus(3)"
			>
				<text>已过期</text>
			</view>
			<view 
				class="filter-item" 
				:class="{ active: statusFilter === 2 }"
				@click="filterByStatus(2)"
			>
				<text>已暂停</text>
			</view>
		</view>
		
		<!-- 主机列表 -->
		<scroll-view class="host-list" scroll-y refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
			<view class="host-card" v-for="item in filteredInstances" :key="item.id" @click="goToDetail(item)">
				<view class="card-header">
					<view class="status-badge" :class="getStatusClass(item.status)">
						<text>{{ item.status_name }}</text>
					</view>
					<text class="expire-text" :class="{ warning: item.days_remaining <= 7 && item.days_remaining > 0 }">
						{{ item.days_remaining > 0 ? `剩余 ${item.days_remaining} 天` : '已过期' }}
					</text>
				</view>
				<view class="card-body">
					<text class="host-domain">{{ item.domain }}</text>
					<view class="host-info">
						<view class="info-item">
							<text class="info-icon">📦</text>
							<text class="info-text">{{ item.plan?.name || '套餐' }}</text>
						</view>
						<view class="info-item">
							<text class="info-icon">🖥️</text>
							<text class="info-text">{{ item.server?.name || '服务器' }}</text>
						</view>
					</view>
				</view>
				<view class="card-footer">
					<text class="expire-date">到期：{{ formatDate(item.expires_at) }}</text>
					<text class="arrow">›</text>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-state" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="filteredInstances.length === 0 && !loading">
				<text class="empty-icon">🖥️</text>
				<text class="empty-title">暂无主机</text>
				<text class="empty-desc">点击下方按钮购买您的第一台虚拟主机</text>
				<view class="empty-btn" @click="goToPurchase">
					<text class="empty-btn-text">立即购买</text>
				</view>
			</view>
			
			<view class="bottom-space"></view>
		</scroll-view>
		
		<!-- 添加按钮 -->
		<view class="fab" @click="goToPurchase">
			<text class="fab-icon">+</text>
		</view>
	</view>
</template>

<script>
import { getVHostInstances } from '@/api/vhost'

export default {
	data() {
		return {
			instances: [],
			statusFilter: '',
			loading: true,
			refreshing: false
		}
	},
	computed: {
		filteredInstances() {
			if (this.statusFilter === '') {
				return this.instances
			}
			return this.instances.filter(item => item.status === this.statusFilter)
		}
	},
	onShow() {
		this.loadData()
	},
	methods: {
		async onRefresh() {
			this.refreshing = true
			await this.loadData()
			this.refreshing = false
		},
		async loadData() {
			this.loading = true
			try {
				const res = await getVHostInstances()
				this.instances = res.data?.instances || []
			} catch (e) {
				console.error('加载主机列表失败', e)
			} finally {
				this.loading = false
			}
		},
		filterByStatus(status) {
			this.statusFilter = status
		},
		getStatusClass(status) {
			const map = {
				1: 'success',
				2: 'warning',
				3: 'danger'
			}
			return map[status] || ''
		},
		formatDate(dateStr) {
			if (!dateStr) return '-'
			const date = new Date(dateStr)
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		},
		goToDetail(item) {
			uni.navigateTo({ url: `/pages/vhost/detail?id=${item.id}` })
		},
		goToPurchase() {
			uni.navigateTo({ url: '/pages/vhost/purchase' })
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

.header-content {
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
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.7);
	background: rgba(255, 255, 255, 0.1);
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
}

.filter-bar {
	display: flex;
	background: #fff;
	margin: -30rpx 30rpx 20rpx;
	padding: 16rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	gap: 12rpx;
}

.filter-item {
	flex: 1;
	text-align: center;
	padding: 16rpx 0;
	border-radius: 12rpx;
	background: #f8f9fa;
}

.filter-item text {
	font-size: 26rpx;
	color: #666;
}

.filter-item.active {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.filter-item.active text {
	color: #fff;
	font-weight: 500;
}

.host-list {
	margin: 0 30rpx;
	height: calc(100vh - 280rpx);
}

.host-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.status-badge {
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	background: #f0f2f5;
}

.status-badge text {
	font-size: 22rpx;
	color: #666;
}

.status-badge.success {
	background: rgba(0, 184, 148, 0.1);
}

.status-badge.success text {
	color: #00b894;
}

.status-badge.warning {
	background: rgba(255, 107, 0, 0.1);
}

.status-badge.warning text {
	color: #ff6b00;
}

.status-badge.danger {
	background: rgba(255, 77, 79, 0.1);
}

.status-badge.danger text {
	color: #ff4d4f;
}

.expire-text {
	font-size: 24rpx;
	color: #00b894;
}

.expire-text.warning {
	color: #ff6b00;
}

.card-body {
	margin-bottom: 16rpx;
}

.host-domain {
	display: block;
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 12rpx;
}

.host-info {
	display: flex;
	gap: 24rpx;
}

.info-item {
	display: flex;
	align-items: center;
}

.info-icon {
	font-size: 24rpx;
	margin-right: 8rpx;
}

.info-text {
	font-size: 24rpx;
	color: #8e8e93;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f2f5;
}

.expire-date {
	font-size: 24rpx;
	color: #8e8e93;
}

.arrow {
	font-size: 36rpx;
	color: #c7c7cc;
}

.loading-state {
	text-align: center;
	padding: 60rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #8e8e93;
}

.bottom-space {
	height: 150rpx;
}

.empty-state {
	text-align: center;
	padding: 120rpx 60rpx;
}

.empty-icon {
	font-size: 100rpx;
	display: block;
	margin-bottom: 32rpx;
}

.empty-title {
	display: block;
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 16rpx;
}

.empty-desc {
	display: block;
	font-size: 28rpx;
	color: #8e8e93;
	margin-bottom: 48rpx;
}

.empty-btn {
	display: inline-block;
	padding: 24rpx 64rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 44rpx;
	box-shadow: 0 8rpx 24rpx rgba(26, 26, 46, 0.3);
}

.empty-btn-text {
	font-size: 30rpx;
	color: #fff;
	font-weight: 600;
}

.fab {
	position: fixed;
	right: 40rpx;
	bottom: 100rpx;
	width: 110rpx;
	height: 110rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 55rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 12rpx 32rpx rgba(26, 26, 46, 0.4);
}

.fab-icon {
	font-size: 52rpx;
	color: #fff;
	font-weight: 300;
}
</style>
