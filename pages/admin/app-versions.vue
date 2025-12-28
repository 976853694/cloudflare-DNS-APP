<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">APP版本管理</text>
			<text class="header-count">共 {{ versions.length }} 个版本</text>
		</view>
		
		<!-- 平台筛选 -->
		<view class="filter-section">
			<view class="filter-tabs">
				<view class="filter-tab" :class="{ active: currentPlatform === '' }" @click="filterPlatform('')">
					<text>全部</text>
				</view>
				<view class="filter-tab" :class="{ active: currentPlatform === 'android' }" @click="filterPlatform('android')">
					<text>🤖 Android</text>
				</view>
				<view class="filter-tab" :class="{ active: currentPlatform === 'ios' }" @click="filterPlatform('ios')">
					<text>🍎 iOS</text>
				</view>
			</view>
		</view>
		
		<!-- 版本列表 -->
		<view class="version-list">
			<view class="version-card" v-for="item in versions" :key="item.id" @click="editVersion(item)">
				<view class="card-header">
					<view class="platform-badge" :class="item.platform">
						<text>{{ item.platform === 'android' ? '🤖' : '🍎' }}</text>
						<text>{{ item.platform === 'android' ? 'Android' : 'iOS' }}</text>
					</view>
					<view class="tag-row">
						<view class="force-tag" v-if="item.force_update">强制更新</view>
						<view class="status-tag" :class="{ disabled: item.status === 0 }">
							{{ item.status === 1 ? '已发布' : '已禁用' }}
						</view>
					</view>
				</view>
				
				<view class="version-info">
					<view class="version-main">
						<text class="version-number">v{{ item.version }}</text>
						<text class="build-number">Build {{ item.build }}</text>
					</view>
					<view class="version-meta">
						<text class="meta-item" v-if="item.file_size">📦 {{ item.file_size }}</text>
						<text class="meta-item">📥 {{ item.download_count || 0 }} 次下载</text>
					</view>
				</view>
				
				<view class="update-log" v-if="item.update_log">
					<text class="log-text">{{ item.update_log }}</text>
				</view>
				
				<view class="card-footer">
					<text class="card-time">{{ formatTime(item.created_at) }}</text>
					<text class="card-arrow">›</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="versions.length === 0">
				<text class="empty-icon">📱</text>
				<text class="empty-text">暂无版本</text>
			</view>
		</view>
		
		<!-- 添加按钮 -->
		<view class="fab" @click="showAdd">
			<text class="fab-icon">+</text>
		</view>
		
		<!-- 编辑弹窗 -->
		<view class="modal" v-if="showModal" @click.self="showModal = false">
			<view class="modal-content">
				<text class="modal-title">{{ isEdit ? '编辑版本' : '添加版本' }}</text>
				
				<view class="form-item column">
					<text class="label">平台 <text class="required">*</text></text>
					<view class="platform-select">
						<view class="platform-option" :class="{ active: form.platform === 'android' }" @click="form.platform = 'android'">
							<text>🤖 Android</text>
						</view>
						<view class="platform-option" :class="{ active: form.platform === 'ios' }" @click="form.platform = 'ios'">
							<text>🍎 iOS</text>
						</view>
					</view>
				</view>
				
				<view class="form-row">
					<view class="form-item column half">
						<text class="label">版本号 <text class="required">*</text></text>
						<input class="input-full" v-model="form.version" placeholder="如 1.0.0" />
					</view>
					<view class="form-item column half">
						<text class="label">构建号 <text class="required">*</text></text>
						<input class="input-full" type="number" v-model="form.build" placeholder="如 1" />
					</view>
				</view>
				
				<view class="form-item column">
					<text class="label">下载地址 <text class="required">*</text></text>
					<input class="input-full" v-model="form.download_url" placeholder="输入下载链接" />
				</view>
				
				<view class="form-item column">
					<text class="label">文件大小</text>
					<input class="input-full" v-model="form.file_size" placeholder="如 15.2 MB" />
				</view>
				
				<view class="form-item column">
					<text class="label">最低支持版本</text>
					<input class="input-full" v-model="form.min_version" placeholder="低于此版本将强制更新" />
				</view>
				
				<view class="form-item column">
					<text class="label">更新日志</text>
					<textarea class="textarea" v-model="form.update_log" placeholder="输入更新内容" />
				</view>
				
				<view class="form-item">
					<text class="label">强制更新</text>
					<switch :checked="form.force_update" @change="e => form.force_update = e.detail.value" />
				</view>
				
				<view class="form-item" v-if="isEdit">
					<text class="label">发布状态</text>
					<switch :checked="form.status === 1" @change="e => form.status = e.detail.value ? 1 : 0" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn danger" v-if="isEdit" @click="handleDelete">
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
import { getAppVersions, createAppVersion, updateAppVersion, deleteAppVersion } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			versions: [],
			currentPlatform: '',
			showModal: false,
			isEdit: false,
			currentId: null,
			userInfo: null,
			form: {
				platform: 'android',
				version: '',
				build: '',
				download_url: '',
				file_size: '',
				update_log: '',
				force_update: false,
				min_version: '',
				status: 1
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
		this.loadVersions()
	},
	methods: {
		async loadVersions() {
			try {
				const params = {}
				if (this.currentPlatform) {
					params.platform = this.currentPlatform
				}
				const res = await getAppVersions(params)
				this.versions = res.data?.versions || []
			} catch (e) {
				console.error('加载版本列表失败', e)
			}
		},
		filterPlatform(platform) {
			this.currentPlatform = platform
			this.loadVersions()
		},
		formatTime(str) {
			if (!str) return ''
			return str.split('T')[0]
		},
		showAdd() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法添加', icon: 'none' })
				return
			}
			this.isEdit = false
			this.currentId = null
			this.form = {
				platform: 'android',
				version: '',
				build: '',
				download_url: '',
				file_size: '',
				update_log: '',
				force_update: false,
				min_version: '',
				status: 1
			}
			this.showModal = true
		},
		editVersion(item) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			this.isEdit = true
			this.currentId = item.id
			this.form = {
				platform: item.platform,
				version: item.version,
				build: String(item.build),
				download_url: item.download_url,
				file_size: item.file_size || '',
				update_log: item.update_log || '',
				force_update: item.force_update || false,
				min_version: item.min_version || '',
				status: item.status
			}
			this.showModal = true
		},
		async handleSave() {
			if (!this.form.platform || !this.form.version || !this.form.build || !this.form.download_url) {
				uni.showToast({ title: '请填写必填项', icon: 'none' })
				return
			}
			
			// 验证版本号格式：支持 1、1.0、1.0.0、0.01 等格式
			if (!/^\d+(\.\d+)*$/.test(this.form.version)) {
				uni.showToast({ title: '版本号格式错误', icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '保存中...' })
				const data = {
					...this.form,
					build: parseInt(this.form.build)
				}
				
				if (this.isEdit) {
					await updateAppVersion(this.currentId, data)
				} else {
					await createAppVersion(data)
				}
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showModal = false
				this.loadVersions()
			} catch (e) {
				uni.hideLoading()
				console.error('保存失败', e)
			}
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个版本吗？',
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteAppVersion(this.currentId)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.showModal = false
							this.loadVersions()
						} catch (e) {
							console.error('删除失败', e)
						}
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

