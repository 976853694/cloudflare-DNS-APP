<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">优惠券管理</text>
			<text class="header-count">共 {{ coupons.length }} 条</text>
		</view>
		
		<!-- 筛选栏 -->
		<view class="filter-section">
			<view class="filter-bar">
				<view class="filter-item" :class="{ active: statusFilter === 'all' }" @click="setFilter('all')">
					<text class="filter-text">全部</text>
				</view>
				<view class="filter-item" :class="{ active: statusFilter === 'active' }" @click="setFilter('active')">
					<text class="filter-text">有效</text>
				</view>
				<view class="filter-item" :class="{ active: statusFilter === 'disabled' }" @click="setFilter('disabled')">
					<text class="filter-text">已禁用</text>
				</view>
			</view>
		</view>
		
		<!-- 优惠券列表 -->
		<view class="coupon-list">
			<view class="coupon-card" v-for="item in coupons" :key="item.id">
				<view class="card-header">
					<view class="coupon-badge" :class="{ disabled: item.status !== 1 }">
						{{ item.status === 1 ? '有效' : '已禁用' }}
					</view>
					<text class="coupon-value">{{ item.type === 'percent' ? item.value + '%折扣' : '¥' + item.value }}</text>
				</view>
				<view class="coupon-body" @click="copyCode(item.code)">
					<text class="coupon-code">{{ item.code }}</text>
					<text class="copy-btn">📋</text>
				</view>
				<view class="coupon-info">
					<view class="info-row">
						<text class="info-label">名称</text>
						<text class="info-value">{{ item.name }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">最低消费</text>
						<text class="info-value">¥{{ item.min_amount || 0 }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">使用次数</text>
						<text class="info-value">{{ item.used_count || 0 }} / {{ item.total_count === -1 ? '无限' : item.total_count }}</text>
					</view>
					<view class="info-row" v-if="item.expires_at">
						<text class="info-label">过期时间</text>
						<text class="info-value">{{ formatTime(item.expires_at) }}</text>
					</view>
				</view>
				<view class="card-footer">
					<view class="action-btn" @click="viewUsages(item)">
						<text>使用记录</text>
					</view>
					<view class="action-btn" @click="editCoupon(item)">
						<text>编辑</text>
					</view>
					<view class="action-btn danger" @click="deleteCouponConfirm(item)">
						<text>删除</text>
					</view>
				</view>
			</view>
			
			<view class="empty-state" v-if="coupons.length === 0 && !loading">
				<text class="empty-icon">🎁</text>
				<text class="empty-text">暂无优惠券</text>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore" @click="loadMore">
			<text>{{ loading ? '加载中...' : '加载更多' }}</text>
		</view>
		
		<!-- 创建按钮 -->
		<view class="fab" @click="showAddModal">
			<text class="fab-icon">+</text>
		</view>
		
		<!-- 创建/编辑弹窗 -->
		<view class="modal" v-if="showModal" @click.self="closeModal">
			<view class="modal-content">
				<text class="modal-title">{{ isEdit ? '编辑优惠券' : '创建优惠券' }}</text>
				
				<view class="form-item">
					<text class="label">名称</text>
					<input class="input" type="text" v-model="formData.name" placeholder="优惠券名称" />
				</view>
				
				<view class="form-item" v-if="!isEdit">
					<text class="label">优惠码</text>
					<input class="input" type="text" v-model="formData.code" placeholder="留空自动生成" />
				</view>
				
				<view class="form-item">
					<text class="label">类型</text>
					<picker :range="typeOptions" range-key="label" @change="onTypeChange">
						<view class="picker-input">{{ currentTypeLabel }}</view>
					</picker>
				</view>
				
				<view class="form-item">
					<text class="label">优惠值</text>
					<input class="input" type="digit" v-model="formData.value" :placeholder="formData.type === 'percent' ? '如10表示9折' : '固定金额'" />
				</view>
				
				<view class="form-item">
					<text class="label">最低消费</text>
					<input class="input" type="digit" v-model="formData.min_amount" placeholder="0无限制" />
				</view>
				
				<view class="form-item" v-if="formData.type === 'percent'">
					<text class="label">最大优惠</text>
					<input class="input" type="digit" v-model="formData.max_discount" placeholder="留空无限制" />
				</view>
				
				<view class="form-item">
					<text class="label">总数量</text>
					<input class="input" type="number" v-model="formData.total_count" placeholder="-1无限" />
				</view>
				
				<view class="form-item">
					<text class="label">每人限用</text>
					<input class="input" type="number" v-model="formData.per_user_limit" placeholder="默认1" />
				</view>
				
				<view class="form-item">
					<text class="label">过期时间</text>
					<picker mode="date" @change="onExpiresDateChange">
						<view class="picker-input">{{ formData.expires_at || '永不过期' }}</view>
					</picker>
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="closeModal">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="submitForm">
						<text>{{ isEdit ? '保存' : '创建' }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 使用记录弹窗 -->
		<view class="modal" v-if="showUsagesModal" @click.self="closeUsagesModal">
			<view class="modal-content">
				<text class="modal-title">使用记录 - {{ currentCoupon?.code }}</text>
				<view class="usage-list" v-if="usages.length > 0">
					<view class="usage-item" v-for="usage in usages" :key="usage.id">
						<text class="usage-user">{{ usage.user?.email || '未知用户' }}</text>
						<text class="usage-amount">-¥{{ usage.discount_amount }}</text>
						<text class="usage-time">{{ formatTime(usage.created_at) }}</text>
					</view>
				</view>
				<view class="empty-state small" v-else>
					<text class="empty-text">暂无使用记录</text>
				</view>
				<view class="modal-btns">
					<view class="modal-btn confirm" @click="closeUsagesModal">
						<text>关闭</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, getCouponUsages } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			coupons: [],
			loading: false,
			page: 1,
			hasMore: true,
			statusFilter: 'all',
			typeOptions: [
				{ label: '折扣百分比', value: 'percent' },
				{ label: '固定金额', value: 'fixed' }
			],
			showModal: false,
			isEdit: false,
			formData: {
				name: '',
				code: '',
				type: 'percent',
				value: '',
				min_amount: '',
				max_discount: '',
				total_count: '-1',
				per_user_limit: '1',
				expires_at: ''
			},
			editingId: null,
			showUsagesModal: false,
			currentCoupon: null,
			usages: [],
			userInfo: null
		}
	},
	computed: {
		currentTypeLabel() {
			const item = this.typeOptions.find(o => o.value === this.formData.type)
			return item ? item.label : '折扣百分比'
		},
		isDemo() {
			return this.userInfo?.role === 'demo'
		}
	},
	onLoad() {
		this.userInfo = getStoredUserInfo()
		this.loadCoupons()
	},
	methods: {
		async loadCoupons() {
			if (this.loading) return
			this.loading = true
			
			try {
				const params = { page: this.page, per_page: 20 }
				if (this.statusFilter === 'active') params.status = 1
				else if (this.statusFilter === 'disabled') params.status = 0
				
				const res = await getCoupons(params)
				const list = res.data?.coupons || res.data?.list || []
				
				if (this.page === 1) {
					this.coupons = list
				} else {
					this.coupons = [...this.coupons, ...list]
				}
				
				const pagination = res.data?.pagination || {}
				this.hasMore = this.page < (pagination.pages || 1)
			} catch (e) {
				console.error('加载优惠券失败', e)
			}
			this.loading = false
		},
		setFilter(status) {
			this.statusFilter = status
			this.page = 1
			this.loadCoupons()
		},
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++
				this.loadCoupons()
			}
		},
		formatTime(str) {
			if (!str) return ''
			return str.split('T')[0]
		},
		onTypeChange(e) {
			this.formData.type = this.typeOptions[e.detail.value].value
		},
		onExpiresDateChange(e) {
			this.formData.expires_at = e.detail.value
		},
		showAddModal() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法添加', icon: 'none' })
				return
			}
			this.isEdit = false
			this.editingId = null
			this.formData = {
				name: '',
				code: '',
				type: 'percent',
				value: '',
				min_amount: '',
				max_discount: '',
				total_count: '-1',
				per_user_limit: '1',
				expires_at: ''
			}
			this.showModal = true
		},
		editCoupon(item) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			this.isEdit = true
			this.editingId = item.id
			this.formData = {
				name: item.name || '',
				code: item.code || '',
				type: item.type || 'percent',
				value: String(item.value || ''),
				min_amount: String(item.min_amount || ''),
				max_discount: String(item.max_discount || ''),
				total_count: String(item.total_count ?? '-1'),
				per_user_limit: String(item.per_user_limit || '1'),
				expires_at: item.expires_at ? item.expires_at.split('T')[0] : ''
			}
			this.showModal = true
		},
		closeModal() {
			this.showModal = false
		},
		async submitForm() {
			if (!this.formData.name) {
				uni.showToast({ title: '请输入名称', icon: 'none' })
				return
			}
			if (!this.formData.value) {
				uni.showToast({ title: '请输入优惠值', icon: 'none' })
				return
			}
			
			const data = {
				name: this.formData.name,
				type: this.formData.type,
				value: parseFloat(this.formData.value)
			}
			
			if (!this.isEdit && this.formData.code) {
				data.code = this.formData.code
			}
			if (this.formData.min_amount) {
				data.min_amount = parseFloat(this.formData.min_amount)
			}
			if (this.formData.max_discount) {
				data.max_discount = parseFloat(this.formData.max_discount)
			}
			if (this.formData.total_count) {
				data.total_count = parseInt(this.formData.total_count)
			}
			if (this.formData.per_user_limit) {
				data.per_user_limit = parseInt(this.formData.per_user_limit)
			}
			if (this.formData.expires_at) {
				data.expires_at = this.formData.expires_at + 'T23:59:59Z'
			}
			
			try {
				uni.showLoading({ title: '保存中...' })
				if (this.isEdit) {
					await updateCoupon(this.editingId, data)
				} else {
					await createCoupon(data)
				}
				uni.hideLoading()
				uni.showToast({ title: this.isEdit ? '更新成功' : '创建成功', icon: 'success' })
				this.closeModal()
				this.page = 1
				this.loadCoupons()
			} catch (e) {
				uni.hideLoading()
				console.error('保存失败', e)
			}
		},
		deleteCouponConfirm(item) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法删除', icon: 'none' })
				return
			}
			uni.showModal({
				title: '确认删除',
				content: `确定要删除优惠券 "${item.code}" 吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteCoupon(item.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.page = 1
							this.loadCoupons()
						} catch (e) {
							console.error('删除失败', e)
						}
					}
				}
			})
		},
		async viewUsages(item) {
			this.currentCoupon = item
			this.usages = []
			this.showUsagesModal = true
			
			try {
				const res = await getCouponUsages(item.id)
				this.usages = res.data?.usages || res.data?.list || []
			} catch (e) {
				console.error('加载使用记录失败', e)
			}
		},
		closeUsagesModal() {
			this.showUsagesModal = false
			this.currentCoupon = null
			this.usages = []
		},
		copyCode(code) {
			uni.setClipboardData({
				data: code,
				success: () => {
					uni.showToast({ title: '优惠码已复制', icon: 'success' })
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

.coupon-list {
	padding: 0 30rpx;
}

.coupon-card {
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

.coupon-badge {
	font-size: 22rpx;
	color: #00b894;
	padding: 6rpx 14rpx;
	background: rgba(0,184,148,0.1);
	border-radius: 8rpx;
	font-weight: 500;
}

.coupon-badge.disabled {
	color: #8e8e93;
	background: #f0f2f5;
}

.coupon-value {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff6b00;
}

.coupon-body {
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.coupon-code {
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

.coupon-info {
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
}

.card-footer {
	display: flex;
	gap: 16rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f2f5;
}

.action-btn {
	flex: 1;
	padding: 16rpx 0;
	text-align: center;
	background: #f8f9fa;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: #666;
}

.action-btn.danger {
	background: rgba(255,107,107,0.1);
	color: #ff6b6b;
}

.empty-state {
	padding: 100rpx;
	text-align: center;
}

.empty-state.small {
	padding: 40rpx;
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
	width: 280rpx;
	text-align: right;
	font-size: 28rpx;
	color: #1a1a2e;
	background: #f8f9fa;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}

.picker-input {
	width: 280rpx;
	text-align: right;
	font-size: 28rpx;
	color: #1a1a2e;
	background: #f8f9fa;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
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

.usage-list {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 16rpx;
	max-height: 400rpx;
	overflow-y: auto;
}

.usage-item {
	display: flex;
	align-items: center;
	padding: 16rpx;
	border-bottom: 1rpx solid #e0e0e0;
}

.usage-item:last-child {
	border-bottom: none;
}

.usage-user {
	flex: 1;
	font-size: 26rpx;
	color: #1a1a2e;
}

.usage-amount {
	font-size: 26rpx;
	color: #ff6b00;
	font-weight: 500;
	margin-right: 20rpx;
}

.usage-time {
	font-size: 22rpx;
	color: #8e8e93;
}
</style>
