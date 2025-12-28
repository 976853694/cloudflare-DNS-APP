<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">订单管理</text>
			<text class="header-count">共 {{ orders.length }} 条</text>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-bar">
				<text class="search-icon">🔍</text>
				<input class="search-input" v-model="searchKey" placeholder="搜索域名/套餐名" @confirm="doSearch" />
				<view class="search-btn" @click="doSearch">搜索</view>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-card" v-for="order in orders" :key="order.id">
				<view class="card-header">
					<text class="order-domain">{{ order.subdomain_name }}</text>
					<text class="order-price">{{ order.price_text || ('¥' + order.price) }}</text>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="info-label">用户</text>
						<text class="info-value">{{ order.user?.username }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">套餐</text>
						<text class="info-value">{{ order.plan_name }}</text>
					</view>
				</view>
				<view class="card-footer">
					<text class="order-duration">{{ order.duration_text }}</text>
					<text class="order-time">{{ formatTime(order.created_at) }}</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="orders.length === 0 && !loading">
				<text class="empty-icon">📋</text>
				<text class="empty-text">暂无订单</text>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore" @click="loadMore">
			<text>{{ loading ? '加载中...' : '加载更多' }}</text>
		</view>
	</view>
</template>

<script>
import { getAdminOrders } from '@/api/admin'

export default {
	data() {
		return {
			orders: [],
			searchKey: '',
			page: 1,
			hasMore: true,
			loading: false
		}
	},
	onLoad() {
		this.loadOrders()
	},
	methods: {
		async loadOrders() {
			if (this.loading) return
			this.loading = true
			try {
				const params = { page: this.page, per_page: 20 }
				if (this.searchKey) {
					params.search = this.searchKey
				}
				const res = await getAdminOrders(params)
				const list = res.data?.records || []
				if (this.page === 1) {
					this.orders = list
				} else {
					this.orders = [...this.orders, ...list]
				}
				const pagination = res.data?.pagination || {}
				this.hasMore = this.page < pagination.pages
			} catch (e) {
				console.error('订单加载失败:', e)
			}
			this.loading = false
		},
		doSearch() {
			this.page = 1
			this.loadOrders()
		},
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++
				this.loadOrders()
			}
		},
		formatTime(str) {
			if (!str) return ''
			return str.replace('T', ' ').substring(0, 16)
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
	margin: -40rpx 30rpx 20rpx;
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

.order-list { padding: 0 30rpx; }

.order-card {
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
	padding-bottom: 16rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-domain {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.order-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff6b00;
}

.card-body {
	margin-bottom: 16rpx;
}

.info-row {
	display: flex;
	justify-content: space-between;
	padding: 8rpx 0;
}

.info-label {
	font-size: 24rpx;
	color: #8e8e93;
}

.info-value {
	font-size: 24rpx;
	color: #1a1a2e;
	font-weight: 500;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 12rpx;
	border-top: 1rpx dashed #e0e0e0;
}

.order-duration {
	font-size: 22rpx;
	padding: 6rpx 14rpx;
	border-radius: 8rpx;
	color: #4C84FF;
	background: rgba(76,132,255,0.1);
	font-weight: 500;
}

.order-time {
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
	color: #999;
	font-size: 28rpx;
}
</style>
