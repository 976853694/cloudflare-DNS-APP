<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">系统公告</text>
			<text class="header-count">共 {{ announcements.length }} 条</text>
		</view>
		
		<!-- 公告列表 -->
		<view class="announcement-list">
			<view 
				class="announcement-card" 
				v-for="item in announcements" 
				:key="item.id"
				:class="{ unread: !item.is_read }"
				@click="showDetail(item)"
			>
				<view class="card-header">
					<view class="title-row">
						<view class="unread-dot" v-if="!item.is_read"></view>
						<text class="card-title">{{ item.title }}</text>
					</view>
					<view class="important-tag" v-if="item.is_important">🔥 重要</view>
				</view>
				<text class="card-content">{{ item.content }}</text>
				<view class="card-footer">
					<text class="card-time">{{ formatDate(item.created_at) }}</text>
					<text class="card-arrow">›</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="announcements.length === 0 && !loading">
				<text class="empty-icon">📢</text>
				<text class="empty-text">暂无公告</text>
			</view>
		</view>
		
		<!-- 公告详情弹窗 -->
		<view class="modal" v-if="showModal" @click.self="showModal = false">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">{{ currentAnnouncement.title }}</text>
					<text class="important-tag" v-if="currentAnnouncement.is_important">重要</text>
				</view>
				<scroll-view class="modal-body" scroll-y>
					<text class="modal-text">{{ currentAnnouncement.content }}</text>
				</scroll-view>
				<view class="modal-footer">
					<text class="modal-time">{{ formatDate(currentAnnouncement.created_at) }}</text>
					<view class="modal-close" @click="showModal = false">
						<text class="close-text">关闭</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getAnnouncements, markAnnouncementRead } from '@/api/announcement'
import { isLoggedIn } from '@/utils/storage'

export default {
	data() {
		return {
			announcements: [],
			loading: true,
			showModal: false,
			currentAnnouncement: {}
		}
	},
	onLoad() {
		this.loadData()
	},
	methods: {
		async loadData() {
			this.loading = true
			try {
				const res = await getAnnouncements()
				this.announcements = res.data?.announcements || []
			} catch (e) {
				console.error('加载公告失败', e)
			} finally {
				this.loading = false
			}
		},
		async showDetail(item) {
			this.currentAnnouncement = item
			this.showModal = true
			
			// 标记已读
			if (isLoggedIn() && !item.is_read) {
				try {
					await markAnnouncementRead(item.id)
					// 更新本地状态
					item.is_read = true
				} catch (e) {}
			}
		},
		formatDate(dateStr) {
			if (!dateStr) return ''
			const date = new Date(dateStr)
			const y = date.getFullYear()
			const m = String(date.getMonth() + 1).padStart(2, '0')
			const d = String(date.getDate()).padStart(2, '0')
			const h = String(date.getHours()).padStart(2, '0')
			const min = String(date.getMinutes()).padStart(2, '0')
			return `${y}-${m}-${d} ${h}:${min}`
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

.announcement-card.unread {
	border-left: 6rpx solid #4C84FF;
}

.card-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.title-row {
	display: flex;
	align-items: center;
	flex: 1;
}

.unread-dot {
	width: 12rpx;
	height: 12rpx;
	background: #4C84FF;
	border-radius: 50%;
	margin-right: 12rpx;
	flex-shrink: 0;
}

.card-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
	flex: 1;
}

.important-tag {
	font-size: 20rpx;
	color: #ff6b6b;
	background: rgba(255,107,107,0.1);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	margin-left: 12rpx;
}

.card-content {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	margin-bottom: 16rpx;
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
	max-height: 80vh;
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.modal-header {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	display: flex;
	align-items: center;
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a2e;
	flex: 1;
}

.modal-body {
	flex: 1;
	padding: 30rpx;
	max-height: 60vh;
}

.modal-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.8;
}

.modal-footer {
	padding: 24rpx 30rpx;
	border-top: 1rpx solid #f0f0f0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-time {
	font-size: 22rpx;
	color: #8e8e93;
}

.modal-close {
	padding: 16rpx 48rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 30rpx;
}

.close-text {
	font-size: 28rpx;
	color: #fff;
}
</style>
