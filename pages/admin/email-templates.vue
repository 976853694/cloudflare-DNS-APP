<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">邮件模板管理</text>
			<text class="header-subtitle">自定义系统邮件内容</text>
		</view>
		
		<view class="content">
			<!-- 模板列表 -->
			<view class="template-list">
				<view class="template-card" v-for="item in templates" :key="item.code" @click="editTemplate(item)">
					<view class="template-header">
						<text class="template-name">{{ item.name }}</text>
						<view class="template-status" :class="item.status === 1 ? 'enabled' : 'disabled'">
							<text>{{ item.status === 1 ? '启用' : '禁用' }}</text>
						</view>
					</view>
					<view class="template-info">
						<text class="template-code">{{ item.code }}</text>
						<text class="template-default" v-if="item.is_default">默认模板</text>
					</view>
					<view class="template-subject">
						<text class="subject-label">主题：</text>
						<text class="subject-text">{{ item.subject }}</text>
					</view>
					<view class="template-actions">
						<view class="action-btn edit" @click.stop="editTemplate(item)">
							<text>编辑</text>
						</view>
						<view class="action-btn test" @click.stop="sendTest(item.code)">
							<text>测试</text>
						</view>
						<view class="action-btn reset" @click.stop="resetTemplate(item.code)" v-if="!item.is_default">
							<text>重置</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="templates.length === 0 && !loading">
				<text class="empty-icon">📧</text>
				<text class="empty-text">暂无邮件模板</text>
			</view>
		</view>
		
		<!-- 编辑弹窗 -->
		<view class="modal" v-if="showEditModal" @click.self="showEditModal = false">
			<view class="modal-content large">
				<view class="modal-header">
					<text class="modal-title">编辑邮件模板</text>
					<text class="modal-close" @click="showEditModal = false">×</text>
				</view>
				
				<view class="form-section">
					<view class="form-item">
						<text class="form-label">模板名称</text>
						<text class="form-value">{{ editForm.name }}</text>
					</view>
					
					<view class="form-item">
						<text class="form-label">模板代码</text>
						<text class="form-value code">{{ editForm.code }}</text>
					</view>
					
					<view class="form-item">
						<text class="form-label">状态</text>
						<switch :checked="editForm.status === 1" @change="editForm.status = $event.detail.value ? 1 : 0" color="#4C84FF" />
					</view>
					
					<view class="form-item column">
						<text class="form-label">邮件主题</text>
						<input class="form-input" v-model="editForm.subject" placeholder="请输入邮件主题" />
					</view>
					
					<view class="form-item column">
						<text class="form-label">邮件内容 (支持 HTML)</text>
						<textarea class="form-textarea" v-model="editForm.content" placeholder="请输入邮件内容" />
					</view>
					
					<view class="variables-section" v-if="editForm.variables">
						<text class="variables-title">可用变量</text>
						<view class="variables-list">
							<view class="variable-item" v-for="(desc, key) in editForm.variables" :key="key">
								<text class="variable-key">{{ formatVariable(key) }}</text>
								<text class="variable-desc">{{ desc }}</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="modal-footer">
					<view class="footer-btn preview" @click="previewTemplate">
						<text>预览</text>
					</view>
					<view class="footer-btn cancel" @click="showEditModal = false">
						<text>取消</text>
					</view>
					<view class="footer-btn confirm" @click="saveTemplate">
						<text>保存</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 预览弹窗 -->
		<view class="modal" v-if="showPreviewModal" @click.self="showPreviewModal = false">
			<view class="modal-content large">
				<view class="modal-header">
					<text class="modal-title">邮件预览</text>
					<text class="modal-close" @click="showPreviewModal = false">×</text>
				</view>
				<view class="preview-section">
					<view class="preview-subject">
						<text class="preview-label">主题：</text>
						<text class="preview-text">{{ previewData.subject }}</text>
					</view>
					<view class="preview-content">
						<rich-text :nodes="previewData.html"></rich-text>
					</view>
				</view>
				<view class="modal-footer">
					<view class="footer-btn confirm" @click="showPreviewModal = false">
						<text>关闭</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getEmailTemplates, updateEmailTemplate, resetEmailTemplate, previewEmailTemplate, testEmailTemplate } from '@/api/admin'

