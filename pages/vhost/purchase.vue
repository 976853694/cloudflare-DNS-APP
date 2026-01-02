<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="page-title">购买虚拟主机</text>
			<text class="page-subtitle">选择适合您的套餐方案</text>
		</view>
		
		<!-- 步骤指示 -->
		<view class="steps-bar">
			<view class="step-item" :class="{ active: true, done: selectedPlan }">
				<view class="step-dot">1</view>
				<text class="step-label">选择套餐</text>
			</view>
			<view class="step-line" :class="{ active: selectedPlan }"></view>
			<view class="step-item" :class="{ active: selectedPlan }">
				<view class="step-dot">2</view>
				<text class="step-label">填写信息</text>
			</view>
		</view>
		
		<!-- 套餐列表 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">选择套餐方案</text>
				<text class="section-count">{{ plans.length }} 个可选</text>
			</view>
			
			<view class="empty-state" v-if="!loading && plans.length === 0">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无可用套餐</text>
			</view>
			
			<view class="plan-list" v-else>
				<view 
					class="plan-card" 
					v-for="plan in plans" 
					:key="plan.id"
					:class="{ active: selectedPlan?.id === plan.id }"
					@click="selectPlan(plan)"
				>
					<view class="plan-radio">
						<view class="radio-inner" v-if="selectedPlan?.id === plan.id"></view>
					</view>
					<view class="plan-content">
						<view class="plan-top">
							<text class="plan-name">{{ plan.name }}</text>
							<view class="plan-price-box">
								<text class="plan-price">¥{{ plan.price }}</text>
								<text class="plan-duration">/{{ plan.duration_days }}天</text>
							</view>
						</view>
						<text class="plan-desc" v-if="plan.description">{{ plan.description }}</text>
						<view class="plan-specs">
							<view class="spec-item">
								<text class="spec-icon">💾</text>
								<text class="spec-text">{{ plan.disk_space_display }}</text>
							</view>
							<view class="spec-item">
								<text class="spec-icon">📊</text>
								<text class="spec-text">{{ plan.bandwidth_display }}/月</text>
							</view>
							<view class="spec-item">
								<text class="spec-icon">🌐</text>
								<text class="spec-text">{{ plan.max_domains }}个域名</text>
							</view>
							<view class="spec-item">
								<text class="spec-icon">🗄️</text>
								<text class="spec-text">{{ plan.max_databases }}个数据库</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 输入域名 -->
		<view class="section" v-if="selectedPlan">
			<view class="section-header">
				<text class="section-title">设置主域名</text>
			</view>
			<view class="domain-input-card">
				<view class="input-row">
					<input 
						class="domain-input" 
						v-model="domain" 
						placeholder="输入您的域名，如 example.com"
					/>
				</view>
				<view class="input-tip">
					<text class="tip-icon">💡</text>
					<text class="tip-text">请输入您已拥有的域名，购买后需将域名解析到服务器</text>
				</view>
			</view>
		</view>

		<!-- 优惠码 -->
		<view class="section" v-if="selectedPlan && selectedPlan.price > 0">
			<view class="section-header">
				<text class="section-title">优惠码</text>
				<text class="section-optional">选填</text>
			</view>
			<view class="coupon-input-card">
				<view class="coupon-input-row">
					<input 
						class="coupon-input" 
						v-model="couponCode" 
						placeholder="输入优惠码"
						:disabled="couponApplied"
					/>
					<view class="coupon-btn" @click="handleCoupon" v-if="!couponApplied">
						<text>{{ couponLoading ? '验证中...' : '使用' }}</text>
					</view>
					<view class="coupon-btn cancel" @click="cancelCoupon" v-else>
						<text>取消</text>
					</view>
				</view>
				<view class="coupon-result" v-if="couponApplied && couponInfo">
					<view class="coupon-success">
						<text class="coupon-icon">🎉</text>
						<text class="coupon-msg">{{ couponInfo.coupon.name }}</text>
					</view>
					<view class="coupon-discount">
						<text>优惠 -¥{{ couponInfo.discount }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 提交按钮 -->
		<view class="footer" v-if="selectedPlan">
			<view class="footer-left">
				<text class="price-label">应付金额</text>
				<text class="price-value">{{ finalPrice }}</text>
				<text class="price-original" v-if="couponApplied && couponInfo">原价 ¥{{ selectedPlan.price }}</text>
			</view>
			<view class="submit-btn" @click="handlePurchase">
				<text class="submit-text">立即购买</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getVHostPlans, purchaseVHost } from '@/api/vhost'
