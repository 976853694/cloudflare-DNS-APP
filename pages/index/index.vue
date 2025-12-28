<template>
	<view class="page">
		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="nav-brand">
					<text class="nav-logo">六趣DNS</text>
				</view>
			</view>
		</view>
		
		<view class="page-content" :style="{ paddingTop: navBarHeight + 'px' }">
			<!-- Hero Banner -->
			<view class="hero-section">
				<view class="hero-bg"></view>
				<view class="hero-content">
					<text class="hero-title">专业DNS解析服务</text>
					<text class="hero-subtitle">稳定 · 快速 · 安全</text>
					<view class="hero-stats">
						<view class="stat-item">
							<text class="stat-num">{{ domains.length }}</text>
							<text class="stat-label">可用域名</text>
						</view>
						<view class="stat-divider"></view>
						<view class="stat-item">
							<text class="stat-num">{{ myDomains.length }}</text>
							<text class="stat-label">我的域名</text>
						</view>
						<view class="stat-divider"></view>
						<view class="stat-item">
							<text class="stat-num">24/7</text>
							<text class="stat-label">全天服务</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 公告栏 -->
			<view class="notice-bar" v-if="announcements.length > 0" @click="goToAnnouncements">
				<view class="notice-tag">通知</view>
				<swiper class="notice-swiper" vertical autoplay circular :interval="3000">
					<swiper-item v-for="item in announcements" :key="item.id">
						<text class="notice-text">{{ item.title }}</text>
					</swiper-item>
				</swiper>
				<text class="notice-arrow">›</text>
			</view>
			
			<!-- 服务入口 -->
			<view class="service-section">
				<view class="section-header">
					<text class="section-title">快捷服务</text>
				</view>
				<view class="service-grid">
					<view class="service-card" @click="goToPurchase">
						<view class="service-icon-wrap blue">
							<text class="service-icon">🌐</text>
						</view>
						<view class="service-info">
							<text class="service-name">注册域名</text>
							<text class="service-desc">快速注册二级域名</text>
						</view>
						<text class="service-arrow">›</text>
					</view>
					<view class="service-card" @click="goToMyDomains">
						<view class="service-icon-wrap green">
							<text class="service-icon">📊</text>
						</view>
						<view class="service-info">
							<text class="service-name">域名管理</text>
							<text class="service-desc">管理DNS解析记录</text>
						</view>
						<text class="service-arrow">›</text>
					</view>
					<view class="service-card" @click="goToRecharge">
						<view class="service-icon-wrap orange">
							<text class="service-icon">💳</text>
						</view>
						<view class="service-info">
							<text class="service-name">账户充值</text>
							<text class="service-desc">使用卡密充值余额</text>
						</view>
						<text class="service-arrow">›</text>
					</view>
					<view class="service-card" @click="goToRecords">
						<view class="service-icon-wrap purple">
							<text class="service-icon">📋</text>
						</view>
						<view class="service-info">
							<text class="service-name">交易记录</text>
							<text class="service-desc">查看购买与续费记录</text>
						</view>
						<text class="service-arrow">›</text>
					</view>
				</view>
			</view>
			
			<!-- 可用域名 -->
			<view class="domain-section">
				<view class="section-header">
					<text class="section-title">可选域名后缀</text>
					<text class="section-more" @click="goToPurchase">全部 ›</text>
				</view>
				<view class="domain-cards">
					<view class="domain-card" v-for="domain in domains" :key="domain.id" @click="selectDomain(domain)">
						<view class="domain-card-header">
							<text class="domain-suffix">.{{ domain.name.split('.').pop() }}</text>
							<view class="domain-badge" v-if="domain.allow_register">可注册</view>
						</view>
						<text class="domain-full">{{ domain.name }}</text>
						<view class="domain-card-footer">
							<text class="domain-registered">{{ domain.subdomains_count }} 已注册</text>
							<view class="domain-register-btn">立即注册</view>
						</view>
					</view>
				</view>
				<view class="empty-state" v-if="domains.length === 0 && !loading">
					<text class="empty-icon">📭</text>
					<text class="empty-text">暂无可用域名</text>
				</view>
			</view>
			
			<!-- 我的域名 -->
			<view class="my-domain-section" v-if="isLoggedIn && myDomains.length > 0">
				<view class="section-header">
					<text class="section-title">我的域名</text>
					<text class="section-more" @click="goToMyDomains">管理 ›</text>
				</view>
				<view class="my-domain-cards">
					<view class="my-domain-card" v-for="item in myDomains.slice(0, 3)" :key="item.id" @click="goToDomainDetail(item)">
						<view class="my-domain-left">
							<view class="my-domain-status" :class="{ expired: item.is_expired, active: !item.is_expired }"></view>
							<view class="my-domain-content">
								<text class="my-domain-name">{{ item.full_name }}</text>
								<text class="my-domain-meta">{{ item.records_count }} 条解析记录</text>
							</view>
						</view>
						<view class="my-domain-right">
							<text class="my-domain-expire" :class="{ expired: item.is_expired }">
								{{ item.is_expired ? '已过期' : `${item.days_remaining}天` }}
							</text>
							<text class="my-domain-arrow">›</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 特性介绍 -->
			<view class="feature-section">
				<view class="section-header">
					<text class="section-title">为什么选择我们</text>
				</view>
				<view class="feature-list">
					<view class="feature-item">
						<view class="feature-icon">⚡</view>
						<view class="feature-content">
							<text class="feature-title">极速解析</text>
							<text class="feature-desc">基于Cloudflare全球CDN，毫秒级响应</text>
						</view>
					</view>
					<view class="feature-item">
						<view class="feature-icon">🛡️</view>
						<view class="feature-content">
							<text class="feature-title">安全可靠</text>
							<text class="feature-desc">DDoS防护，SSL加密，数据安全有保障</text>
						</view>
					</view>
					<view class="feature-item">
						<view class="feature-icon">💡</view>
						<view class="feature-content">
							<text class="feature-title">简单易用</text>
							<text class="feature-desc">可视化管理界面，一键配置DNS记录</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 底部信息 -->
			<view class="footer">
				<text class="footer-text">六趣DNS · 专业域名解析服务</text>
				<text class="footer-copyright">© 2024 All Rights Reserved</text>
			</view>
			
			<view class="bottom-space"></view>
		</view>
		
		<!-- 自定义TabBar -->
		<custom-tabbar current="/pages/index/index"></custom-tabbar>
	</view>
