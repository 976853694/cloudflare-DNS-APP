<template>
	<view class="page">
		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="nav-brand">
					<text class="nav-logo">六趣DNS</text>
				</view>
				<view class="nav-actions" v-if="!isLoggedIn">
					<text class="nav-btn" @click="goToLogin">登录</text>
				</view>
			</view>
		</view>
		
		<view class="page-content" :style="{ paddingTop: navBarHeight + 'px' }">
			<!-- Hero Banner -->
			<view class="hero-section">
				<view class="hero-bg-circle"></view>
				<view class="hero-bg-circle2"></view>
				<view class="hero-content">
					<view class="hero-badge">🚀 专业DNS服务商</view>
					<text class="hero-title">一站式域名解析</text>
					<text class="hero-title">与主机托管服务</text>
					<text class="hero-subtitle">基于 Cloudflare 全球网络，为您提供稳定、快速、安全的域名解析和虚拟主机服务</text>
					<view class="hero-btns">
						<view class="hero-btn primary" @click="goToPurchase">
							<text>立即注册域名</text>
						</view>
						<view class="hero-btn secondary" @click="goToVHostPurchase">
							<text>购买虚拟主机</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 公告栏 -->
			<view class="notice-bar" v-if="announcements.length > 0" @click="goToAnnouncements">
				<view class="notice-icon">📢</view>
				<swiper class="notice-swiper" vertical autoplay circular :interval="3000">
					<swiper-item v-for="item in announcements" :key="item.id">
						<text class="notice-text">{{ item.title }}</text>
					</swiper-item>
				</swiper>
				<text class="notice-arrow">›</text>
			</view>
			
			<!-- 数据统计 -->
			<view class="stats-section">
				<view class="stats-card">
					<view class="stat-item">
						<text class="stat-num">{{ domains.length || 0 }}</text>
						<text class="stat-label">可选后缀</text>
					</view>
					<view class="stat-divider"></view>
					<view class="stat-item">
						<text class="stat-num">{{ totalRegistered }}</text>
						<text class="stat-label">已注册域名</text>
					</view>
					<view class="stat-divider"></view>
					<view class="stat-item">
						<text class="stat-num">99.9%</text>
						<text class="stat-label">服务可用率</text>
					</view>
				</view>
			</view>
			
			<!-- 产品服务 -->
			<view class="products-section">
				<view class="section-header">
					<text class="section-title">产品服务</text>
					<text class="section-subtitle">为您提供全方位的互联网基础服务</text>
				</view>
				<view class="product-grid">
					<view class="product-card" @click="goToPurchase">
						<view class="product-icon blue">🌐</view>
						<text class="product-name">二级域名</text>
						<text class="product-desc">免费/付费二级域名注册，支持多种后缀</text>
						<view class="product-price">
							<text class="price-from">低至</text>
							<text class="price-num">¥0</text>
							<text class="price-unit">/年</text>
						</view>
						<view class="product-btn">立即注册</view>
					</view>
					<view class="product-card" @click="goToVHostPurchase">
						<view class="product-icon purple">🖥️</view>
						<text class="product-name">虚拟主机</text>
						<text class="product-desc">高性能PHP主机，支持SSL、伪静态</text>
						<view class="product-price">
							<text class="price-from">低至</text>
							<text class="price-num">¥{{ minVHostPrice || 0 }}</text>
							<text class="price-unit">/月</text>
						</view>
						<view class="product-btn">立即购买</view>
					</view>
				</view>
			</view>
			
			<!-- 热门域名后缀 -->
			<view class="domain-section">
				<view class="section-header">
					<text class="section-title">热门域名后缀</text>
					<text class="section-more" @click="goToPurchase">查看全部 ›</text>
				</view>
				<scroll-view class="domain-scroll" scroll-x>
					<view class="domain-list">
						<view class="domain-item" v-for="domain in domains.slice(0, 6)" :key="domain.id" @click="selectDomain(domain)">
							<text class="domain-suffix">.{{ domain.name.split('.').pop() }}</text>
							<text class="domain-full">{{ domain.name }}</text>
							<view class="domain-info">
								<text class="domain-count">{{ domain.subdomains_count || 0 }} 已注册</text>
								<view class="domain-status" :class="{ open: domain.allow_register }">
									{{ domain.allow_register ? '开放注册' : '暂停注册' }}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="empty-state" v-if="domains.length === 0 && !loading">
					<text class="empty-icon">📭</text>
					<text class="empty-text">暂无可用域名</text>
				</view>
			</view>
			
			<!-- 我的资产 -->
			<view class="assets-section" v-if="isLoggedIn">
				<view class="section-header">
					<text class="section-title">我的资产</text>
				</view>
				<view class="assets-grid">
					<view class="asset-card" @click="goToMyDomains">
						<view class="asset-icon">🌐</view>
						<view class="asset-info">
							<text class="asset-num">{{ myDomains.length }}</text>
							<text class="asset-label">我的域名</text>
						</view>
						<text class="asset-arrow">›</text>
					</view>
					<view class="asset-card" @click="goToVHostList">
						<view class="asset-icon">🖥️</view>
						<view class="asset-info">
							<text class="asset-num">{{ myVHosts.length }}</text>
							<text class="asset-label">虚拟主机</text>
						</view>
						<text class="asset-arrow">›</text>
					</view>
				</view>
				
				<!-- 即将到期提醒 -->
				<view class="expire-remind" v-if="expiringItems.length > 0">
					<view class="remind-header">
						<text class="remind-icon">⚠️</text>
						<text class="remind-title">即将到期提醒</text>
					</view>
					<view class="remind-list">
						<view class="remind-item" v-for="item in expiringItems.slice(0, 3)" :key="item.id" @click="goToDetail(item)">
							<text class="remind-name">{{ item.name }}</text>
							<text class="remind-days">{{ item.days }}天后到期</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 快捷入口 -->
			<view class="quick-section">
				<view class="section-header">
					<text class="section-title">快捷服务</text>
				</view>
				<view class="quick-grid">
					<view class="quick-item" @click="goToRecharge">
						<view class="quick-icon orange">💳</view>
						<text class="quick-name">充值</text>
					</view>
					<view class="quick-item" @click="goToRecords">
						<view class="quick-icon green">📋</view>
						<text class="quick-name">订单</text>
					</view>
					<view class="quick-item" @click="goToAnnouncements">
						<view class="quick-icon red">📢</view>
						<text class="quick-name">公告</text>
					</view>
					<view class="quick-item" @click="goToMine">
						<view class="quick-icon blue">👤</view>
						<text class="quick-name">我的</text>
					</view>
				</view>
			</view>
			
			<!-- 特性介绍 -->
			<view class="feature-section">
				<view class="section-header">
					<text class="section-title">为什么选择我们</text>
				</view>
				<view class="feature-grid">
					<view class="feature-card blue-gradient">
						<view class="feature-icon-wrap blue">
							<text class="feature-icon">⚡</text>
						</view>
						<view class="feature-content">
							<text class="feature-title">极速解析</text>
							<text class="feature-desc">全球CDN加速，毫秒级响应</text>
						</view>
					</view>
					<view class="feature-card green-gradient">
						<view class="feature-icon-wrap green">
							<text class="feature-icon">🛡️</text>
						</view>
						<view class="feature-content">
							<text class="feature-title">安全可靠</text>
							<text class="feature-desc">DDoS防护，SSL加密</text>
						</view>
					</view>
					<view class="feature-card orange-gradient">
						<view class="feature-icon-wrap orange">
							<text class="feature-icon">💡</text>
						</view>
						<view class="feature-content">
							<text class="feature-title">简单易用</text>
							<text class="feature-desc">可视化管理，一键配置</text>
						</view>
					</view>
					<view class="feature-card purple-gradient">
						<view class="feature-icon-wrap purple">
							<text class="feature-icon">💬</text>
						</view>
						<view class="feature-content">
							<text class="feature-title">专业支持</text>
							<text class="feature-desc">7×24小时技术支持</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 底部信息 -->
			<view class="footer">
				<view class="footer-links">
					<text class="footer-link" @click="goToAnnouncements">公告</text>
					<text class="footer-divider">|</text>
					<text class="footer-link">帮助</text>
					<text class="footer-divider">|</text>
					<text class="footer-link">关于</text>
				</view>
				<text class="footer-brand">六趣DNS · 专业域名解析服务</text>
				<text class="footer-copyright">© 2024 LiuQu DNS. All Rights Reserved</text>
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
import { getVHostPlans, getVHostInstances } from '@/api/vhost'
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
			myVHosts: [],
			minVHostPrice: 0,
			isLoggedIn: false,
			loading: true
		}
	},
	computed: {
		totalRegistered() {
			return this.domains.reduce((sum, d) => sum + (d.subdomains_count || 0), 0)
		},
		expiringItems() {
			const items = []
			// 域名即将到期
			this.myDomains.forEach(d => {
				if (d.days_remaining <= 7 && d.days_remaining > 0) {
					items.push({ id: 'd_' + d.id, name: d.full_name, days: d.days_remaining, type: 'domain', data: d })
				}
			})
			// 主机即将到期
			this.myVHosts.forEach(v => {
				if (v.days_remaining <= 7 && v.days_remaining > 0) {
					items.push({ id: 'v_' + v.id, name: v.domain, days: v.days_remaining, type: 'vhost', data: v })
				}
			})
			return items.sort((a, b) => a.days - b.days)
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
				
				// 加载虚拟主机套餐获取最低价
				try {
					const plansRes = await getVHostPlans()
					const plans = plansRes.data?.plans || []
					if (plans.length > 0) {
						this.minVHostPrice = Math.min(...plans.map(p => p.price || 0))
					}
				} catch (e) {}
				
				// 如果已登录，加载我的资产
				if (this.isLoggedIn) {
					try {
						const myDomainsRes = await getSubdomains()
						this.myDomains = myDomainsRes.data?.subdomains || []
					} catch (e) {}
					
					try {
						const myVHostsRes = await getVHostInstances()
						this.myVHosts = myVHostsRes.data?.instances || []
					} catch (e) {}
				}
			} catch (e) {
				console.error('加载数据失败', e)
			} finally {
				this.loading = false
			}
		},
		goToLogin() {
			uni.navigateTo({ url: '/pages/login/login' })
		},
		goToAnnouncements() {
			uni.navigateTo({ url: '/pages/announcement/list' })
		},
		goToPurchase() {
			uni.navigateTo({ url: '/pages/domain/purchase' })
		},
		goToVHostPurchase() {
			uni.navigateTo({ url: '/pages/vhost/purchase' })
		},
		goToMyDomains() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/domain/list' })
		},
		goToVHostList() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/vhost/list' })
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
		goToMine() {
			uni.switchTab({ url: '/pages/mine/mine' })
		},
		selectDomain(domain) {
			uni.navigateTo({ url: `/pages/domain/purchase?domainId=${domain.id}` })
		},
		goToDetail(item) {
			if (item.type === 'domain') {
				uni.navigateTo({ url: `/pages/domain/detail?id=${item.data.id}` })
			} else {
				uni.navigateTo({ url: `/pages/vhost/detail?id=${item.data.id}` })
			}
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #f0f2f5;
}

