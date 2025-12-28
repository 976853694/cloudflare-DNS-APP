<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">交易记录</text>
			<text class="header-count">共 {{ total }} 条</text>
		</view>
		
		<!-- 记录列表 -->
		<scroll-view class="record-list" scroll-y refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onRefresh" @scrolltolower="loadMore">
			<view class="record-card" v-for="item in records" :key="item.id">
				<view class="card-left">
					<view class="record-icon" :class="item.type === 'renew' ? 'renew' : 'buy'">
						{{ item.type === 'renew' ? '续' : '购' }}
					</view>
				</view>
				<view class="card-main">
					<text class="record-domain">{{ item.subdomain_name }}</text>
					<view class="record-tags">
						<text class="tag plan">{{ item.plan_name }}</text>
						<text class="tag type" :class="item.type">{{ item.type === 'renew' ? '续费' : '购买' }}</text>
					</view>
				</view>
				<view class="card-right">
					<text class="record-price">{{ item.price_text }}</text>
					<text class="record-time">{{ formatDate(item.created_at) }}</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="records.length === 0 && !loading">
				<text class="empty-icon">📋</text>
				<text class="empty-text">暂无交易记录</text>
			</view>
		
		<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore && !loading">
				<text class="load-more-text">上拉加载更多</text>
			</view>
			
			<view class="load-more" v-if="loading">
				<text class="load-more-text">加载中...</text>
			</view>
			
			<view class="no-more" v-if="!hasMore && records.length > 0">
				<text class="no-more-text">— 已加载全部 —</text>
			</view>
			
			<view class="bottom-space"></view>
		</scroll-view>
	</view>
</template>

<script>
import { getPurchaseRecords } from '@/api/record'

export default {
	data() {
		return {
			records: [],
			page: 1,
			perPage: 20,
			total: 0,
			loading: false,
			refreshing: false,
			hasMore: true
		}
	},
	onLoad() {
		this.loadData()
	},
	methods: {
		async onRefresh() {
			this.refreshing = true
			this.page = 1
			this.records = []
			this.hasMore = true
			await this.loadData()
			this.refreshing = false
		},
		async loadData() {
			this.loading = true
			try {
				const res = await getPurchaseRecords(this.page, this.perPage)
				const newRecords = res.data?.records || []
				this.records = [...this.records, ...newRecords]
				
				const pagination = res.data?.pagination || {}
				this.total = pagination.total || 0
				this.hasMore = this.page < (pagination.pages || 1)
			} catch (e) {
				console.error('加载记录失败', e)
			} finally {
				this.loading = false
			}
		},
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++
				this.loadData()
			}
		},
		formatDate(dateStr) {
			if (!dateStr) return ''
			const date = new Date(dateStr)
			const y = date.getFullYear()
			const m = String(date.getMonth() + 1).padStart(2, '0')
			const d = String(date.getDate()).padStart(2, '0')
			return `${y}-${m}-${d}`
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

.record-list {
	padding: 0 30rpx;
	margin-top: -40rpx;
	position: relative;
	z-index: 2;
	height: calc(100vh - 180rpx);
}

.bottom-space {
	height: 40rpx;
}

.record-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.card-left { margin-right: 20rpx; }

.record-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 600;
	color: #fff;
}

.record-icon.buy {
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
}

.record-icon.renew {
	background: linear-gradient(135deg, #00b894 0%, #55efc4 100%);
}

.card-main { flex: 1; }

.record-domain {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
	display: block;
	margin-bottom: 10rpx;
}

.record-tags {
	display: flex;
	gap: 12rpx;
}

.tag {
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}

.tag.plan {
	color: #8e8e93;
	background: #f0f2f5;
}

.tag.type {
	color: #4C84FF;
	background: rgba(76,132,255,0.1);
}

.tag.type.renew {
	color: #00b894;
	background: rgba(0,184,148,0.1);
}

.card-right { text-align: right; }

.record-price {
	font-size: 30rpx;
	color: #ff6b00;
	font-weight: 700;
	display: block;
	margin-bottom: 6rpx;
}

.record-time {
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
	text-align: center;
	padding: 30rpx;
}

.load-more-text {
	font-size: 26rpx;
	color: #4C84FF;
}

.no-more {
	text-align: center;
	padding: 30rpx;
}

.no-more-text {
	font-size: 24rpx;
	color: #c7c7cc;
}
</style>