</template>

<script>
import { getAnnouncements } from '@/api/announcement'
import { getDomains, getSubdomains } from '@/api/domain'
import { isLoggedIn } from '@/utils/storage'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
	components: {
		CustomTabbar
	},
	data() {
		return {
			statusBarHeight: 20,
			navBarHeight: 88,
			announcements: [],
			domains: [],
			myDomains: [],
			isLoggedIn: false,
			loading: true,
			}
	},
	onLoad() {
		const sysInfo = uni.getSystemInfoSync()
		this.statusBarHeight = sysInfo.statusBarHeight
		this.navBarHeight = sysInfo.statusBarHeight + 44
	},
	onShow() {
		this.isLoggedIn = isLoggedIn()
		this.loadData()
	},
	onPullDownRefresh() {
		this.loadData().then(() => uni.stopPullDownRefresh())
	},
	methods: {
		async loadData() {
			this.loading = true
			try {
				// 加载公告
				const announcementRes = await getAnnouncements()
				this.announcements = announcementRes.data?.announcements || []
				
				// 加载可用域名
				const domainsRes = await getDomains()
				this.domains = domainsRes.data?.domains || []
				
				// 如果已登录，加载我的域名
				if (this.isLoggedIn) {
					const myDomainsRes = await getSubdomains()
					this.myDomains = myDomainsRes.data?.subdomains || []
				}
			} catch (e) {
				console.error('加载数据失败', e)
			} finally {
				this.loading = false
			}
		},
		goToAnnouncements() {
			uni.navigateTo({ url: '/pages/announcement/list' })
		},
		goToPurchase() {
			uni.navigateTo({ url: '/pages/domain/purchase' })
		},
		goToMyDomains() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/domain/list' })
		},
		goToRecharge() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/recharge/recharge' })
		},
		goToRecords() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/record/record' })
		},
		selectDomain(domain) {
			uni.navigateTo({ url: `/pages/domain/purchase?domainId=${domain.id}` })
		},
		goToDomainDetail(item) {
			uni.navigateTo({ url: `/pages/domain/detail?id=${item.id}` })
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #f0f2f5;
}

.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	z-index: 100;
}

.nav-content {
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-brand {
	display: flex;
	align-items: center;
}

.nav-logo {
	font-size: 36rpx;
	font-weight: 700;
	color: #ffffff;
	letter-spacing: 2rpx;
}

.page-content {
	min-height: 100vh;
	box-sizing: border-box;
	padding-bottom: 120rpx;
}

/* Hero Section */
.hero-section {
	position: relative;
	padding: 60rpx 40rpx 80rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	overflow: hidden;
}

.hero-bg {
	position: absolute;
	top: -50%;
	right: -20%;
	width: 400rpx;
	height: 400rpx;
	background: radial-gradient(circle, rgba(76, 132, 255, 0.3) 0%, transparent 70%);
	border-radius: 50%;
}

.hero-content {
	position: relative;
	z-index: 1;
}

.hero-title {
	display: block;
	font-size: 48rpx;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 16rpx;
}

.hero-subtitle {
	display: block;
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.7);
	margin-bottom: 48rpx;
	letter-spacing: 4rpx;
}