/* 导航栏 */
.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.nav-content {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
}

.nav-logo {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.nav-btn {
	font-size: 26rpx;
	color: #fff;
	padding: 12rpx 28rpx;
	background: rgba(255,255,255,0.15);
	border-radius: 30rpx;
}

/* Hero 区域 */
.hero-section {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 60rpx 30rpx 80rpx;
	position: relative;
	overflow: hidden;
}

.hero-bg-circle {
	position: absolute;
	width: 400rpx;
	height: 400rpx;
	border-radius: 50%;
	background: rgba(76, 132, 255, 0.1);
	top: -100rpx;
	right: -100rpx;
}

.hero-bg-circle2 {
	position: absolute;
	width: 300rpx;
	height: 300rpx;
	border-radius: 50%;
	background: rgba(76, 132, 255, 0.08);
	bottom: -50rpx;
	left: -80rpx;
}

.hero-content {
	position: relative;
	z-index: 2;
}

.hero-badge {
	display: inline-block;
	font-size: 22rpx;
	color: #4C84FF;
	background: rgba(76, 132, 255, 0.15);
	padding: 10rpx 24rpx;
	border-radius: 30rpx;
	margin-bottom: 24rpx;
}

.hero-title {
	display: block;
	font-size: 44rpx;
	font-weight: 700;
	color: #fff;
	line-height: 1.3;
}

.hero-subtitle {
	display: block;
	font-size: 26rpx;
	color: rgba(255,255,255,0.7);
	margin-top: 20rpx;
	line-height: 1.6;
}

.hero-btns {
	display: flex;
	gap: 20rpx;
	margin-top: 40rpx;
}

.hero-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 500;
}

