<template>
	<view class="page">
		<!-- 自定义导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<text class="nav-title">个人中心</text>
			</view>
		</view>
		
		<view class="page-content" scroll-y :style="{ paddingTop: navBarHeight + 'px' }">
			<!-- 用户信息区域 -->
			<view class="user-section">
				<view class="user-bg"></view>
				<view class="user-content" v-if="isLoggedIn">
					<view class="avatar-wrap">
						<view class="avatar">
							<text class="avatar-text">{{ userInfo?.username?.charAt(0)?.toUpperCase() || 'U' }}</text>
						</view>
						<view class="user-status" :class="{ admin: isAdmin, demo: isDemo }">
							<text class="status-text">{{ roleText }}</text>
						</view>
					</view>
					<text class="username">{{ userInfo?.username || '用户' }}</text>
					<text class="email">{{ userInfo?.email || '' }}</text>
				</view>
				<view class="user-content guest" v-else @click="goToLogin">
					<view class="avatar-wrap">
						<view class="avatar guest">
							<text class="avatar-text">👤</text>
						</view>
					</view>
					<text class="username">点击登录</text>
					<text class="email">登录后享受完整服务</text>
				</view>
			</view>
			
			<!-- 数据概览 -->
			<view class="overview-card" v-if="isLoggedIn">
				<view class="overview-item">
					<text class="overview-value">{{ userInfo?.balance_text || '¥0.00' }}</text>
					<text class="overview-label">账户余额</text>
				</view>
				<view class="overview-divider"></view>
				<view class="overview-item">
					<text class="overview-value">{{ userInfo?.used_domains || 0 }}</text>
					<text class="overview-label">已用域名</text>
				</view>
				<view class="overview-divider"></view>
				<view class="overview-item">
					<text class="overview-value">{{ userInfo?.max_domains || 0 }}</text>
					<text class="overview-label">域名上限</text>
				</view>
			</view>
			
			<!-- 快捷操作 -->
			<view class="quick-actions" v-if="isLoggedIn">
				<view class="action-item" @click="goToMyDomains">
					<view class="action-icon">🌐</view>
					<text class="action-text">我的域名</text>
				</view>
				<view class="action-item" @click="goToVHost">
					<view class="action-icon">🖥️</view>
					<text class="action-text">虚拟主机</text>
				</view>
				<view class="action-item" @click="goToRecharge">
					<view class="action-icon">💳</view>
					<text class="action-text">充值</text>
				</view>
				<view class="action-item" @click="goToAnnouncements">
					<view class="action-icon">
						📢
						<view class="action-badge" v-if="unreadCount > 0">
							<text class="badge-text">{{ unreadCount > 99 ? '99+' : unreadCount }}</text>
						</view>
					</view>
					<text class="action-text">公告</text>
				</view>
			</view>
			
			<!-- 功能菜单 -->
			<view class="menu-section">
				<text class="menu-section-title">服务与设置</text>
				<view class="menu-card">
					<view class="menu-item" @click="goToMyDomains">
						<view class="menu-icon-wrap blue">
							<text class="menu-icon">🌐</text>
						</view>
						<view class="menu-info">
							<text class="menu-title">域名管理</text>
							<text class="menu-desc">查看和管理您的域名</text>
						</view>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="goToVHost">
						<view class="menu-icon-wrap purple">
							<text class="menu-icon">🖥️</text>
						</view>
						<view class="menu-info">
							<text class="menu-title">虚拟主机</text>
							<text class="menu-desc">管理您的虚拟主机</text>
						</view>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="goToRecords">
						<view class="menu-icon-wrap green">
							<text class="menu-icon">📝</text>
						</view>
						<view class="menu-info">
							<text class="menu-title">交易记录</text>
							<text class="menu-desc">购买和续费历史</text>
						</view>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="goToSettings">
						<view class="menu-icon-wrap gray">
							<text class="menu-icon">⚙️</text>
						</view>
						<view class="menu-info">
							<text class="menu-title">账户设置</text>
							<text class="menu-desc">密码、安全设置</text>
						</view>
						<text class="menu-arrow">›</text>
					</view>
				</view>
				
				<!-- 管理员/演示入口 -->
				<view class="menu-card admin-card" :class="{ 'demo-card': isDemo }" v-if="isAdmin">
					<view class="menu-item" @click="goToAdmin">
						<view class="menu-icon-wrap" :class="isDemo ? 'orange' : 'red'">
							<text class="menu-icon">{{ isDemo ? '👁️' : '🛡️' }}</text>
						</view>
						<view class="menu-info">
							<text class="menu-title">{{ isDemo ? '演示中心' : '管理中心' }}</text>
							<text class="menu-desc">{{ isDemo ? '查看系统数据（只读）' : '系统管理与数据统计' }}</text>
						</view>
						<text class="menu-arrow">›</text>
					</view>
				</view>
			</view>
			
			<!-- 退出登录 -->
			<view class="logout-section" v-if="isLoggedIn">
				<view class="logout-btn" @click="handleLogout">
					<text class="logout-text">退出登录</text>
				</view>
			</view>
			
			<!-- 底部版本信息 -->
			<view class="footer-info">
				<text class="version-text">六趣DNS v1.0.0</text>
			</view>
			
			<view class="bottom-space"></view>
		</view>
		
		<!-- 自定义TabBar -->
		<custom-tabbar current="/pages/mine/mine"></custom-tabbar>
	</view>
