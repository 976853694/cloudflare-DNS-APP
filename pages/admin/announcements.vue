<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">公告管理</text>
			<text class="header-count">共 {{ announcements.length }} 条</text>
		</view>
		
		<!-- 公告列表 -->
		<view class="announcement-list">
			<view class="announcement-card" v-for="item in announcements" :key="item.id" @click="editAnnouncement(item)">
				<view class="card-header">
					<text class="card-title">{{ item.title }}</text>
					<view class="tag-row">
						<view class="important-tag" v-if="item.is_important">🔥 重要</view>
						<view class="status-tag" :class="{ disabled: item.status === 0 }">
							{{ item.status === 1 ? '已发布' : '已下架' }}
						</view>
					</view>
				</view>
				<text class="card-content">{{ item.content }}</text>
				<view class="card-footer">
					<text class="card-time">{{ formatTime(item.created_at) }}</text>
					<text class="card-arrow">›</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="announcements.length === 0">
				<text class="empty-icon">📢</text>
				<text class="empty-text">暂无公告</text>
			</view>
		</view>
		
		<!-- 添加按钮 -->
		<view class="fab" @click="showAdd">
			<text class="fab-icon">+</text>
		</view>
		
		<!-- 编辑弹窗 -->
		<view class="modal" v-if="showModal" @click.self="showModal = false">
			<view class="modal-content">
				<text class="modal-title">{{ isEdit ? '编辑公告' : '添加公告' }}</text>
				
				<view class="form-item column">
					<text class="label">标题</text>
					<input class="input-full" v-model="form.title" placeholder="输入标题" />
				</view>
				
				<view class="form-item column">
					<text class="label">内容</text>
					<textarea class="textarea" v-model="form.content" placeholder="输入内容" />
				</view>
				
				<view class="form-item">
					<text class="label">重要公告</text>
					<switch :checked="form.is_important" @change="e => form.is_important = e.detail.value" />
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
import { getAdminAnnouncements, createAdminAnnouncement, updateAdminAnnouncement, deleteAdminAnnouncement } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			announcements: [],
			showModal: false,
			isEdit: false,
			currentId: null,
			userInfo: null,
			form: {
				title: '',
				content: '',
				is_important: false,
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
		this.loadAnnouncements()
	},
	methods: {
		async loadAnnouncements() {
			try {
				const res = await getAdminAnnouncements()
				this.announcements = res.data?.announcements || []
			} catch (e) {
				// 接口可能未实现
			}
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
			this.form = { title: '', content: '', is_important: false, status: 1 }
			this.showModal = true
		},
		editAnnouncement(item) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			this.isEdit = true
			this.currentId = item.id
			this.form = {
				title: item.title,
				content: item.content,
				is_important: item.is_important,
				status: item.status
			}
			this.showModal = true
		},
		async handleSave() {
			if (!this.form.title || !this.form.content) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '保存中...' })
				if (this.isEdit) {
					await updateAdminAnnouncement(this.currentId, this.form)
				} else {
					await createAdminAnnouncement(this.form)
				}
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showModal = false
				this.loadAnnouncements()
			} catch (e) {
				uni.hideLoading()
			}
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条公告吗？',
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteAdminAnnouncement(this.currentId)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.showModal = false
							this.loadAnnouncements()
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

.announcement-list {
	padding: 0 30rpx;
	margin-top: -40rpx;
	position: relative;
	z-index: 2;
}

.announcement-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.card-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
	flex: 1;
}

.tag-row {
	display: flex;
	gap: 8rpx;
}

.important-tag {
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

.card-content {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 16rpx;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
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
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-content {
	width: 85%;
	background: #fff;
	border-radius: 16rpx;
	padding: 40rpx;
	max-height: 80vh;
	overflow-y: auto;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #333;
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
	color: #333;
	margin-bottom: 12rpx;
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
	height: 200rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
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