export default {
	data() {
		return {
			loading: false,
			templates: [],
			showEditModal: false,
			showPreviewModal: false,
			editForm: {
				code: '',
				name: '',
				subject: '',
				content: '',
				status: 1,
				variables: {}
			},
			previewData: {
				subject: '',
				html: ''
			}
		}
	},
	onLoad() {
		this.loadTemplates()
	},
	methods: {
		formatVariable(key) {
			return '{{' + key + '}}'
		},
		
		async loadTemplates() {
			this.loading = true
			uni.showLoading({ title: '加载中...' })
			try {
				const res = await getEmailTemplates()
				this.templates = res.data?.list || []
			} catch (e) {
				console.error('加载模板失败', e)
			}
			uni.hideLoading()
			this.loading = false
		},
		
		editTemplate(item) {
			this.editForm = {
				code: item.code,
				name: item.name,
				subject: item.subject,
				content: item.content,
				status: item.status,
				variables: item.variables || {}
			}
			this.showEditModal = true
		},
		
		async saveTemplate() {
			if (!this.editForm.subject) {
				uni.showToast({ title: '请输入邮件主题', icon: 'none' })
				return
			}
			if (!this.editForm.content) {
				uni.showToast({ title: '请输入邮件内容', icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '保存中...' })
				await updateEmailTemplate(this.editForm.code, {
					subject: this.editForm.subject,
					content: this.editForm.content,
					status: this.editForm.status
				})
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showEditModal = false
				this.loadTemplates()
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		async previewTemplate() {
			if (!this.editForm.subject || !this.editForm.content) {
				uni.showToast({ title: '请先填写主题和内容', icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '生成预览...' })
				const res = await previewEmailTemplate(this.editForm.code, {
					subject: this.editForm.subject,
					content: this.editForm.content
				})
				uni.hideLoading()
				this.previewData = {
					subject: res.data?.subject || '',
					html: res.data?.html || ''
				}
				this.showPreviewModal = true
			} catch (e) {
				uni.hideLoading()
			}
		},
		
		async sendTest(code) {
			uni.showModal({
				title: '发送测试邮件',
				content: '将发送测试邮件到管理员邮箱，确定继续？',
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '发送中...' })
							await testEmailTemplate(code)
							uni.hideLoading()
							uni.showToast({ title: '测试邮件已发送', icon: 'success' })
						} catch (e) {
							uni.hideLoading()
						}
					}
				}
			})
		},
		
		resetTemplate(code) {
			uni.showModal({
				title: '重置模板',
				content: '确定要重置为默认模板吗？自定义内容将丢失。',
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '重置中...' })
							await resetEmailTemplate(code)
							uni.hideLoading()
							uni.showToast({ title: '已重置', icon: 'success' })
							this.loadTemplates()
						} catch (e) {
							uni.hideLoading()
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

.template-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.template-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.template-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.template-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.template-status {
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
}

.template-status.enabled {
	background: rgba(0,184,148,0.1);
	color: #00b894;
}

.template-status.disabled {
	background: rgba(142,142,147,0.1);
	color: #8e8e93;
}

.template-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.template-code {
	font-size: 24rpx;
	color: #8e8e93;
	font-family: monospace;
	background: #f0f2f5;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}

.template-default {
	font-size: 22rpx;
	color: #4C84FF;
	background: rgba(76,132,255,0.1);
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}

.template-subject {
	display: flex;
	margin-bottom: 16rpx;
}

.subject-label {
	font-size: 26rpx;
	color: #8e8e93;
	flex-shrink: 0;
}

.subject-text {
	font-size: 26rpx;
	color: #1a1a2e;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.template-actions {
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

.action-btn.edit {
	background: #4C84FF;
	color: #fff;
}

.action-btn.test {
	background: #00b894;
	color: #fff;
}

.action-btn.reset {
	background: #f0f2f5;
	color: #666;
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
	max-height: 85vh;
	background: #fff;
	border-radius: 24rpx;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.modal-content.large {
	width: 95%;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.modal-close {
	font-size: 40rpx;
	color: #8e8e93;
	padding: 0 10rpx;
}

.form-section {
	flex: 1;
	overflow-y: auto;
	padding: 24rpx 30rpx;
}

.form-item {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.form-item.column {
	flex-direction: column;
	align-items: flex-start;
}

.form-label {
	font-size: 28rpx;
	color: #1a1a2e;
	width: 160rpx;
	flex-shrink: 0;
}

.form-item.column .form-label {
	width: auto;
	margin-bottom: 12rpx;
}

.form-value {
	font-size: 28rpx;
	color: #666;
}

.form-value.code {
	font-family: monospace;
	background: #f0f2f5;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}

.form-input {
	width: 100%;
	height: 80rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.form-textarea {
	width: 100%;
	height: 300rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 26rpx;
	box-sizing: border-box;
	font-family: monospace;
}

.variables-section {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-top: 16rpx;
}

.variables-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #1a1a2e;
	display: block;
	margin-bottom: 12rpx;
}

.variables-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.variable-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.variable-key {
	font-size: 24rpx;
	font-family: monospace;
	color: #4C84FF;
	background: rgba(76,132,255,0.1);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}

.variable-desc {
	font-size: 22rpx;
	color: #8e8e93;
}

.modal-footer {
	display: flex;
	gap: 16rpx;
	padding: 24rpx 30rpx;
	border-top: 1rpx solid #f0f0f0;
}

.footer-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 500;
}

.footer-btn.preview {
	background: #f0f2f5;
	color: #4C84FF;
}

.footer-btn.cancel {
	background: #f0f2f5;
	color: #666;
}

.footer-btn.confirm {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}

.preview-section {
	flex: 1;
	overflow-y: auto;
	padding: 24rpx 30rpx;
}

.preview-subject {
	display: flex;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.preview-label {
	font-size: 28rpx;
	color: #8e8e93;
}

.preview-text {
	font-size: 28rpx;
	color: #1a1a2e;
	font-weight: 500;
}

.preview-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.8;
}
</style>