/* 筛选区域 */
.filter-section {
	padding: 0 30rpx;
	margin-top: -30rpx;
	position: relative;
	z-index: 3;
}

.filter-tabs {
	background: #fff;
	border-radius: 16rpx;
	padding: 8rpx;
	display: flex;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.filter-tab {
	flex: 1;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #666;
	border-radius: 12rpx;
	transition: all 0.3s;
}

.filter-tab.active {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}

/* 版本列表 */
.version-list {
	padding: 20rpx 30rpx 0;
}

.version-card {
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

.platform-badge {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	font-weight: 500;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}

.platform-badge.android {
	background: rgba(61, 220, 132, 0.1);
	color: #3ddc84;
}

.platform-badge.ios {
	background: rgba(0, 122, 255, 0.1);
	color: #007aff;
}

.tag-row {
	display: flex;
	gap: 8rpx;
}

.force-tag {
	font-size: 20rpx;
	color: #ff6b6b;
	background: rgba(255,107,107,0.1);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}

.status-tag {
	font-size: 20rpx;
	color: #00b894;
	background: rgba(0,184,148,0.1);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}

.status-tag.disabled {
	color: #8e8e93;
	background: #f0f2f5;
}

.version-info {
	margin-bottom: 12rpx;
}

.version-main {
	display: flex;
	align-items: baseline;
	gap: 12rpx;
	margin-bottom: 8rpx;
}

.version-number {
	font-size: 36rpx;
	font-weight: 700;
	color: #1a1a2e;
}

.build-number {
	font-size: 24rpx;
	color: #8e8e93;
}

.version-meta {
	display: flex;
	gap: 20rpx;
}

.meta-item {
	font-size: 24rpx;
	color: #666;
}

.update-log {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 16rpx;
	margin-bottom: 12rpx;
}

.log-text {
	font-size: 24rpx;
	color: #666;
	line-height: 1.6;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 12rpx;
	border-top: 1rpx solid #f0f2f5;
}

.card-time {
	font-size: 22rpx;
	color: #8e8e93;
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

/* FAB按钮 */
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

/* 弹窗样式 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-content {
	width: 90%;
	background: #fff;
	border-radius: 16rpx;
	padding: 40rpx;
	max-height: 85vh;
	overflow-y: auto;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #333;
	text-align: center;
	margin-bottom: 30rpx;
}

.form-row {
	display: flex;
	gap: 20rpx;
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

.form-item.half {
	flex: 1;
}

.label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 12rpx;
}

.required {
	color: #ff4d4f;
}

.input-full {
	width: 100%;
	height: 72rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
}

.textarea {
	width: 100%;
	height: 160rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
}

.platform-select {
	display: flex;
	gap: 16rpx;
	width: 100%;
}

.platform-option {
	flex: 1;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f5f5f5;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #666;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.platform-option.active {
	background: rgba(26, 26, 46, 0.1);
	border-color: #1a1a2e;
	color: #1a1a2e;
}

.modal-btns {
	display: flex;
	gap: 20rpx;
	margin-top: 30rpx;
}

.modal-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
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
