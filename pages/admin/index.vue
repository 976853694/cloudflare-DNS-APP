<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-content">
				<text class="header-title">{{ isDemo ? '演示中心' : '管理中心' }}</text>
				<text class="header-subtitle">{{ isDemo ? '只读模式，仅供查看' : '系统数据概览与管理' }}</text>
			</view>
			<view class="demo-badge" v-if="isDemo">演示</view>
		</view>
		
		<!-- 演示模式提示 -->
		<view class="demo-notice" v-if="isDemo">
			<text class="notice-icon">👁️</text>
			<text class="notice-text">演示模式：您可以查看所有数据，但无法进行修改操作</text>
		</view>
		
		<!-- 核心数据卡片 -->
		<view class="stats-section">
			<view class="stats-grid">
				<view class="stat-card">
					<view class="stat-icon users">👥</view>
					<view class="stat-info">
						<text class="stat-value">{{ stats.users_count || 0 }}</text>
						<text class="stat-label">用户总数</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon domains">🌐</view>
					<view class="stat-info">
						<text class="stat-value">{{ stats.domains_count || 0 }}</text>
						<text class="stat-label">主域名</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon subdomains">🔗</view>
					<view class="stat-info">
						<text class="stat-value">{{ stats.subdomains_count || 0 }}</text>
						<text class="stat-label">二级域名</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon records">📝</view>
					<view class="stat-info">
						<text class="stat-value">{{ stats.records_count || 0 }}</text>
						<text class="stat-label">DNS记录</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 今日数据 -->
		<view class="today-card">
			<view class="today-header">
				<text class="today-title">📊 今日数据</text>
			</view>
			<view class="today-grid">
				<view class="today-item">
					<text class="today-value green">+{{ stats.today_new_users || 0 }}</text>
					<text class="today-label">新增用户</text>
				</view>
				<view class="today-divider"></view>
				<view class="today-item">
					<text class="today-value blue">+{{ stats.today_new_subdomains || 0 }}</text>
					<text class="today-label">新增域名</text>
				</view>
			</view>
		</view>
		
		<!-- 快捷管理 -->
		<view class="menu-section">
			<text class="section-title">快捷管理</text>
			<view class="menu-card">
				<view class="menu-row">
					<view class="menu-item" @click="goTo('/pages/admin/users')">
						<view class="menu-icon-wrap blue">👥</view>
						<text class="menu-text">用户</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/domains')">
						<view class="menu-icon-wrap green">🌐</view>
						<text class="menu-text">域名</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/cf-accounts')">
						<view class="menu-icon-wrap yellow">☁️</view>
						<text class="menu-text">渠道</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/plans')">
						<view class="menu-icon-wrap purple">📦</view>
						<text class="menu-text">套餐</text>
					</view>
				</view>
				<view class="menu-row">
					<view class="menu-item" @click="goTo('/pages/admin/redeem')">
						<view class="menu-icon-wrap orange">🎫</view>
						<text class="menu-text">卡密</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/coupons')">
						<view class="menu-icon-wrap pink">🎁</view>
						<text class="menu-text">优惠券</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/orders')">
						<view class="menu-icon-wrap cyan">📋</view>
						<text class="menu-text">订单</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/subdomains')">
						<view class="menu-icon-wrap teal">🔗</view>
						<text class="menu-text">子域名</text>
					</view>
				</view>
				<view class="menu-row">
					<view class="menu-item" @click="goTo('/pages/admin/dns-records')">
						<view class="menu-icon-wrap red">📝</view>
						<text class="menu-text">DNS</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/app-versions')">
						<view class="menu-icon-wrap indigo">📱</view>
						<text class="menu-text">APP版本</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/email-templates')">
						<view class="menu-icon-wrap pink">📧</view>
						<text class="menu-text">邮件模板</text>
					</view>
					<view class="menu-item" @click="goTo('/pages/admin/ip-blacklist')">
						<view class="menu-icon-wrap gray">🚫</view>
						<text class="menu-text">IP黑名单</text>
					</view>
				</view>
				<view class="menu-row">
					<view class="menu-item" @click="goTo('/pages/admin/data-manage')">
						<view class="menu-icon-wrap brown">📦</view>
						<text class="menu-text">数据管理</text>
					</view>
					<view class="menu-item"></view>
					<view class="menu-item"></view>
					<view class="menu-item"></view>
				</view>
			</view>
		</view>
		
		<!-- 系统功能 -->
		<view class="menu-section">
			<text class="section-title">系统功能</text>
			<view class="func-list">
				<view class="func-item" @click="goTo('/pages/admin/announcements')">
					<view class="func-left">
						<view class="func-icon pink">📢</view>
						<view class="func-info">
							<text class="func-name">公告管理</text>
							<text class="func-desc">发布和管理系统公告</text>
						</view>
					</view>
					<text class="func-arrow">›</text>
				</view>
				<view class="func-item" @click="goTo('/pages/admin/logs')">
					<view class="func-left">
						<view class="func-icon brown">📜</view>
						<view class="func-info">
							<text class="func-name">操作日志</text>
							<text class="func-desc">查看系统操作记录</text>
						</view>
					</view>
					<text class="func-arrow">›</text>
				</view>
				<view class="func-item" @click="goTo('/pages/admin/settings')">
					<view class="func-left">
						<view class="func-icon gray">⚙️</view>
						<view class="func-info">
							<text class="func-name">系统设置</text>
							<text class="func-desc">配置系统参数</text>
						</view>
					</view>
					<text class="func-arrow">›</text>
				</view>
			</view>
		</view>
		
		<view class="bottom-space"></view>
	</view>
