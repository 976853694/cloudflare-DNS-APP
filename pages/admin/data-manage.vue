<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">数据管理</text>
			<text class="header-subtitle">导入导出系统数据</text>
		</view>
		
		<view class="content">
			<!-- 数据导出 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">📤 数据导出</text>
				</view>
				<view class="section-body">
					<view class="export-item" @click="handleExportUsers">
						<view class="export-icon">👥</view>
						<view class="export-info">
							<text class="export-name">导出用户数据</text>
							<text class="export-desc">导出所有用户信息为 CSV 格式</text>
						</view>
						<text class="export-arrow">›</text>
					</view>
					<view class="export-item" @click="handleExportSubdomains">
						<view class="export-icon">🔗</view>
						<view class="export-info">
							<text class="export-name">导出二级域名</text>
							<text class="export-desc">导出所有二级域名数据为 CSV 格式</text>
						</view>
						<text class="export-arrow">›</text>
					</view>
					<view class="export-item" @click="handleExportRedeemCodes">
						<view class="export-icon">🎫</view>
						<view class="export-info">
							<text class="export-name">导出卡密</text>
							<text class="export-desc">导出卡密数据为 CSV 格式</text>
						</view>
						<text class="export-arrow">›</text>
					</view>
				</view>
			</view>
			
			<!-- 数据导入 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">📥 数据导入</text>
				</view>
				<view class="section-body">
					<view class="export-item" @click="showImportUsers">
						<view class="export-icon">👥</view>
						<view class="export-info">
							<text class="export-name">导入用户数据</text>
							<text class="export-desc">从 CSV 批量导入用户</text>
						</view>
						<text class="export-arrow">›</text>
					</view>
					<view class="export-item" @click="showImportRedeemCodes">
						<view class="export-icon">🎫</view>
						<view class="export-info">
							<text class="export-name">导入卡密</text>
							<text class="export-desc">从 CSV 批量导入卡密</text>
						</view>
						<text class="export-arrow">›</text>
					</view>
				</view>
			</view>
			
			<!-- 格式说明 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">📋 CSV 格式说明</text>
				</view>
				<view class="section-body">
					<view class="format-item">
						<text class="format-title">用户导入格式</text>
						<text class="format-code">username,email,password,max_domains</text>
						<text class="format-example">示例: user1,user1@example.com,123456,10</text>
					</view>
					<view class="format-item">
						<text class="format-title">卡密导入格式</text>
						<text class="format-code">code,amount,expires_days</text>
						<text class="format-example">示例: ABC123,100,30</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 导入用户弹窗 -->
		<view class="modal" v-if="showUserModal" @click.self="showUserModal = false">
			<view class="modal-content">
				<text class="modal-title">导入用户</text>
				<view class="form-item column">
					<text class="label">CSV 数据</text>
					<textarea class="textarea" v-model="importUserData" placeholder="username,email,password,max_domains&#10;user1,user1@example.com,123456,10" />
				</view>
				<view class="form-item">
					<text class="label">默认密码（可选）</text>
					<input class="input" v-model="defaultPassword" placeholder="未设置密码时使用" />
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showUserModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="handleImportUsers">
						<text>导入</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 导入卡密弹窗 -->
		<view class="modal" v-if="showRedeemModal" @click.self="showRedeemModal = false">
			<view class="modal-content">
				<text class="modal-title">导入卡密</text>
				<view class="form-item column">
					<text class="label">CSV 数据</text>
					<textarea class="textarea" v-model="importRedeemData" placeholder="code,amount,expires_days&#10;ABC123,100,30" />
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showRedeemModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="handleImportRedeemCodes">
						<text>导入</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { exportUsers, exportSubdomains, exportRedeemCodes, importUsers, importRedeemCodes } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			userInfo: null,
			showUserModal: false,
			showRedeemModal: false,
			importUserData: '',
			importRedeemData: '',
			defaultPassword: ''
		}
	},
	computed: {
		isDemo() {
			return this.userInfo?.role === 'demo'
		}
	},
	onLoad() {
		this.userInfo = getStoredUserInfo()
	},
	methods: {
		async handleExportUsers() {
			try {
				uni.showLoading({ title: '导出中...' })
				const res = await exportUsers()
				uni.hideLoading()
				this.downloadCsv(res.data?.csv || res.data, 'users.csv')
			} catch (e) {
				uni.hideLoading()
			}
		},
		async handleExportSubdomains() {
			try {
				uni.showLoading({ title: '导出中...' })
				const res = await exportSubdomains()
				uni.hideLoading()
				this.downloadCsv(res.data?.csv || res.data, 'subdomains.csv')
			} catch (e) {
				uni.hideLoading()
			}
		},
		async handleExportRedeemCodes() {
			try {
				uni.showLoading({ title: '导出中...' })
				const res = await exportRedeemCodes()
				uni.hideLoading()
				this.downloadCsv(res.data?.csv || res.data, 'redeem-codes.csv')
			} catch (e) {
				uni.hideLoading()
			}
		},
		downloadCsv(content, filename) {
			// #ifdef H5
			const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
			const link = document.createElement('a')
			link.href = URL.createObjectURL(blob)
			link.download = filename
			link.click()
			uni.showToast({ title: '导出成功', icon: 'success' })
			// #endif
			// #ifndef H5
			uni.setClipboardData({
				data: content,
				success: () => {
					uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
				}
			})
			// #endif
		},
		showImportUsers() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法导入', icon: 'none' })
				return
			}
			this.importUserData = ''
			this.defaultPassword = ''
			this.showUserModal = true
		},
		showImportRedeemCodes() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法导入', icon: 'none' })
				return
			}
			this.importRedeemData = ''
			this.showRedeemModal = true
		},
		async handleImportUsers() {
			if (!this.importUserData.trim()) {
				uni.showToast({ title: '请输入 CSV 数据', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '导入中...' })
				const res = await importUsers({
					csv_content: this.importUserData,
					default_password: this.defaultPassword || '123456'
				})
				uni.hideLoading()
				const count = res.data?.imported_count || 0
				uni.showToast({ title: `成功导入 ${count} 条`, icon: 'success' })
				this.showUserModal = false
			} catch (e) {
				uni.hideLoading()
			}
		},
		async handleImportRedeemCodes() {
			if (!this.importRedeemData.trim()) {
				uni.showToast({ title: '请输入 CSV 数据', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '导入中...' })
				const res = await importRedeemCodes({
					csv_content: this.importRedeemData
				})
				uni.hideLoading()
				const count = res.data?.imported_count || 0
				uni.showToast({ title: `成功导入 ${count} 条`, icon: 'success' })
				this.showRedeemModal = false
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

.section {
	background: #fff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.section-header {
	padding: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.section-body {
	padding: 0;
}

.export-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.export-item:last-child {
	border-bottom: none;
}

.export-icon {
	width: 72rpx;
	height: 72rpx;
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin-right: 20rpx;
}

.export-info {
	flex: 1;
}

.export-name {
	font-size: 30rpx;
	font-weight: 500;
	color: #1a1a2e;
	display: block;
	margin-bottom: 6rpx;
}

.export-desc {
	font-size: 24rpx;
	color: #8e8e93;
}

.export-arrow {
	font-size: 36rpx;
	color: #c7c7cc;
}

.format-item {
	padding: 20rpx 24rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.format-item:last-child {
	border-bottom: none;
}

.format-title {
	font-size: 28rpx;
	font-weight: 500;
	color: #1a1a2e;
	display: block;
	margin-bottom: 12rpx;
}

.format-code {
	font-size: 24rpx;
	color: #4C84FF;
	background: #f0f4ff;
	padding: 12rpx 16rpx;
	border-radius: 8rpx;
	font-family: monospace;
	display: block;
	margin-bottom: 8rpx;
}

.format-example {
	font-size: 22rpx;
	color: #8e8e93;
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
	width: 90%;
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
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.form-item.column {
	flex-direction: column;
	align-items: flex-start;
}

.label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.input {
	flex: 1;
	height: 72rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
}

.textarea {
	width: 100%;
	height: 240rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 26rpx;
	font-family: monospace;
	box-sizing: border-box;
}

.modal-btns {
	display: flex;
	gap: 20rpx;
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
