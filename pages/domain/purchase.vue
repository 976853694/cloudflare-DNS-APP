<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="page-title">注册域名</text>
			<text class="page-subtitle">选择心仪的域名后缀开始注册</text>
		</view>
		
		<!-- 步骤指示 -->
		<view class="steps-bar">
			<view class="step-item" :class="{ active: true, done: selectedDomain }">
				<view class="step-dot">1</view>
				<text class="step-label">选择域名</text>
			</view>
			<view class="step-line" :class="{ active: selectedDomain }"></view>
			<view class="step-item" :class="{ active: selectedDomain, done: selectedPlan }">
				<view class="step-dot">2</view>
				<text class="step-label">选择套餐</text>
			</view>
			<view class="step-line" :class="{ active: selectedPlan }"></view>
			<view class="step-item" :class="{ active: selectedPlan }">
				<view class="step-dot">3</view>
				<text class="step-label">填写信息</text>
			</view>
		</view>
		
		<!-- 选择主域名 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">选择域名后缀</text>
				<text class="section-count">{{ domains.length }} 个可选</text>
			</view>
			<view class="domain-grid">
				<view 
					class="domain-card" 
					v-for="domain in domains" 
					:key="domain.id"
					:class="{ active: selectedDomain?.id === domain.id }"
					@click="selectDomain(domain)"
				>
					<view class="domain-check" v-if="selectedDomain?.id === domain.id">✓</view>
					<text class="domain-suffix">.{{ domain.name.split('.').pop() }}</text>
					<text class="domain-full">{{ domain.name }}</text>
					<text class="domain-count">{{ domain.subdomains_count }} 已注册</text>
				</view>
			</view>
		</view>
		
		<!-- 选择套餐 -->
		<view class="section" v-if="selectedDomain">
			<view class="section-header">
				<text class="section-title">选择套餐方案</text>
			</view>
			<view class="plan-list">
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
							<text class="plan-price">{{ plan.price > 0 ? '¥' + plan.price : '免费' }}</text>
						</view>
						<view class="plan-tags">
							<text class="plan-tag">{{ plan.duration_text }}</text>
							<text class="plan-tag">{{ plan.min_length }}-{{ plan.max_length }}字符</text>
							<text class="plan-tag">{{ plan.max_records_text }}记录</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 输入二级域名 -->
		<view class="section" v-if="selectedPlan">
			<view class="section-header">
				<text class="section-title">设置您的域名</text>
			</view>
			<view class="domain-input-card">
				<view class="input-row">
					<input 
						class="subdomain-input" 
						v-model="subdomainName" 
						:placeholder="`输入${selectedPlan.min_length}-${selectedPlan.max_length}个字符`"
					/>
					<view class="domain-suffix-box">
						<text class="domain-suffix">.{{ selectedDomain.name }}</text>
					</view>
				</view>
				<view class="preview-row" v-if="subdomainName">
					<text class="preview-label">预览：</text>
					<text class="preview-domain">{{ subdomainName }}.{{ selectedDomain.name }}</text>
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
				<text class="submit-text">立即注册</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getDomains, getDomainPlans, purchaseDomain } from '@/api/domain'
import { validateCoupon } from '@/api/coupon'
import { isLoggedIn } from '@/utils/storage'