</template>

<script>
import { getUserInfo } from '@/api/auth'
import { getUnreadAnnouncements } from '@/api/announcement'
import { isLoggedIn, clearAuth, setUserInfo, getUserInfo as getStoredUserInfo } from '@/utils/storage'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
	components: {
		CustomTabbar
	},
	data() {
		return {
			statusBarHeight: 20,
			navBarHeight: 88,
			isLoggedIn: false,
			userInfo: null,
			unreadCount: 0
		}
	},
	computed: {
		isAdmin() {
			return this.userInfo?.role === 'admin' || this.userInfo?.role === 'demo'
		},
		isDemo() {
			return this.userInfo?.role === 'demo'
		},
		roleText() {
			const role = this.userInfo?.role
			if (role === 'admin') return '管理员'
			if (role === 'demo') return '演示'
			return '用户'
		}
	},
	onLoad() {
		const sysInfo = uni.getSystemInfoSync()
		this.statusBarHeight = sysInfo.statusBarHeight
		this.navBarHeight = sysInfo.statusBarHeight + 44
	},
	onShow() {
		this.isLoggedIn = isLoggedIn()
		if (this.isLoggedIn) {
			this.loadUserInfo()
			this.loadUnreadCount()
		} else {
			this.userInfo = null
		}
	},
	methods: {
		async loadUserInfo() {
			try {
				const res = await getUserInfo()
				this.userInfo = res.data
				setUserInfo(res.data)
			} catch (e) {
				// 可能 token 失效，使用本地缓存
				this.userInfo = getStoredUserInfo()
			}
		},
		async loadUnreadCount() {
			try {
				const res = await getUnreadAnnouncements()
				this.unreadCount = res.data?.unread_count || 0
			} catch (e) {
				console.error('获取未读公告失败', e)
			}
		},
		goToLogin() {
			uni.navigateTo({ url: '/pages/login/login' })
		},
		goToRecharge() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/recharge/recharge' })
		},
		goToMyDomains() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/domain/list' })
		},
		goToVHost() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/vhost/list' })
		},
		goToRecords() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			uni.navigateTo({ url: '/pages/record/record' })
		},
		goToAnnouncements() {
			uni.navigateTo({ url: '/pages/announcement/list' })
		},
		goToSettings() {
			uni.navigateTo({ url: '/pages/settings/settings' })
		},
		goToAdmin() {
			uni.navigateTo({ url: '/pages/admin/index' })
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						clearAuth()
						this.isLoggedIn = false
						this.userInfo = null
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						})
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

.nav-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #ffffff;
}

.page-content {
	min-height: 100vh;
	box-sizing: border-box;
	padding-bottom: 120rpx;
}

