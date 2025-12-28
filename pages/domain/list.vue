<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">我的域名</text>
				<text class="header-count">共 {{ subdomains.length }} 个</text>
			</view>
		</view>
		
		<!-- 域名列表 -->
		<scroll-view class="domain-list" scroll-y refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
			<view class="domain-card" v-for="item in subdomains" :key="item.id" @click="goToDetail(item)">
				<view class="card-left">
					<view class="status-dot" :class="{ expired: item.is_expired }"></view>
				</view>
				<view class="card-main">
					<text class="domain-name">{{ item.full_name }}</text>
					<view class="domain-meta">
						<text class="meta-item">{{ item.plan?.name || '套餐' }}</text>
						<text class="meta-dot">·</text>
						<text class="meta-item">{{ item.records_count }} 条记录</text>
					</view>
				</view>
				<view class="card-right">
					<text class="expire-text" :class="{ expired: item.is_expired }">
						{{ item.is_expired ? '已过期' : `${item.days_remaining}天` }}
					</text>
					<text class="arrow">›</text>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-state" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="subdomains.length === 0 && !loading">
				<text class="empty-icon">🌐</text>
				<text class="empty-title">暂无域名</text>
				<text class="empty-desc">点击下方按钮注册您的第一个域名</text>
				<view class="empty-btn" @click="goToPurchase">
					<text class="empty-btn-text">立即注册</text>
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
import { getSubdomains } from '@/api/domain'

export default {
	data() {
		return {
			subdomains: [],
			loading: true,
			refreshing: false
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
				const res = await getSubdomains()
				this.subdomains = res.data?.subdomains || []
			} catch (e) {
				console.error('加载域名失败', e)
			} finally {
				this.loading = false
			}
		},
		goToDetail(item) {
			uni.navigateTo({ url: `/pages/domain/detail?id=${item.id}` })
		},
		goToPurchase() {
			uni.navigateTo({ url: '/pages/domain/purchase' })
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #f0f2f5;
}

/* 页面头部 */
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

/* 域名列表 */
.domain-list {
	margin: -30rpx 30rpx 0;
	position: relative;
	z-index: 2;
	height: calc(100vh - 200rpx);
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

.domain-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx 24rpx;
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.card-left {
	margin-right: 20rpx;
}

.status-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background: #00b894;
}

.status-dot.expired {
	background: #ff4d4f;
}

.card-main {
	flex: 1;
}

.domain-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 8rpx;
	display: block;
}

.domain-meta {
	display: flex;
	align-items: center;
}

.meta-item {
	font-size: 24rpx;
	color: #8e8e93;
}

.meta-dot {
	margin: 0 12rpx;
	color: #d0d0d0;
}

.card-right {
	display: flex;
	align-items: center;
}

.expire-text {
	font-size: 26rpx;
	color: #00b894;
	font-weight: 500;
	margin-right: 12rpx;
}

.expire-text.expired {
	color: #ff4d4f;
}

.arrow {
	font-size: 36rpx;
	color: #c7c7cc;
}

/* 空状态 */
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

/* FAB按钮 */
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
