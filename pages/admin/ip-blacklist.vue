<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">IP 黑名单</text>
			<text class="header-subtitle">管理被封禁的 IP 地址</text>
		</view>
		
		<view class="content">
			<!-- 搜索和添加 -->
			<view class="toolbar">
				<view class="search-box">
					<input class="search-input" v-model="searchKey" placeholder="搜索 IP 地址" @confirm="loadList" />
					<view class="search-btn" @click="loadList">
						<text>🔍</text>
					</view>
				</view>
				<view class="add-btn" @click="showAddModal = true">
					<text>+ 添加</text>
				</view>
			</view>
			
			<!-- IP 列表 -->
			<view class="ip-list">
				<view class="ip-card" v-for="item in list" :key="item.id">
					<view class="ip-main">
						<text class="ip-address">{{ item.ip_address }}</text>
						<view class="ip-status" :class="isExpired(item) ? 'expired' : 'active'">
							<text>{{ isExpired(item) ? '已过期' : '生效中' }}</text>
						</view>
					</view>
					<view class="ip-info">
						<text class="ip-reason" v-if="item.reason">原因：{{ item.reason }}</text>
						<text class="ip-time">封禁时间：{{ item.created_at }}</text>
						<text class="ip-expire" v-if="item.expires_at">到期时间：{{ item.expires_at }}</text>
						<text class="ip-expire" v-else>永久封禁</text>
					</view>
					<view class="ip-actions">
						<view class="action-btn danger" @click="removeIp(item)">
							<text>解除封禁</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="list.length === 0 && !loading">
				<text class="empty-icon">🛡️</text>
				<text class="empty-text">暂无黑名单记录</text>
			</view>
			
			<!-- 分页 -->
			<view class="pagination" v-if="pagination.pages > 1">
				<view class="page-btn" :class="{ disabled: pagination.page <= 1 }" @click="changePage(pagination.page - 1)">
					<text>上一页</text>
				</view>
				<text class="page-info">{{ pagination.page }} / {{ pagination.pages }}</text>
				<view class="page-btn" :class="{ disabled: pagination.page >= pagination.pages }" @click="changePage(pagination.page + 1)">
					<text>下一页</text>
				</view>
			</view>
		</view>
		
		<!-- 添加弹窗 -->
		<view class="modal" v-if="showAddModal" @click.self="showAddModal = false">
			<view class="modal-content">
				<text class="modal-title">添加 IP 到黑名单</text>
				
				<view class="form-group">
					<text class="form-label">IP 地址 *</text>
					<input class="form-input" v-model="addForm.ip_address" placeholder="如：192.168.1.1" />
				</view>
				
				<view class="form-group">
					<text class="form-label">封禁原因</text>
					<input class="form-input" v-model="addForm.reason" placeholder="可选，填写封禁原因" />
				</view>
				
				<view class="form-group">
					<text class="form-label">封禁天数</text>
					<input class="form-input" type="number" v-model="addForm.duration_days" placeholder="留空为永久封禁" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showAddModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="addIp">
						<text>确认添加</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- IP 检查弹窗 -->
		<view class="modal" v-if="showCheckModal" @click.self="showCheckModal = false">
			<view class="modal-content">
				<text class="modal-title">检查 IP 状态</text>
				
				<view class="form-group">
					<text class="form-label">IP 地址</text>
					<input class="form-input" v-model="checkIp" placeholder="输入要检查的 IP" />
				</view>
				
				<view class="check-result" v-if="checkResult !== null">
					<text class="result-text" :class="checkResult ? 'blocked' : 'normal'">
						{{ checkResult ? '⛔ 该 IP 已被封禁' : '✅ 该 IP 未被封禁' }}
					</text>
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showCheckModal = false">
						<text>关闭</text>
					</view>
					<view class="modal-btn confirm" @click="checkIpStatus">
						<text>检查</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getIpBlacklist, addIpToBlacklist, removeIpFromBlacklist, checkIpBlacklist } from '@/api/admin'

