<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">域名详情</text>
		</view>
		
		<!-- 域名信息卡片 -->
		<view class="info-card">
			<view class="domain-header">
				<text class="domain-icon">🌐</text>
				<text class="domain-name">{{ subdomain.full_name }}</text>
			</view>
			<view class="status-row">
				<view class="status-badge" :class="{ expired: subdomain.is_expired }">
					{{ subdomain.is_expired ? '已过期' : '正常运行' }}
				</view>
				<text class="plan-name">{{ subdomain.plan?.name }}</text>
			</view>
			<view class="info-grid">
				<view class="info-item">
					<text class="info-label">到期时间</text>
					<text class="info-value">{{ formatDate(subdomain.expires_at) }}</text>
				</view>
				<view class="info-item" v-if="!subdomain.is_expired">
					<text class="info-label">剩余天数</text>
					<text class="info-value highlight">{{ subdomain.days_remaining }} 天</text>
				</view>
			</view>
			
			<view class="action-btns">
				<view class="action-btn primary" @click="showRenewModal = true">
					<text class="action-text">续费</text>
				</view>
				<view class="action-btn danger" @click="handleDelete">
					<text class="action-text">删除域名</text>
				</view>
			</view>
		</view>
		
		<!-- DNS记录 -->
		<view class="records-section">
			<view class="section-header">
				<text class="section-title">DNS记录</text>
				<view class="section-badge">{{ records.length }}</view>
				<view class="section-action" @click="showAddRecord = true">
					<text class="action-icon">+</text>
					<text class="action-label">添加</text>
				</view>
			</view>
			
			<view class="record-list">
				<view class="record-card" v-for="record in records" :key="record.id">
					<view class="record-main">
						<view class="record-row">
							<view class="type-badge" :class="record.type.toLowerCase()">{{ record.type }}</view>
							<text class="record-name">{{ record.name }}</text>
						</view>
						<view class="content-box">
							<text class="record-content">{{ record.content }}</text>
						</view>
					</view>
					<view class="record-actions">
						<text class="record-btn edit" @click="editRecord(record)">编辑</text>
						<text class="record-btn delete" @click="deleteRecord(record)">删除</text>
					</view>
				</view>
				
				<view class="empty-state" v-if="records.length === 0">
					<text class="empty-icon">📡</text>
					<text class="empty-text">暂无DNS记录</text>
					<text class="empty-hint">点击上方"添加"按钮创建记录</text>
				</view>
			</view>
		</view>
		
		<!-- 添加记录弹窗 -->
		<view class="modal" v-if="showAddRecord" @click.self="showAddRecord = false">
			<view class="modal-content">
				<text class="modal-title">添加DNS记录</text>
				
				<view class="form-item">
					<text class="label">类型</text>
					<picker :range="recordTypes" @change="onTypeChange">
						<view class="picker">{{ newRecord.type || '请选择' }}</view>
					</picker>
				</view>
				
				<view class="form-item">
					<text class="label">名称</text>
					<input class="input" v-model="newRecord.name" placeholder="@表示根域名" />
				</view>
				
				<view class="form-item">
					<text class="label">记录值</text>
					<input class="input" v-model="newRecord.content" placeholder="请输入记录值" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showAddRecord = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="addRecord">
						<text>确定</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 续费弹窗 -->
		<view class="modal" v-if="showRenewModal" @click.self="showRenewModal = false">
			<view class="modal-content">
				<text class="modal-title">续费</text>
				
				<view class="plan-options">
					<view 
						class="plan-opt" 
						v-for="plan in renewPlans" 
						:key="plan.id"
						:class="{ active: selectedRenewPlan?.id === plan.id }"
						@click="selectedRenewPlan = plan"
					>
						<text class="plan-opt-name">{{ plan.name }}</text>
						<text class="plan-opt-price">¥{{ plan.price }}</text>
						<text class="plan-opt-duration">{{ plan.duration_text }}</text>
					</view>
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showRenewModal = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="handleRenew">
						<text>确定续费</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 编辑记录弹窗 -->
		<view class="modal" v-if="showEditRecord" @click.self="showEditRecord = false">
			<view class="modal-content">
				<text class="modal-title">编辑DNS记录</text>
				
				<view class="form-item">
					<text class="label">类型</text>
					<view class="picker disabled">{{ editingRecord.type }}</view>
				</view>
				
				<view class="form-item">
					<text class="label">名称</text>
					<view class="picker disabled">{{ editingRecord.name }}</view>
				</view>
				
				<view class="form-item">
					<text class="label">记录值</text>
					<input class="input" v-model="editingRecord.content" placeholder="请输入记录值" />
				</view>
				
				<view class="form-item">
					<text class="label">TTL (秒)</text>
					<input class="input" type="number" v-model="editingRecord.ttl" placeholder="300" />
				</view>
				
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showEditRecord = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="saveEditRecord">
						<text>保存</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getSubdomains, getSubdomainDetail, getRenewPlans, renewDomain, deleteSubdomain } from '@/api/domain'