</template>

<script>
import { getAdminStats } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			stats: {},
			userInfo: null
		}
	},
	computed: {
		isDemo() {
			return this.userInfo?.role === 'demo'
		}
	},
	onLoad() {
		this.userInfo = getStoredUserInfo()
		this.loadStats()
	},
	methods: {
		async loadStats() {
			try {
				const res = await getAdminStats()
				this.stats = res.data || {}
			} catch (e) {
				// 接口可能未实现
			}
		},
		goTo(url) {
			uni.navigateTo({ url })
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
	padding: 40rpx 30rpx 80rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.demo-badge {
	background: linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%);
	color: #fff;
	font-size: 22rpx;
	font-weight: 600;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
}

/* 演示模式提示 */
.demo-notice {
	margin: -50rpx 30rpx 20rpx;
	background: linear-gradient(135deg, rgba(253, 203, 110, 0.15) 0%, rgba(243, 156, 18, 0.15) 100%);
	border: 1rpx solid rgba(243, 156, 18, 0.3);
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	position: relative;
	z-index: 3;
}

.notice-icon {
	font-size: 32rpx;
}

.notice-text {
	font-size: 24rpx;
	color: #f39c12;
	flex: 1;
}

.header-content {
	display: flex;
	flex-direction: column;
}

.header-title {
	font-size: 40rpx;
	font-weight: 700;
	color: #fff;
	margin-bottom: 8rpx;
}

.header-subtitle {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.7);
}

/* 统计卡片区域 */
.stats-section {
	margin: -50rpx 30rpx 20rpx;
	position: relative;
	z-index: 2;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16rpx;
}

.stat-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.stat-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin-right: 16rpx;
}

.stat-icon.users { background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%); }
.stat-icon.domains { background: linear-gradient(135deg, #00b894 0%, #55efc4 100%); }
.stat-icon.subdomains { background: linear-gradient(135deg, #0984e3 0%, #74b9ff 100%); }
.stat-icon.records { background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); }

.stat-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.stat-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #1a1a2e;
}

.stat-label {
	font-size: 22rpx;
	color: #8e8e93;
	margin-top: 4rpx;
}

/* 今日数据卡片 */
.today-card {
	margin: 0 30rpx 20rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.today-header {
	margin-bottom: 20rpx;
}

.today-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.today-grid {
	display: flex;
	align-items: center;
}

.today-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.today-value {
	font-size: 40rpx;
	font-weight: 700;
	margin-bottom: 8rpx;
}

.today-value.green { color: #00b894; }
.today-value.blue { color: #4C84FF; }

.today-label {
	font-size: 24rpx;
	color: #8e8e93;
}

.today-divider {
	width: 1rpx;
	height: 60rpx;
	background: #e0e0e0;
}

/* 菜单区域 */
.menu-section {
	padding: 0 30rpx;
	margin-bottom: 20rpx;
}

.section-title {
	display: block;
	font-size: 26rpx;
	color: #8e8e93;
	margin-bottom: 16rpx;
	padding-left: 8rpx;
}

.menu-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.menu-row {
	display: flex;
	justify-content: space-around;
	margin-bottom: 24rpx;
}

.menu-row:last-child {
	margin-bottom: 0;
}

.menu-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 120rpx;
}

.menu-icon-wrap {
	width: 88rpx;
	height: 88rpx;
	border-radius: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-bottom: 12rpx;
}

.menu-icon-wrap.blue { background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%); }
.menu-icon-wrap.green { background: linear-gradient(135deg, #00b894 0%, #55efc4 100%); }
.menu-icon-wrap.yellow { background: linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%); }
.menu-icon-wrap.purple { background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); }
.menu-icon-wrap.orange { background: linear-gradient(135deg, #e17055 0%, #fab1a0 100%); }
.menu-icon-wrap.cyan { background: linear-gradient(135deg, #00cec9 0%, #81ecec 100%); }
.menu-icon-wrap.teal { background: linear-gradient(135deg, #00b894 0%, #55efc4 100%); }
.menu-icon-wrap.red { background: linear-gradient(135deg, #ff7675 0%, #fab1a0 100%); }
.menu-icon-wrap.pink { background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); }
.menu-icon-wrap.indigo { background: linear-gradient(135deg, #5c6bc0 0%, #7986cb 100%); }
.menu-icon-wrap.gray { background: linear-gradient(135deg, #636e72 0%, #b2bec3 100%); }
.menu-icon-wrap.brown { background: linear-gradient(135deg, #a0826d 0%, #795548 100%); }

.menu-text {
	font-size: 24rpx;
	color: #666;
}

/* 功能列表 */
.func-list {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.func-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.func-item:last-child {
	border-bottom: none;
}

.func-left {
	flex: 1;
	display: flex;
	align-items: center;
}

.func-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin-right: 20rpx;
}

.func-icon.pink { background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); }
.func-icon.brown { background: linear-gradient(135deg, #a0826d 0%, #795548 100%); }
.func-icon.gray { background: linear-gradient(135deg, #636e72 0%, #b2bec3 100%); }

.func-info {
	display: flex;
	flex-direction: column;
}

.func-name {
	font-size: 30rpx;
	font-weight: 500;
	color: #1a1a2e;
	margin-bottom: 6rpx;
}

.func-desc {
	font-size: 24rpx;
	color: #8e8e93;
}

.func-arrow {
	font-size: 36rpx;
	color: #c7c7cc;
}

.bottom-space {
	height: 40rpx;
}
</style>