.hero-btn.primary {
	background: #4C84FF;
	color: #fff;
}

.hero-btn.secondary {
	background: rgba(255,255,255,0.15);
	color: #fff;
	border: 2rpx solid rgba(255,255,255,0.3);
}

/* 公告栏 */
.notice-bar {
	display: flex;
	align-items: center;
	background: #fff;
	margin: -30rpx 30rpx 20rpx;
	padding: 20rpx 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
	position: relative;
	z-index: 3;
}

.notice-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
}

.notice-swiper {
	flex: 1;
	height: 40rpx;
}

.notice-text {
	font-size: 26rpx;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.notice-arrow {
	font-size: 32rpx;
	color: #8e8e93;
}

/* 统计区域 */
.stats-section {
	padding: 0 30rpx 20rpx;
}

.stats-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.stat-item {
	flex: 1;
	text-align: center;
}

.stat-num {
	display: block;
	font-size: 40rpx;
	font-weight: 700;
	color: #1a1a2e;
}

.stat-label {
	display: block;
	font-size: 22rpx;
	color: #8e8e93;
	margin-top: 8rpx;
}

.stat-divider {
	width: 1rpx;
	height: 60rpx;
	background: #eee;
}

/* 产品区域 */
.products-section {
	padding: 30rpx;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #1a1a2e;
}

.section-subtitle {
	display: block;
	font-size: 24rpx;
	color: #8e8e93;
	margin-top: 8rpx;
}

.section-more {
	font-size: 24rpx;
	color: #4C84FF;
}

.product-grid {
	display: flex;
	gap: 20rpx;
}

.product-card {
	flex: 1;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.product-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
	margin-bottom: 20rpx;
}

.product-icon.blue {
	background: rgba(76, 132, 255, 0.1);
}

.product-icon.purple {
	background: rgba(156, 39, 176, 0.1);
}

.product-name {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 8rpx;
}

.product-desc {
	display: block;
	font-size: 22rpx;
	color: #8e8e93;
	line-height: 1.5;
	height: 66rpx;
}

.product-price {
	margin: 16rpx 0;
}

.price-from {
	font-size: 22rpx;
	color: #8e8e93;
}

.price-num {
	font-size: 36rpx;
	font-weight: 700;
	color: #ff6b00;
	margin: 0 4rpx;
}

.price-unit {
	font-size: 22rpx;
	color: #8e8e93;
}

.product-btn {
	height: 64rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #fff;
}

/* 域名后缀区域 */
.domain-section {
	padding: 0 30rpx 30rpx;
}

.domain-scroll {
	white-space: nowrap;
}

.domain-list {
	display: inline-flex;
	gap: 16rpx;
	padding: 10rpx 0;
}

.domain-item {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	background: #fff;
	padding: 24rpx 32rpx;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	min-width: 160rpx;
}

.domain-suffix {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.domain-full {
	font-size: 22rpx;
	color: #8e8e93;
	margin-top: 4rpx;
}

.domain-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 12rpx;
}

.domain-count {
	font-size: 20rpx;
	color: #8e8e93;
}

.domain-status {
	font-size: 18rpx;
	color: #ff4d4f;
	background: rgba(255, 77, 79, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 10rpx;
	margin-top: 8rpx;
}

.domain-status.open {
	color: #00b894;
	background: rgba(0, 184, 148, 0.1);
}

.domain-price {
	font-size: 22rpx;
	color: #ff6b00;
	margin-top: 8rpx;
}

.domain-price.free {
	color: #00b894;
}

/* 我的资产 */
.assets-section {
	padding: 0 30rpx 30rpx;
}

.assets-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.assets-grid {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.asset-card {
	flex: 1;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.asset-icon {
	font-size: 40rpx;
	width: 72rpx;
	height: 72rpx;
	background: #f8f9fa;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.asset-info {
	flex: 1;
}

.asset-num {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #1a1a2e;
}

.asset-label {
	font-size: 22rpx;
	color: #8e8e93;
}

.asset-arrow {
	font-size: 32rpx;
	color: #c0c0c0;
}

.asset-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.asset-count {
	font-size: 36rpx;
	font-weight: 700;
	color: #1a1a2e;
}

.expire-remind {
	background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
	border: 2rpx solid rgba(255, 77, 79, 0.2);
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
}

.remind-header {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 12rpx;
}

.remind-icon {
	font-size: 28rpx;
}

.remind-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #ff4d4f;
}

.remind-list {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.remind-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 16rpx;
	background: #fff;
	border-radius: 8rpx;
}

.remind-name {
	font-size: 24rpx;
	color: #1a1a2e;
}

.remind-days {
	font-size: 22rpx;
	color: #ff4d4f;
}

.expire-header {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 12rpx;
}

.expire-icon {
	font-size: 28rpx;
}

.expire-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #ff4d4f;
}

.expire-list {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.expire-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 16rpx;
	background: #fff;
	border-radius: 8rpx;
}

.expire-name {
	font-size: 24rpx;
	color: #1a1a2e;
}

.expire-days {
	font-size: 22rpx;
	color: #ff4d4f;
}

/* 快捷服务 */
.quick-section {
	padding: 0 30rpx 30rpx;
}

.quick-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.quick-item {
	width: calc(25% - 15rpx);
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}

.quick-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-bottom: 12rpx;
}

.quick-icon.orange {
	background: rgba(255, 107, 0, 0.1);
}

.quick-icon.green {
	background: rgba(0, 184, 148, 0.1);
}

.quick-icon.red {
	background: rgba(255, 77, 79, 0.1);
}

.quick-icon.blue {
	background: rgba(76, 132, 255, 0.1);
}

.quick-name {
	font-size: 24rpx;
	color: #1a1a2e;
}

.quick-label {
	font-size: 24rpx;
	color: #1a1a2e;
}

/* 特性区域 */
.feature-section {
	padding: 0 30rpx 30rpx;
}

.feature-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.feature-card {
	width: calc(50% - 8rpx);
	box-sizing: border-box;
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.feature-card.blue-gradient {
	background: linear-gradient(135deg, #e8f4fd 0%, #f0f7ff 100%);
}

.feature-card.green-gradient {
	background: linear-gradient(135deg, #e6f7f3 0%, #f0faf7 100%);
}

.feature-card.orange-gradient {
	background: linear-gradient(135deg, #fff4e6 0%, #fffaf0 100%);
}

.feature-card.purple-gradient {
	background: linear-gradient(135deg, #f3e8ff 0%, #f9f0ff 100%);
}

.feature-icon-wrap {
	width: 64rpx;
	height: 64rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.feature-icon-wrap.blue {
	background: linear-gradient(135deg, #4C84FF 0%, #6B9AFF 100%);
}

.feature-icon-wrap.green {
	background: linear-gradient(135deg, #00b894 0%, #2ed573 100%);
}

.feature-icon-wrap.orange {
	background: linear-gradient(135deg, #ff6b00 0%, #ff9f43 100%);
}

.feature-icon-wrap.purple {
	background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
}

.feature-icon {
	font-size: 32rpx;
}

.feature-content {
	flex: 1;
}

.feature-title {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
	margin-bottom: 8rpx;
}

.feature-desc {
	font-size: 22rpx;
	color: #666;
	line-height: 1.5;
}

/* 页脚 */
.footer {
	padding: 40rpx 30rpx 60rpx;
	text-align: center;
	background: #fff;
	margin: 0 30rpx 30rpx;
	border-radius: 16rpx;
}

.footer-links {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 16rpx;
}

.footer-link {
	font-size: 24rpx;
	color: #4C84FF;
}

.footer-divider {
	font-size: 24rpx;
	color: #e0e0e0;
}

.footer-brand {
	display: block;
	font-size: 24rpx;
	color: #1a1a2e;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.footer-copyright {
	display: block;
	font-size: 22rpx;
	color: #c0c0c0;
}

.bottom-space {
	height: 120rpx;
}

/* 空状态 */
.empty-state {
	padding: 60rpx;
	text-align: center;
}

.empty-icon {
	font-size: 60rpx;
	display: block;
	margin-bottom: 16rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #8e8e93;
}

/* 登录提示 */
.login-tip {
	background: #fff;
	border-radius: 16rpx;
	padding: 40rpx;
	text-align: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}

.login-tip-text {
	font-size: 28rpx;
	color: #8e8e93;
	display: block;
	margin-bottom: 20rpx;
}

.login-tip-btn {
	display: inline-block;
	padding: 16rpx 48rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 40rpx;
	font-size: 28rpx;
	color: #fff;
}
</style>
