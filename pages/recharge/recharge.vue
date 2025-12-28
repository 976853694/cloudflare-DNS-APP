<template>
	<view class="page">
		<!-- 余额展示区 -->
		<view class="balance-section">
			<view class="balance-bg"></view>
			<view class="balance-content">
				<text class="balance-label">账户余额</text>
				<view class="balance-row">
					<text class="balance-symbol">¥</text>
					<text class="balance-value">{{ userInfo?.balance?.toFixed(2) || '0.00' }}</text>
				</view>
				<text class="balance-tip">余额可用于购买和续费域名</text>
			</view>
		</view>
		
		<!-- 卡密充值卡片 -->
		<view class="recharge-card">
			<view class="card-header">
				<text class="card-icon">💳</text>
				<text class="card-title">卡密充值</text>
			</view>
			
			<view class="input-section">
				<view class="input-wrapper">
					<text class="input-icon">🔑</text>
					<input 
						class="input" 
						v-model="redeemCode" 
						placeholder="请输入充值卡密"
					/>
				</view>
				<view class="verify-btn" @click="verifyCode">
					<text class="verify-text">验证</text>
				</view>
			</view>
			
			<view class="code-result" v-if="codeValue">
				<view class="result-icon">✓</view>
				<view class="result-info">
					<text class="result-label">卡密金额</text>
					<text class="result-value">{{ codeValue }}</text>
				</view>
			</view>
			
			<view class="submit-btn" :class="{ disabled: !codeVerified }" @click="handleRedeem">
				<text class="submit-text">{{ codeVerified ? '确认充值' : '请先验证卡密' }}</text>
			</view>
		</view>
		
		<!-- 充值说明 -->
		<view class="tips-card">
			<view class="tips-header">
				<text class="tips-icon">📋</text>
				<text class="tips-title">充值说明</text>
			</view>
			<view class="tips-list">
				<view class="tip-item">
					<text class="tip-num">1</text>
					<text class="tip-text">请输入正确的卡密进行充值</text>
				</view>
				<view class="tip-item">
					<text class="tip-num">2</text>
					<text class="tip-text">每张卡密只能使用一次</text>
				</view>
				<view class="tip-item">
					<text class="tip-num">3</text>
					<text class="tip-text">充值成功后余额立即到账</text>
				</view>
				<view class="tip-item">
					<text class="tip-num">4</text>
					<text class="tip-text">如有问题请联系客服处理</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getUserInfo } from '@/api/auth'
import { verifyRedeemCode, redeemCode as useRedeemCodeApi } from '@/api/redeem'
import { setUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			userInfo: null,
			redeemCode: '',
			codeValue: '',
			codeVerified: false
		}
	},
	onShow() {
		this.loadUserInfo()
	},
	methods: {
		async loadUserInfo() {
			try {
				const res = await getUserInfo()
				this.userInfo = res.data
				setUserInfo(res.data)
			} catch (e) {
				console.error('获取用户信息失败', e)
			}
		},
		async verifyCode() {
			if (!this.redeemCode) {
				uni.showToast({ title: '请输入卡密', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '验证中...' })
				const res = await verifyRedeemCode({ code: this.redeemCode })
				uni.hideLoading()
				this.codeValue = res.data?.value_text || ''
				this.codeVerified = true
				uni.showToast({ title: '卡密有效', icon: 'success' })
			} catch (e) {
				uni.hideLoading()
				this.codeVerified = false
				this.codeValue = ''
			}
		},
		async handleRedeem() {
			if (!this.codeVerified) {
				uni.showToast({ title: '请先验证卡密', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '充值中...' })
				const res = await useRedeemCodeApi({ code: this.redeemCode })
				uni.hideLoading()
				
				uni.showToast({ title: '充值成功', icon: 'success' })
				
				// 更新余额显示
				this.userInfo.balance = res.data?.balance
				this.userInfo.balance_text = res.data?.balance_text
				setUserInfo(this.userInfo)
				
				// 重置表单
				this.redeemCode = ''
				this.codeValue = ''
				this.codeVerified = false
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

/* 余额展示区 */
.balance-section {
	position: relative;
	padding: 60rpx 30rpx 80rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.balance-bg {
	position: absolute;
	top: 0;
	right: 0;
	width: 300rpx;
	height: 300rpx;
	background: radial-gradient(circle, rgba(76, 132, 255, 0.2) 0%, transparent 70%);
}

.balance-content {
	position: relative;
	z-index: 1;
	text-align: center;
}

.balance-label {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.7);
	display: block;
	margin-bottom: 16rpx;
}

.balance-row {
	display: flex;
	align-items: baseline;
	justify-content: center;
	margin-bottom: 16rpx;
}

.balance-symbol {
	font-size: 36rpx;
	color: #fff;
	font-weight: 600;
	margin-right: 8rpx;
}

.balance-value {
	font-size: 72rpx;
	color: #fff;
	font-weight: 700;
}

.balance-tip {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.5);
}

/* 充值卡片 */
.recharge-card {
	margin: -40rpx 30rpx 20rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
	position: relative;
	z-index: 2;
}

.card-header {
	display: flex;
	align-items: center;
	margin-bottom: 28rpx;
}

.card-icon {
	font-size: 40rpx;
	margin-right: 16rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.input-section {
	display: flex;
	gap: 16rpx;
	margin-bottom: 24rpx;
}

.input-wrapper {
	flex: 1;
	display: flex;
	align-items: center;
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 0 20rpx;
	border: 2rpx solid transparent;
}

.input-wrapper:focus-within {
	border-color: #4C84FF;
	background: #fff;
}

.input-icon {
	font-size: 28rpx;
	margin-right: 12rpx;
}

.input {
	flex: 1;
	height: 88rpx;
	font-size: 28rpx;
	color: #333;
	background: transparent;
}

.verify-btn {
	width: 140rpx;
	height: 88rpx;
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.verify-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: 500;
}

.code-result {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
	border-radius: 16rpx;
	margin-bottom: 24rpx;
}

.result-icon {
	width: 48rpx;
	height: 48rpx;
	background: #00b894;
	border-radius: 50%;
	color: #fff;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.result-info {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.result-label {
	font-size: 28rpx;
	color: #2e7d32;
}

.result-value {
	font-size: 36rpx;
	color: #ff6b00;
	font-weight: 700;
}

.submit-btn {
	height: 92rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(26, 26, 46, 0.3);
}

.submit-btn.disabled {
	background: #e0e0e0;
	box-shadow: none;
}

.submit-text {
	font-size: 30rpx;
	color: #fff;
	font-weight: 600;
}

.submit-btn.disabled .submit-text {
	color: #999;
}

/* 充值说明 */
.tips-card {
	margin: 0 30rpx 30rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.tips-header {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.tips-icon {
	font-size: 32rpx;
	margin-right: 12rpx;
}

.tips-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.tips-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.tip-item {
	display: flex;
	align-items: flex-start;
}

.tip-num {
	width: 36rpx;
	height: 36rpx;
	background: #f0f2f5;
	border-radius: 50%;
	font-size: 22rpx;
	color: #666;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.tip-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}
</style>