import { getDnsRecords, addDnsRecord, updateDnsRecord, deleteDnsRecord } from '@/api/dns'

export default {
	data() {
		return {
			subdomainId: null,
			subdomain: {},
			records: [],
			renewPlans: [],
			selectedRenewPlan: null,
			showAddRecord: false,
			showEditRecord: false,
			showRenewModal: false,
			recordTypes: ['A', 'AAAA', 'CNAME', 'TXT', 'MX'],
			newRecord: {
				type: 'A',
				name: '@',
				content: ''
			},
			editingRecord: {
				id: null,
				type: '',
				name: '',
				content: '',
				ttl: 300,
				proxied: false
			}
		}
	},
	onLoad(options) {
		this.subdomainId = options.id
		this.loadData()
	},
	methods: {
		async loadData() {
			// 获取域名信息
			try {
				const subRes = await getSubdomainDetail(this.subdomainId)
				this.subdomain = subRes.data?.subdomain || {}
			} catch (e) {
				console.error('获取域名信息失败', e)
			}
			
			// 获取DNS记录（独立请求，失败不影响其他）
			try {
				const recordRes = await getDnsRecords(this.subdomainId)
				this.records = recordRes.data?.records || []
			} catch (e) {
				console.error('获取DNS记录失败', e)
				this.records = []
			}
			
			// 获取续费套餐（独立请求，失败不影响其他）
			try {
				const planRes = await getRenewPlans(this.subdomainId)
				this.renewPlans = planRes.data?.plans || []
			} catch (e) {
				console.error('获取续费套餐失败', e)
				this.renewPlans = []
			}
		},
		formatDate(dateStr) {
			if (!dateStr) return '-'
			return dateStr.split('T')[0]
		},
		onTypeChange(e) {
			this.newRecord.type = this.recordTypes[e.detail.value]
		},
		async addRecord() {
			if (!this.newRecord.content) {
				uni.showToast({ title: '请输入记录值', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '添加中...' })
				await addDnsRecord(this.subdomainId, this.newRecord)
				uni.hideLoading()
				uni.showToast({ title: '添加成功', icon: 'success' })
				this.showAddRecord = false
				this.newRecord = { type: 'A', name: '@', content: '' }
				this.loadData()
			} catch (e) {
				uni.hideLoading()
			}
		},
		editRecord(record) {
			this.editingRecord = {
				id: record.id,
				type: record.type,
				name: record.name,
				content: record.content,
				ttl: record.ttl || 300,
				proxied: record.proxied || false
			}
			this.showEditRecord = true
		},
		async saveEditRecord() {
			if (!this.editingRecord.content) {
				uni.showToast({ title: '请输入记录值', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '保存中...' })
				await updateDnsRecord(this.editingRecord.id, {
					content: this.editingRecord.content,
					ttl: this.editingRecord.ttl,
					proxied: this.editingRecord.proxied
				})
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showEditRecord = false
				this.loadData()
			} catch (e) {
				uni.hideLoading()
			}
		},
		deleteRecord(record) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条DNS记录吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteDnsRecord(record.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.loadData()
						} catch (e) {}
					}
				}
			})
		},
		async handleRenew() {
			if (!this.selectedRenewPlan) {
				uni.showToast({ title: '请选择续费套餐', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '续费中...' })
				await renewDomain(this.subdomainId, this.selectedRenewPlan.id)
				uni.hideLoading()
				uni.showToast({ title: '续费成功', icon: 'success' })
				this.showRenewModal = false
				this.loadData()
			} catch (e) {
				uni.hideLoading()
			}
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: '删除后无法恢复，确定要删除吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteSubdomain(this.subdomainId)
							uni.showToast({ title: '删除成功', icon: 'success' })
							setTimeout(() => uni.navigateBack(), 1500)
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
}

.page-header {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 40rpx 30rpx 70rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.info-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin: -40rpx 30rpx 20rpx;
	position: relative;
	z-index: 2;
	box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
}