import { validateCoupon } from '@/api/coupon'
import { isLoggedIn } from '@/utils/storage'

export default {
	data() {
		return {
			loading: false,
			plans: [],
			selectedPlan: null,
			domain: '',
			couponCode: '',
			couponLoading: false,
			couponApplied: false,
			couponInfo: null
		}
	},
	computed: {
		finalPrice() {
			if (!this.selectedPlan) return '¥0'
			if (this.selectedPlan.price <= 0) return '免费'
			if (this.couponApplied && this.couponInfo) {
				return '¥' + this.couponInfo.final_price
			}
			return '¥' + this.selectedPlan.price
		}
	},
	onLoad() {
		this.loadPlans()
	},
	methods: {
		async loadPlans() {
			this.loading = true
			try {
				const res = await getVHostPlans()
				this.plans = res.data?.plans || []
			} catch (e) {
				console.error('加载套餐失败', e)
			}
			this.loading = false
		},
		selectPlan(plan) {
			this.selectedPlan = plan
			this.cancelCoupon()
		},
		async handleCoupon() {
			if (!this.couponCode.trim()) {
				uni.showToast({ title: '请输入优惠码', icon: 'none' })
				return
			}
			if (this.couponLoading) return
			
			this.couponLoading = true
			try {
				const res = await validateCoupon({
					code: this.couponCode.trim(),
					plan_id: this.selectedPlan.id,
					price: this.selectedPlan.price,
					product_type: 'vhost'
				})
				this.couponInfo = res.data
				this.couponApplied = true
				uni.showToast({ title: '优惠码已应用', icon: 'success' })
			} catch (e) {
				console.error('验证优惠码失败', e)
			}
			this.couponLoading = false
		},
		cancelCoupon() {
			this.couponCode = ''
			this.couponApplied = false
			this.couponInfo = null
		},
		validateDomain(domain) {
			const pattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/
			return pattern.test(domain)
		},
		async handlePurchase() {
			if (!isLoggedIn()) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			if (!this.domain.trim()) {
				uni.showToast({ title: '请输入域名', icon: 'none' })
				return
			}
			if (!this.validateDomain(this.domain.trim())) {
				uni.showToast({ title: '域名格式不正确', icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '购买中...' })
				const params = {
					plan_id: this.selectedPlan.id,
					domain: this.domain.trim()
				}
				if (this.couponApplied && this.couponCode) {
					params.coupon_code = this.couponCode.trim()
				}
				const res = await purchaseVHost(params)
				uni.hideLoading()
				uni.showToast({ title: '购买成功', icon: 'success' })
				setTimeout(() => {
					const instanceId = res.data?.instance?.id
					if (instanceId) {
						uni.redirectTo({ url: `/pages/vhost/detail?id=${instanceId}` })
					} else {
						uni.redirectTo({ url: '/pages/vhost/list' })
					}
				}, 1500)
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
	padding-bottom: 180rpx;
}

.page-header {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 40rpx 30rpx 60rpx;
}

.page-title {
	display: block;
	font-size: 40rpx;
	font-weight: 700;
	color: #fff;
	margin-bottom: 8rpx;
}

.page-subtitle {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.7);
}

.steps-bar {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff;
	margin: -30rpx 30rpx 20rpx;
	padding: 32rpx 24rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
}

.step-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	opacity: 0.4;
}

.step-item.active { opacity: 1; }

.step-dot {
	width: 44rpx;
	height: 44rpx;
	border-radius: 22rpx;
	background: #e0e0e0;
	color: #999;
	font-size: 24rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 8rpx;
}

.step-item.active .step-dot {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}

.step-item.done .step-dot { background: #00b894; }

.step-label {
	font-size: 22rpx;
	color: #8e8e93;
}

.step-item.active .step-label {
	color: #1a1a2e;
	font-weight: 500;
}

.step-line {
	width: 80rpx;
	height: 4rpx;
	background: #e0e0e0;
	margin: 0 20rpx;
	margin-bottom: 28rpx;
}

.step-line.active { background: #00b894; }

.section {
	background: #fff;
	margin: 0 30rpx 20rpx;
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.section-count {
	font-size: 24rpx;
	color: #8e8e93;
}

.section-optional {
	font-size: 22rpx;
	color: #8e8e93;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #8e8e93;
}

.plan-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.plan-card {
	display: flex;
	align-items: flex-start;
	padding: 28rpx;
	background: #f8f9fa;
	border-radius: 16rpx;
	border: 2rpx solid transparent;
}

.plan-card.active {
	border-color: #4C84FF;
	background: rgba(76, 132, 255, 0.05);
}

.plan-radio {
	width: 40rpx;
	height: 40rpx;
	border: 3rpx solid #d0d0d0;
	border-radius: 50%;
	margin-right: 20rpx;
	margin-top: 4rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.plan-card.active .plan-radio { border-color: #4C84FF; }

.radio-inner {
	width: 22rpx;
	height: 22rpx;
	background: #4C84FF;
	border-radius: 50%;
}

.plan-content { flex: 1; }

.plan-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.plan-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.plan-price-box {
	display: flex;
	align-items: baseline;
}

.plan-price {
	font-size: 36rpx;
	font-weight: 700;
	color: #ff6b00;
}

.plan-duration {
	font-size: 22rpx;
	color: #8e8e93;
	margin-left: 4rpx;
}

.plan-desc {
	display: block;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 16rpx;
}

.plan-specs {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.spec-item {
	display: flex;
	align-items: center;
	background: #fff;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}

.spec-icon {
	font-size: 24rpx;
	margin-right: 8rpx;
}

.spec-text {
	font-size: 22rpx;
	color: #666;
}

.domain-input-card {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 24rpx;
}

.input-row {
	background: #fff;
	border-radius: 12rpx;
	border: 2rpx solid #e0e0e0;
}

.domain-input {
	height: 88rpx;
	padding: 0 24rpx;
	font-size: 30rpx;
}

.input-tip {
	display: flex;
	align-items: flex-start;
	margin-top: 16rpx;
}

.tip-icon {
	font-size: 28rpx;
	margin-right: 8rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #8e8e93;
	line-height: 1.5;
}

.coupon-input-card {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 24rpx;
}

.coupon-input-row {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.coupon-input {
	flex: 1;
	height: 80rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	background: #fff;
	border-radius: 12rpx;
	border: 2rpx solid #e0e0e0;
}

.coupon-btn {
	height: 80rpx;
	padding: 0 32rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.coupon-btn text {
	font-size: 26rpx;
	color: #fff;
	font-weight: 500;
}

.coupon-btn.cancel { background: #f0f2f5; }
.coupon-btn.cancel text { color: #666; }

.coupon-result {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx dashed #e0e0e0;
}

.coupon-success {
	display: flex;
	align-items: center;
}

.coupon-icon {
	font-size: 32rpx;
	margin-right: 12rpx;
}

.coupon-msg {
	font-size: 26rpx;
	color: #00b894;
	font-weight: 500;
}

.coupon-discount {
	font-size: 28rpx;
	color: #ff6b00;
	font-weight: 600;
}

.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	display: flex;
	align-items: center;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.footer-left { flex: 1; }

.price-label {
	font-size: 24rpx;
	color: #8e8e93;
	display: block;
	margin-bottom: 4rpx;
}

.price-value {
	font-size: 40rpx;
	color: #ff6b00;
	font-weight: 700;
}

.price-original {
	display: block;
	font-size: 22rpx;
	color: #8e8e93;
	text-decoration: line-through;
	margin-top: 4rpx;
}

.submit-btn {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 24rpx 56rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 24rpx rgba(26, 26, 46, 0.3);
}

.submit-text {
	font-size: 30rpx;
	color: #fff;
	font-weight: 600;
}
</style>