export default {
	data() {
		return {
			loading: false,
			searchKey: '',
			list: [],
			pagination: {
				page: 1,
				per_page: 20,
				total: 0,
				pages: 0
			},
			showAddModal: false,
			showCheckModal: false,
			addForm: {
				ip_address: '',
				reason: '',
				duration_days: ''
			},
			checkIp: '',
			checkResult: null
		}
	},
	onLoad() {
		this.loadList()
	},
	methods: {
		async loadList() {
			this.loading = true
			uni.showLoading({ title: '加载中...' })
			try {
				const res = await getIpBlacklist({
					page: this.pagination.page,
					per_page: this.pagination.per_page,
					search: this.searchKey
				})
				this.list = res.data?.list || res.data?.blacklist || []
				if (res.data?.pagination) {
					this.pagination = { ...this.pagination, ...res.data.pagination }
				}
			} catch (e) {
				console.error('加载失败', e)
			}
			uni.hideLoading()
			this.loading = false
		},
		
		isExpired(item) {
			if (!item.expires_at) return false
			return new Date(item.expires_at) < new Date()
		},
		
		changePage(page) {
			if (page < 1 || page > this.pagination.pages) return
			this.pagination.page = page
			this.loadList()
		},
		
		async addIp() {
			if (!this.addForm.ip_address) {
				uni.showToast({ title: '请输入 IP 地址', icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '添加中...' })
				const data = {
					ip_address: this.addForm.ip_address,
					reason: this.addForm.reason || undefined,
					duration_days: this.addForm.duration_days ? parseInt(this.addForm.duration_days) : undefined
				}
				await addIpToBlacklist(data)
				uni.hideLoading()
				uni.showToast({ title: '添加成功', icon: 'success' })
				this.showAddModal = false
				this.addForm = { ip_address: '', reason: '', duration_days: '' }
				this.loadList()
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		removeIp(item) {
			uni.showModal({
				title: '解除封禁',
				content: `确定要解除 ${item.ip_address} 的封禁吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '处理中...' })
							await removeIpFromBlacklist(item.id)
							uni.hideLoading()
							uni.showToast({ title: '已解除', icon: 'success' })
							this.loadList()
						} catch (e) {
							uni.hideLoading()
						}
					}
				}
			})
		},
		
		async checkIpStatus() {
			if (!this.checkIp) {
				uni.showToast({ title: '请输入 IP 地址', icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '检查中...' })
				const res = await checkIpBlacklist(this.checkIp)
				uni.hideLoading()
				this.checkResult = res.data?.blocked || false
			} catch (e) {
				uni.hideLoading()
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

.page-header {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 40rpx 30rpx 60rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
	display: block;
}

.header-subtitle {
	font-size: 24rpx;
	color: rgba(255,255,255,0.7);
	margin-top: 8rpx;
	display: block;
}

.content {
	padding: 0 30rpx;
	margin-top: -30rpx;
	position: relative;
	z-index: 2;
}

.toolbar {
	display: flex;
	gap: 16rpx;
	margin-bottom: 24rpx;
}

.search-box {
	flex: 1;
	display: flex;
	background: #fff;
	border-radius: 40rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.search-input {
	flex: 1;
	height: 80rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
}

.search-btn {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
}

.add-btn {
	height: 80rpx;
	padding: 0 32rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.add-btn text {
	font-size: 28rpx;
	color: #fff;
	font-weight: 500;
}

.ip-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.ip-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.ip-main {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.ip-address {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a2e;
	font-family: monospace;
}

.ip-status {
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
}

.ip-status.active {
	background: rgba(255,77,79,0.1);
	color: #ff4d4f;
}

.ip-status.expired {
	background: rgba(142,142,147,0.1);
	color: #8e8e93;
}

.ip-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	margin-bottom: 16rpx;
}

.ip-reason {
	font-size: 26rpx;
	color: #666;
}

.ip-time, .ip-expire {
	font-size: 24rpx;
	color: #8e8e93;
}

.ip-actions {
	display: flex;
	gap: 16rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f0f0;
}

.action-btn {
	padding: 12rpx 24rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
}

.action-btn.danger {
	background: rgba(255,77,79,0.1);
	color: #ff4d4f;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #8e8e93;
}

.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 24rpx;
	padding: 30rpx 0;
}

.page-btn {
	padding: 16rpx 32rpx;
	background: #fff;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #1a1a2e;
}

.page-btn.disabled {
	opacity: 0.5;
}

.page-info {
	font-size: 26rpx;
	color: #666;
}

/* 弹窗样式 */
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
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1a2e;
	text-align: center;
	margin-bottom: 30rpx;
	display: block;
}

.form-group {
	margin-bottom: 24rpx;
}

.form-label {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-bottom: 12rpx;
}

.form-input {
	width: 100%;
	height: 88rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 30rpx;
	box-sizing: border-box;
}

.check-result {
	padding: 24rpx;
	border-radius: 12rpx;
	text-align: center;
	margin-bottom: 24rpx;
}

.result-text {
	font-size: 30rpx;
	font-weight: 500;
}

.result-text.blocked {
	color: #ff4d4f;
}

.result-text.normal {
	color: #00b894;
}

.modal-btns {
	display: flex;
	gap: 16rpx;
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

.modal-btn.confirm {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}
</style>