.domain-header {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.domain-icon {
	font-size: 40rpx;
}

.domain-name {
	font-size: 32rpx;
	font-weight: 700;
	color: #1a1a2e;
}

.status-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 20rpx;
}

.status-badge {
	font-size: 22rpx;
	color: #00b894;
	background: rgba(0,184,148,0.1);
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}

.status-badge.expired {
	color: #ff4d4f;
	background: rgba(255,77,79,0.1);
}

.plan-name {
	font-size: 24rpx;
	color: #8e8e93;
}

.info-grid {
	display: flex;
	gap: 20rpx;
	margin-bottom: 24rpx;
}

.info-item {
	flex: 1;
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 16rpx;
}

.info-label {
	font-size: 24rpx;
	color: #8e8e93;
	display: block;
	margin-bottom: 8rpx;
}

.info-value {
	font-size: 28rpx;
	color: #1a1a2e;
	font-weight: 600;
}

.info-value.highlight {
	color: #4C84FF;
}

.action-btns {
	display: flex;
	gap: 16rpx;
}

.action-btn {
	flex: 1;
	height: 84rpx;
	border-radius: 42rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.action-btn.primary {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.action-btn.danger {
	background: #fff;
	border: 2rpx solid #ff4d4f;
}

.action-btn .action-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: 500;
}

.action-btn.danger .action-text {
	color: #ff4d4f;
}

.records-section {
	background: #fff;
	border-radius: 24rpx;
	padding: 24rpx;
	margin: 0 30rpx 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.section-badge {
	font-size: 20rpx;
	color: #fff;
	background: #4C84FF;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	margin-left: 12rpx;
}

.section-action {
	display: flex;
	align-items: center;
	gap: 6rpx;
	margin-left: auto;
	padding: 12rpx 20rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 20rpx;
}

.action-icon {
	font-size: 24rpx;
	color: #fff;
}

.action-label {
	font-size: 24rpx;
	color: #fff;
}

.record-card {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 12rpx;
}

.record-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.type-badge {
	font-size: 20rpx;
	font-weight: 600;
	color: #fff;
	background: #8e8e93;
	padding: 6rpx 14rpx;
	border-radius: 8rpx;
}

.type-badge.a { background: #4C84FF; }
.type-badge.aaaa { background: #6c5ce7; }
.type-badge.cname { background: #00b894; }
.type-badge.txt { background: #fdcb6e; color: #1a1a2e; }
.type-badge.mx { background: #e17055; }

.record-name {
	font-size: 26rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.content-box {
	background: #fff;
	padding: 12rpx 16rpx;
	border-radius: 10rpx;
	margin-bottom: 12rpx;
}

.record-content {
	font-size: 24rpx;
	color: #666;
	font-family: monospace;
	word-break: break-all;
}

.record-actions {
	display: flex;
	justify-content: flex-end;
	gap: 16rpx;
}

.record-btn {
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 16rpx;
}

.record-btn.edit {
	color: #4C84FF;
	background: rgba(76,132,255,0.1);
}

.record-btn.delete {
	color: #ff4d4f;
	background: rgba(255,77,79,0.1);
}

.empty-state {
	padding: 60rpx;
	text-align: center;
}

.empty-icon {
	font-size: 60rpx;
	display: block;
	margin-bottom: 16rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #8e8e93;
	display: block;
	margin-bottom: 8rpx;
}

.empty-hint {
	font-size: 24rpx;
	color: #c7c7cc;
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
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1a2e;
	text-align: center;
	margin-bottom: 30rpx;
	display: block;
}

.form-item {
	margin-bottom: 30rpx;
}

.label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 12rpx;
	display: block;
}

.input {
	width: 100%;
	height: 80rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.picker {
	height: 80rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	line-height: 80rpx;
}

.picker.disabled {
	color: #999;
	background: #eee;
}

.plan-options {
	margin-bottom: 30rpx;
}

.plan-opt {
	padding: 24rpx;
	border: 2rpx solid #eee;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
}

.plan-opt.active {
	border-color: #4C84FF;
	background: rgba(76, 132, 255, 0.05);
}

.plan-opt-name {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.plan-opt-price {
	font-size: 32rpx;
	color: #ff6b00;
	font-weight: 600;
	margin-right: 16rpx;
}

.plan-opt-duration {
	font-size: 24rpx;
	color: #999;
}

.modal-btns {
	display: flex;
	gap: 20rpx;
	margin-top: 40rpx;
}

.modal-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.modal-btn.cancel {
	background: #f5f5f5;
	color: #666;
}

.modal-btn.confirm {
	background: #4C84FF;
	color: #fff;
}
</style>