/* 用户信息区域 */
.user-section {
	position: relative;
	padding: 60rpx 0 80rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.user-bg {
	position: absolute;
	top: 0;
	right: 0;
	width: 300rpx;
	height: 300rpx;
	background: radial-gradient(circle, rgba(76, 132, 255, 0.2) 0%, transparent 70%);
}

.user-content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.user-content.guest {
	opacity: 0.9;
}

.avatar-wrap {
	position: relative;
	margin-bottom: 20rpx;
}

.avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 70rpx;
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.avatar.guest {
	background: rgba(255, 255, 255, 0.2);
}

.avatar-text {
	font-size: 52rpx;
	color: #fff;
	font-weight: 600;
}

.user-status {
	position: absolute;
	bottom: 0;
	right: -10rpx;
	background: #00b894;
	padding: 4rpx 16rpx;
	border-radius: 16rpx;
}

.user-status.admin {
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.user-status.demo {
	background: linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%);
}

.status-text {
	font-size: 20rpx;
	color: #fff;
	font-weight: 500;
}

.username {
	font-size: 36rpx;
	color: #fff;
	font-weight: 600;
	margin-bottom: 8rpx;
}

.email {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.7);
}

/* 数据概览卡片 */
.overview-card {
	margin: -40rpx 30rpx 20rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 32rpx 24rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	position: relative;
	z-index: 2;
}

.overview-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.overview-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #1a1a2e;
	margin-bottom: 8rpx;
}

.overview-label {
	font-size: 24rpx;
	color: #8e8e93;
}

.overview-divider {
	width: 1rpx;
	height: 60rpx;
	background: #e0e0e0;
}

/* 快捷操作 */
.quick-actions {
	display: flex;
	justify-content: space-around;
	padding: 24rpx 30rpx;
	margin-bottom: 20rpx;
}

.action-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.action-icon {
	position: relative;
	width: 80rpx;
	height: 80rpx;
	background: #fff;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-bottom: 12rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.action-badge {
	position: absolute;
	top: -8rpx;
	right: -8rpx;
	min-width: 32rpx;
	height: 32rpx;
	background: #ff4d4f;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 8rpx;
}

.badge-text {
	font-size: 18rpx;
	color: #fff;
	font-weight: 500;
}

.action-text {
	font-size: 24rpx;
	color: #666;
}

/* 功能菜单 */
.menu-section {
	padding: 0 30rpx;
}

.menu-section-title {
	display: block;
	font-size: 26rpx;
	color: #8e8e93;
	margin-bottom: 16rpx;
	padding-left: 8rpx;
}

.menu-card {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
	margin-bottom: 20rpx;
}

.admin-card {
	border: 2rpx solid rgba(255, 77, 79, 0.2);
}

.demo-card {
	border: 2rpx solid rgba(253, 203, 110, 0.4);
}

.menu-icon-wrap.orange { background: linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%); }

.menu-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon-wrap {
	width: 72rpx;
	height: 72rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.menu-icon-wrap.blue { background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%); }
.menu-icon-wrap.purple { background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); }
.menu-icon-wrap.green { background: linear-gradient(135deg, #00b894 0%, #55efc4 100%); }
.menu-icon-wrap.gray { background: linear-gradient(135deg, #636e72 0%, #b2bec3 100%); }
.menu-icon-wrap.red { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); }

.menu-icon {
	font-size: 32rpx;
}

.menu-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.menu-title {
	font-size: 30rpx;
	font-weight: 500;
	color: #1a1a2e;
	margin-bottom: 6rpx;
}

.menu-desc {
	font-size: 24rpx;
	color: #8e8e93;
}

.menu-arrow {
	font-size: 36rpx;
	color: #c7c7cc;
}

/* 退出登录 */
.logout-section {
	padding: 20rpx 30rpx;
}

.logout-btn {
	background: #fff;
	border-radius: 16rpx;
	padding: 28rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.logout-text {
	font-size: 30rpx;
	color: #ff4d4f;
	font-weight: 500;
}

/* 底部信息 */
.footer-info {
	text-align: center;
	padding: 32rpx 0;
}

.version-text {
	font-size: 24rpx;
	color: #c7c7cc;
}

.bottom-space {
	height: 120rpx;
}
</style>
