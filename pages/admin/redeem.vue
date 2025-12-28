<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">卡密管理</text>
			<text class="header-count">共 {{ codes.length }} 条</text>
		</view>
		
		<!-- 筛选栏 -->
		<view class="filter-section">
			<view class="filter-bar">
				<view class="filter-item" :class="{ active: statusFilter === 'all' }" @click="setFilter('all')">
					<text class="filter-text">全部</text>
				</view>
				<view class="filter-item" :class="{ active: statusFilter === 'unused' }" @click="setFilter('unused')">
					<text class="filter-text">未使用</text>
				</view>
				<view class="filter-item" :class="{ active: statusFilter === 'used' }" @click="setFilter('used')">
					<text class="filter-text">已使用</text>
				</view>
			</view>
		</view>
		
		<!-- 卡密列表 -->
		<view class="code-list">
			<view class="code-card" v-for="code in codes" :key="code.id">
				<view class="card-header">
					<view class="code-badge" :class="{ used: code.status === 1 }">
						{{ code.status === 0 ? '未使用' : '已使用' }}
					</view>
					<text class="code-amount">{{ code.amount_text || ('¥' + code.amount) }}</text>
				</view>
				<view class="code-body" @click="copyCode(code.code)">
					<text class="code-text">{{ code.code }}</text>
					<text class="copy-btn">📋</text>
				</view>
				<view class="code-footer">
					<text class="code-user" v-if="code.used_by">使用者: {{ formatUser(code.used_by) }}</text>
					<text class="code-time">{{ formatTime(code.created_at) }}</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="codes.length === 0 && !loading">
				<text class="empty-icon">🎫</text>
				<text class="empty-text">暂无卡密</text>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore" @click="loadMore">
			<text>{{ loading ? '加载中...' : '加载更多' }}</text>
		</view>
		
		<!-- 生成按钮 -->
		<view class="fab" @click="showGenerate">
			<text class="fab-icon">+</text>
		</view>
		
		<!-- 生成卡密弹窗 -->
		<view class="modal" v-if="showGenModal" @click.self="showGenModal = false">
			<view class="modal-content">
				<text class="modal-title">生成卡密</text>
				
				<view class="form-item">
					<text class="label">充值金额</text>
					<input class="input" type="digit" v-model="genForm.amount" placeholder="-1为无限" />
				</view>
				
				<view class="form-item">
					<text class="label">数量</text>
					<input class="input" type="number" v-model="genForm.count" placeholder="1-100" />
				</view>
				
				<view class="form-item">
					<text class="label">过期天数</text>
					<input class="input" type="number" v-model="genForm.expires_days" placeholder="留空不过期" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showGenModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="handleGenerate">
						<text>生成</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 生成结果弹窗 -->
		<view class="modal" v-if="showResultModal" @click.self="showResultModal = false">
			<view class="modal-content">
				<text class="modal-title">生成成功</text>
				<view class="result-codes">
					<text class="result-code" v-for="(code, idx) in generatedCodes" :key="idx">{{ code }}</text>
				</view>
				<view class="modal-btns">
					<view class="modal-btn confirm" @click="copyAll">
						<text>复制全部</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getRedeemCodes, generateRedeemCodes } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			codes: [],
			statusFilter: 'all',
			page: 1,
			hasMore: true,
			loading: false,
			showGenModal: false,
			showResultModal: false,
			generatedCodes: [],
			userInfo: null,
			genForm: {
				amount: '',
				count: '10',
				expires_days: ''
			}
		}
	},
	computed: {
		isDemo() {
			return this.userInfo?.role === 'demo'
		}
	},
	onLoad() {
		this.userInfo = getStoredUserInfo()
		this.loadCodes()
	},
	methods: {
		async loadCodes() {
			if (this.loading) return
			this.loading = true
			try {
				const params = { page: this.page, per_page: 20 }
				if (this.statusFilter === 'unused') params.status = 0
				else if (this.statusFilter === 'used') params.status = 1
				const res = await getRedeemCodes(params)
				const list = res.data?.codes || []
				if (this.page === 1) {
					this.codes = list
				} else {
					this.codes = [...this.codes, ...list]
				}
				const pagination = res.data?.pagination || {}
				this.hasMore = this.page < pagination.pages
			} catch (e) {
				// 接口可能未实现
			}
			this.loading = false
		},
		setFilter(status) {
			this.statusFilter = status
			this.page = 1
			this.loadCodes()
		},
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++
				this.loadCodes()
			}
		},
		formatTime(str) {
			if (!str) return ''
			return str.split('T')[0]
		},
		formatUser(user) {
			if (!user) return ''
			if (typeof user === 'string') return user
			return user.username || user.email || '未知用户'
		},
		showGenerate() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法生成', icon: 'none' })
				return
			}
			this.showGenModal = true
		},
		async handleGenerate() {
			if (!this.genForm.amount || !this.genForm.count) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '生成中...' })
				const params = {
					amount: parseFloat(this.genForm.amount),
					count: parseInt(this.genForm.count)
				}
				if (this.genForm.expires_days) {
					params.expires_days = parseInt(this.genForm.expires_days)
				}
				const res = await generateRedeemCodes(params)
				uni.hideLoading()
				this.generatedCodes = (res.data?.codes || []).map(c => c.code || c)
				this.showGenModal = false
				this.showResultModal = true
				this.page = 1
				this.loadCodes()
			} catch (e) {
				uni.hideLoading()
			}
		},
		copyAll() {
			const text = this.generatedCodes.join('\n')
			uni.setClipboardData({
				data: text,
				success: () => {
					uni.showToast({ title: '已复制', icon: 'success' })
					this.showResultModal = false
				}
			})
		},
		copyCode(code) {
			uni.setClipboardData({
				data: code,
				success: () => {
					uni.showToast({ title: '卡密已复制', icon: 'success' })
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
	padding-bottom: 150rpx;
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

.filter-section {
	margin: -40rpx 30rpx 20rpx;
	position: relative;
	z-index: 2;
}

.filter-bar {
	display: flex;
	background: #fff;
	padding: 16rpx;
	gap: 12rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
}

.filter-item {
	flex: 1;
	padding: 16rpx 0;
	font-size: 26rpx;
	color: #666;
	background: #f8f9fa;
	border-radius: 12rpx;
	text-align: center;
}

.filter-item.active {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}

.filter-text {
	font-weight: 500;
}

.code-list {
	padding: 0 30rpx;
}

.code-card {
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
}

.code-badge {
	font-size: 22rpx;
	color: #00b894;
	padding: 6rpx 14rpx;
	background: rgba(0,184,148,0.1);
	border-radius: 8rpx;
	font-weight: 500;
}

.code-badge.used {
	color: #8e8e93;
	background: #f0f2f5;
}

.code-amount {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff6b00;
}

.code-body {
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.code-text {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
	font-family: monospace;
	letter-spacing: 2rpx;
	flex: 1;
}

.copy-btn {
	font-size: 28rpx;
	padding: 8rpx 16rpx;
	background: rgba(76,132,255,0.1);
	border-radius: 8rpx;
	margin-left: 16rpx;
}

.code-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.code-user {
	font-size: 22rpx;
	color: #4C84FF;
}

.code-time {
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
	color: #8e8e93;
	font-size: 26rpx;
}

.fab {
	position: fixed;
	right: 40rpx;
	bottom: 100rpx;
	width: 110rpx;
	height: 110rpx;
	border-radius: 55rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 12rpx 32rpx rgba(26,26,46,0.4);
}

.fab-icon {
	font-size: 48rpx;
	color: #fff;
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
	margin-bottom: 30rpx;
}

.form-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.label {
	font-size: 28rpx;
	color: #8e8e93;
}

.input {
	width: 200rpx;
	text-align: right;
	font-size: 28rpx;
	color: #1a1a2e;
	background: #f8f9fa;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}

.result-codes {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 20rpx;
	max-height: 400rpx;
	overflow-y: auto;
}

.result-code {
	display: block;
	font-size: 26rpx;
	color: #1a1a2e;
	font-family: monospace;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #e0e0e0;
}

.modal-btns {
	display: flex;
	gap: 16rpx;
	margin-top: 30rpx;
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