export default {
	data() {
		return {
			domains: [],
			plans: [],
			selectedDomain: null,
			selectedPlan: null,
			subdomainName: '',
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
	onLoad(options) {
		this.loadDomains(options.domainId)
	},
	methods: {
		async loadDomains(domainId) {
			try {
				const res = await getDomains()
				this.domains = res.data?.domains || []
				if (domainId) {
					const domain = this.domains.find(d => d.id == domainId)
					if (domain) this.selectDomain(domain)
				}
			} catch (e) {
				console.error('加载域名失败', e)
			}
		},
		async selectDomain(domain) {
			this.selectedDomain = domain
			this.selectedPlan = null
			this.cancelCoupon()
			try {
				const res = await getDomainPlans(domain.id)
				this.plans = res.data?.plans || []
			} catch (e) {
				console.error('加载套餐失败', e)
			}
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
					price: this.selectedPlan.price
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
		async handlePurchase() {
			if (!isLoggedIn()) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			if (!this.subdomainName) {
				uni.showToast({ title: '请输入二级域名', icon: 'none' })
				return
			}
			const len = this.subdomainName.length
			if (len < this.selectedPlan.min_length || len > this.selectedPlan.max_length) {
				uni.showToast({ title: `域名长度需${this.selectedPlan.min_length}-${this.selectedPlan.max_length}字符`, icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '购买中...' })
				const params = {
					domain_id: this.selectedDomain.id,
					plan_id: this.selectedPlan.id,
					name: this.subdomainName
				}
				if (this.couponApplied && this.couponCode) {
					params.coupon_code = this.couponCode.trim()
				}
				await purchaseDomain(params)
				uni.hideLoading()
				uni.showToast({ title: '购买成功', icon: 'success' })
				setTimeout(() => {
					uni.navigateTo({ url: '/pages/domain/list' })
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

/* 页面头部 */
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

/* 步骤指示器 */
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

.step-item.active {
	opacity: 1;
}

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

.step-item.done .step-dot {
	background: #00b894;
}

.step-label {
	font-size: 22rpx;
	color: #8e8e93;
}

.step-item.active .step-label {
	color: #1a1a2e;
	font-weight: 500;
}

.step-line {
	width: 60rpx;
	height: 4rpx;
	background: #e0e0e0;
	margin: 0 16rpx;
	margin-bottom: 28rpx;
}

.step-line.active {
	background: #00b894;
}

/* 区块样式 */
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

/* 域名网格 */
.domain-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.domain-card {
	width: calc(50% - 8rpx);
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 24rpx;
	border: 2rpx solid transparent;
	position: relative;
	box-sizing: border-box;
}

.domain-card.active {
	border-color: #4C84FF;
	background: rgba(76, 132, 255, 0.05);
}

.domain-check {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	width: 36rpx;
	height: 36rpx;
	background: #4C84FF;
	border-radius: 50%;
	color: #fff;
	font-size: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.domain-suffix {
	display: block;
	font-size: 32rpx;
	font-weight: 700;
	color: #4C84FF;
	margin-bottom: 8rpx;
}

.domain-full {
	display: block;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.domain-count {
	font-size: 22rpx;
	color: #8e8e93;
}

/* 套餐列表 */
.plan-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.plan-card {
	display: flex;
	align-items: flex-start;
	padding: 24rpx;
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
}

.plan-card.active .plan-radio {
	border-color: #4C84FF;
}

.radio-inner {
	width: 22rpx;
	height: 22rpx;
	background: #4C84FF;
	border-radius: 50%;
}

.plan-content {
	flex: 1;
}

.plan-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.plan-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.plan-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff6b00;
}

.plan-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.plan-tag {
	font-size: 22rpx;
	color: #666;
	background: #fff;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
}

/* 域名输入 */
.domain-input-card {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 24rpx;
}

.input-row {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 12rpx;
	border: 2rpx solid #e0e0e0;
}

.subdomain-input {
	flex: 1;
	height: 88rpx;
	padding: 0 24rpx;
	font-size: 30rpx;
	font-weight: 500;
}

.domain-suffix-box {
	padding: 0 24rpx;
	height: 88rpx;
	background: #f0f0f0;
	border-radius: 0 10rpx 10rpx 0;
	display: flex;
	align-items: center;
}

.domain-suffix {
	font-size: 28rpx;
	color: #666;
	font-weight: 500;
}

.preview-row {
	display: flex;
	align-items: center;
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx dashed #e0e0e0;
}

.preview-label {
	font-size: 24rpx;
	color: #8e8e93;
	margin-right: 12rpx;
}

.preview-domain {
	font-size: 28rpx;
	color: #4C84FF;
	font-weight: 600;
}

/* 优惠码输入 */
.section-optional {
	font-size: 22rpx;
	color: #8e8e93;
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

.coupon-btn.cancel {
	background: #f0f2f5;
}

.coupon-btn.cancel text {
	color: #666;
}

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

.price-original {
	display: block;
	font-size: 22rpx;
	color: #8e8e93;
	text-decoration: line-through;
	margin-top: 4rpx;
}

/* 底部栏 */
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

.footer-left {
	flex: 1;
}

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
