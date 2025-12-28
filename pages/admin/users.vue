<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">用户管理</text>
			<text class="header-count">共 {{ users.length }} 位用户</text>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-bar">
				<text class="search-icon">🔍</text>
				<input class="search-input" v-model="searchKey" placeholder="搜索用户名/邮箱" @confirm="handleSearch" />
				<view class="search-btn" @click="handleSearch">搜索</view>
			</view>
		</view>
		
		<!-- 用户列表 -->
		<view class="user-list">
			<view class="user-card" v-for="user in users" :key="user.id" @click="showUserDetail(user)">
				<view class="card-left">
					<view class="user-avatar" :class="{ admin: user.role === 'admin' }">
						<text class="avatar-text">{{ user.username?.charAt(0)?.toUpperCase() || 'U' }}</text>
					</view>
				</view>
				<view class="card-main">
					<view class="user-row">
						<text class="username">{{ user.username }}</text>
						<text class="role-tag" :class="user.role">{{ user.role === 'admin' ? '管理员' : '用户' }}</text>
					</view>
					<text class="email">{{ user.email }}</text>
					<view class="user-stats">
						<view class="stat-chip">
							<text class="chip-label">余额</text>
							<text class="chip-value">{{ user.balance_text }}</text>
						</view>
						<view class="stat-chip">
							<text class="chip-label">域名</text>
							<text class="chip-value">{{ user.used_domains }}/{{ user.max_domains }}</text>
						</view>
					</view>
				</view>
				<view class="card-right">
					<view class="status-badge" :class="{ disabled: user.status === 0 }">
						{{ user.status === 1 ? '正常' : '禁用' }}
					</view>
					<text class="card-arrow">›</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="users.length === 0 && !loading">
				<text class="empty-icon">👥</text>
				<text class="empty-text">暂无用户</text>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore" @click="loadMore">
			<text>{{ loading ? '加载中...' : '加载更多' }}</text>
		</view>
		
		<!-- 用户详情弹窗 -->
		<view class="modal" v-if="showModal" @click.self="showModal = false">
			<view class="modal-content">
				<text class="modal-title">用户详情</text>
				
				<view class="detail-item">
					<text class="detail-label">用户名</text>
					<text class="detail-value">{{ currentUser.username }}</text>
				</view>
				<view class="detail-item">
					<text class="detail-label">邮箱</text>
					<text class="detail-value">{{ currentUser.email }}</text>
				</view>
				<view class="detail-item">
					<text class="detail-label">角色</text>
					<picker :range="roles" :range-key="'label'" @change="onRoleChange">
						<view class="picker">{{ currentUser.role === 'admin' ? '管理员' : '用户' }}</view>
					</picker>
				</view>
				<view class="detail-item">
					<text class="detail-label">状态</text>
					<switch :checked="currentUser.status === 1" @change="onStatusChange" />
				</view>
				<view class="detail-item">
					<text class="detail-label">余额</text>
					<input class="detail-input" type="digit" v-model="editBalance" placeholder="输入余额" />
				</view>
				<view class="detail-item">
					<text class="detail-label">域名上限</text>
					<input class="detail-input" type="number" v-model="editMaxDomains" placeholder="输入上限" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn danger" @click="handleDelete">
						<text>删除</text>
					</view>
					<view class="modal-btn confirm" @click="handleSave">
						<text>保存</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			users: [],
			searchKey: '',
			page: 1,
			hasMore: true,
			loading: false,
			showModal: false,
			currentUser: {},
			editBalance: '',
			editMaxDomains: '',
			userInfo: null,
			roles: [
				{ value: 'user', label: '用户' },
				{ value: 'admin', label: '管理员' },
				{ value: 'demo', label: '演示' }
			]
		}
	},
	computed: {
		isDemo() {
			return this.userInfo?.role === 'demo'
		}
	},
	onLoad() {
		this.userInfo = getStoredUserInfo()
		this.loadUsers()
	},
	methods: {
		async loadUsers() {
			if (this.loading) return
			this.loading = true
			try {
				const res = await getAdminUsers({
					page: this.page,
					per_page: 20,
					search: this.searchKey
				})
				const list = res.data?.users || []
				if (this.page === 1) {
					this.users = list
				} else {
					this.users = [...this.users, ...list]
				}
				const pagination = res.data?.pagination || {}
				this.hasMore = this.page < pagination.pages
			} catch (e) {
				// 接口可能未实现
			}
			this.loading = false
		},
		handleSearch() {
			this.page = 1
			this.loadUsers()
		},
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++
				this.loadUsers()
			}
		},
		showUserDetail(user) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			this.currentUser = { ...user }
			this.editBalance = String(user.balance || 0)
			this.editMaxDomains = String(user.max_domains || 0)
			this.showModal = true
		},
		onRoleChange(e) {
			this.currentUser.role = this.roles[e.detail.value].value
		},
		onStatusChange(e) {
			this.currentUser.status = e.detail.value ? 1 : 0
		},
		async handleSave() {
			try {
				uni.showLoading({ title: '保存中...' })
				await updateAdminUser(this.currentUser.id, {
					role: this.currentUser.role,
					status: this.currentUser.status,
					balance: parseFloat(this.editBalance),
					max_domains: parseInt(this.editMaxDomains)
				})
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showModal = false
				this.page = 1
				this.loadUsers()
			} catch (e) {
				uni.hideLoading()
			}
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除用户 ${this.currentUser.username} 吗？此操作将同时删除该用户的所有域名和记录！`,
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteAdminUser(this.currentUser.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.showModal = false
							this.page = 1
							this.loadUsers()
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

.user-list { padding: 0 30rpx; }

.user-card {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.card-left { margin-right: 20rpx; }

.user-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.user-avatar.admin {
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.avatar-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}

.card-main { flex: 1; }

.user-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 6rpx;
}

.username {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.role-tag {
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	background: rgba(76,132,255,0.1);
	color: #4C84FF;
}

.role-tag.admin {
	background: rgba(255,107,107,0.1);
	color: #ff6b6b;
}

.email {
	font-size: 24rpx;
	color: #8e8e93;
	margin-bottom: 10rpx;
}

.user-stats {
	display: flex;
	gap: 16rpx;
}

.stat-chip {
	display: flex;
	align-items: center;
	gap: 6rpx;
	background: #f8f9fa;
	padding: 6rpx 12rpx;
	border-radius: 8rpx;
}

.chip-label {
	font-size: 20rpx;
	color: #8e8e93;
}

.chip-value {
	font-size: 22rpx;
	color: #1a1a2e;
	font-weight: 500;
}

.card-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
}

.status-badge {
	font-size: 22rpx;
	color: #00b894;
	padding: 6rpx 14rpx;
	background: rgba(0,184,148,0.1);
	border-radius: 8rpx;
}

.status-badge.disabled {
	color: #ff4d4f;
	background: rgba(255,77,79,0.1);
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
	padding: 24rpx 0;
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
</style>