.hero-stats {
	display: flex;
	align-items: center;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border-radius: 20rpx;
	padding: 32rpx 24rpx;
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-num {
	font-size: 40rpx;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.7);
}

.stat-divider {
	width: 1rpx;
	height: 60rpx;
	background: rgba(255, 255, 255, 0.2);
}

/* Notice Bar */
.notice-bar {
	display: flex;
	align-items: center;
	margin: -40rpx 30rpx 20rpx;
	padding: 24rpx 28rpx;
	background: #ffffff;
	border-radius: 16rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	position: relative;
	z-index: 2;
}

.notice-tag {
	font-size: 22rpx;
	color: #fff;
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
	margin-right: 20rpx;
	font-weight: 500;
}

.notice-swiper {
	flex: 1;
	height: 40rpx;
}

.notice-text {
	font-size: 26rpx;
	color: #333;
	line-height: 40rpx;
}

.notice-arrow {
	font-size: 32rpx;
	color: #ccc;
	margin-left: 12rpx;
}

/* Service Section */
.service-section {
	padding: 0 30rpx 20rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 0;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.section-more {
	font-size: 26rpx;
	color: #4C84FF;
}

.service-grid {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.service-card {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	background: #ffffff;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.service-icon-wrap {
	width: 88rpx;
	height: 88rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
}

.service-icon-wrap.blue { background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%); }
.service-icon-wrap.green { background: linear-gradient(135deg, #00b894 0%, #55efc4 100%); }
.service-icon-wrap.orange { background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); }
.service-icon-wrap.purple { background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%); }

.service-icon {
	font-size: 40rpx;
}

.service-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.service-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 6rpx;
}

.service-desc {
	font-size: 24rpx;
	color: #8e8e93;
}

.service-arrow {
	font-size: 36rpx;
	color: #c7c7cc;
}

/* Domain Section */
.domain-section {
	padding: 0 30rpx 20rpx;
}

.domain-cards {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.domain-card {
	width: calc(50% - 10rpx);
	background: #ffffff;
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
	box-sizing: border-box;
}

.domain-card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.domain-suffix {
	font-size: 36rpx;
	font-weight: 700;
	color: #4C84FF;
}

.domain-badge {
	font-size: 20rpx;
	color: #00b894;
	background: rgba(0, 184, 148, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}

.domain-full {
	display: block;
	font-size: 24rpx;
	color: #8e8e93;
	margin-bottom: 20rpx;
}

.domain-card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.domain-registered {
	font-size: 22rpx;
	color: #8e8e93;
}

.domain-register-btn {
	font-size: 24rpx;
	color: #fff;
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	padding: 10rpx 24rpx;
	border-radius: 20rpx;
}

.empty-state {
	text-align: center;
	padding: 80rpx 0;
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

/* My Domain Section */
.my-domain-section {
	padding: 0 30rpx 20rpx;
}

.my-domain-cards {
	background: #ffffff;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.my-domain-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.my-domain-card:last-child {
	border-bottom: none;
}

.my-domain-left {
	display: flex;
	align-items: center;
}

.my-domain-status {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.my-domain-status.active { background: #00b894; }
.my-domain-status.expired { background: #ff4d4f; }

.my-domain-content {
	display: flex;
	flex-direction: column;
}

.my-domain-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #1a1a2e;
	margin-bottom: 6rpx;
}

.my-domain-meta {
	font-size: 24rpx;
	color: #8e8e93;
}

.my-domain-right {
	display: flex;
	align-items: center;
}

.my-domain-expire {
	font-size: 26rpx;
	color: #00b894;
	margin-right: 12rpx;
}

.my-domain-expire.expired {
	color: #ff4d4f;
}

.my-domain-arrow {
	font-size: 32rpx;
	color: #c7c7cc;
}

/* Feature Section */
.feature-section {
	padding: 0 30rpx 20rpx;
}

.feature-list {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 8rpx 0;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.feature-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
}

.feature-icon {
	width: 72rpx;
	height: 72rpx;
	background: #f8f9fa;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-right: 24rpx;
}

.feature-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.feature-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 6rpx;
}

.feature-desc {
	font-size: 24rpx;
	color: #8e8e93;
}

/* Footer */
.footer {
	text-align: center;
	padding: 48rpx 30rpx;
}

.footer-text {
	display: block;
	font-size: 26rpx;
	color: #8e8e93;
	margin-bottom: 12rpx;
}

.footer-copyright {
	font-size: 22rpx;
	color: #c7c7cc;
}

.bottom-space {
	height: 120rpx;
}
</style>
