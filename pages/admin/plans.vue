<template>
	<view class="page">
		<view class="page-header">
			<text class="header-title">套餐管理</text>
			<text class="header-count">共 {{ plans.length }} 个</text>
		</view>
		
		<view class="filter-section">
			<view class="filter-bar">
				<picker :range="domainOptions" range-key="name" @change="onDomainFilter">
					<view class="filter-picker">
						<text class="picker-text">{{ filterDomain?.name || '全部域名' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
		</view>
		
		<view class="plan-list">
			<view class="plan-card" v-for="plan in plans" :key="plan.id" @click="editPlan(plan)">
				<view class="card-header">
					<view class="plan-title">
						<text class="plan-name">{{ plan.name }}</text>
						<view class="plan-badge" :class="{ disabled: plan.status === 0 }">
							{{ plan.status === 1 ? '启用' : '禁用' }}
						</view>
					</view>
					<text class="plan-price">¥{{ plan.price }}</text>
				</view>
				<view class="domain-tags">
					<view class="domain-tag" v-for="(name, idx) in getDomainList(plan)" :key="idx">{{ name }}</view>
				</view>
				<view class="plan-specs">
					<view class="spec-item">
						<text class="spec-label">时长</text>
						<text class="spec-value">{{ plan.duration_text }}</text>
					</view>
					<view class="spec-item">
						<text class="spec-label">长度</text>
						<text class="spec-value">{{ plan.min_length }}-{{ plan.max_length }}</text>
					</view>
					<view class="spec-item">
						<text class="spec-label">记录</text>
						<text class="spec-value">{{ plan.max_records_text }}</text>
					</view>
				</view>
			</view>
			<view class="empty-state" v-if="plans.length === 0">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无套餐</text>
			</view>
		</view>
		
		<view class="fab" @click="openAddModal"><text class="fab-icon">+</text></view>
		
		<!-- 添加弹窗 -->
		<view class="modal" v-if="showAddModal" @click.self="showAddModal = false">
			<view class="modal-content">
				<view class="modal-scroll">
					<text class="modal-title">添加套餐</text>
					<view class="form-item"><text class="label">套餐名称</text><input class="input" v-model="newPlan.name" placeholder="输入名称" /></view>
					<view class="form-item"><text class="label">价格</text><input class="input" type="digit" v-model="newPlan.price" placeholder="0" /></view>
					<view class="form-item"><text class="label">有效天数</text><input class="input" type="number" v-model="newPlan.duration_days" placeholder="-1为永久" /></view>
					<view class="form-item"><text class="label">最小长度</text><input class="input" type="number" v-model="newPlan.min_length" placeholder="1" /></view>
					<view class="form-item"><text class="label">最大长度</text><input class="input" type="number" v-model="newPlan.max_length" placeholder="63" /></view>
					<view class="form-item"><text class="label">最大记录数</text><input class="input" type="number" v-model="newPlan.max_records" placeholder="-1为无限" /></view>
					<view class="form-item column">
						<text class="label">关联域名（可多选）</text>
						<view class="checkbox-group" v-if="domains.length > 0">
							<view class="checkbox-item" v-for="d in domains" :key="d.id" @click="toggleNewDomain(d.id)">
								<view class="checkbox" :class="{ checked: isDomainChecked(d.id, newPlan.domain_ids) }">✓</view>
								<text>{{ d.name }}</text>
							</view>
						</view>
						<view class="empty-tip" v-else>
							<text>暂无可选域名</text>
						</view>
					</view>
					<view class="modal-btns">
						<view class="modal-btn cancel" @click="showAddModal = false"><text>取消</text></view>
						<view class="modal-btn confirm" @click="handleAdd"><text>添加</text></view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 编辑弹窗 -->
		<view class="modal" v-if="showEditModal" @click.self="showEditModal = false">
			<view class="modal-content">
				<view class="modal-scroll">
					<text class="modal-title">编辑套餐</text>
					<view class="form-item"><text class="label">套餐名称</text><input class="input" v-model="editData.name" placeholder="输入名称" /></view>
					<view class="form-item"><text class="label">价格</text><input class="input" type="digit" v-model="editData.price" placeholder="0" /></view>
					<view class="form-item"><text class="label">有效天数</text><input class="input" type="number" v-model="editData.duration_days" placeholder="-1为永久" /></view>
					<view class="form-item"><text class="label">最小长度</text><input class="input" type="number" v-model="editData.min_length" placeholder="1" /></view>
					<view class="form-item"><text class="label">最大长度</text><input class="input" type="number" v-model="editData.max_length" placeholder="63" /></view>
					<view class="form-item"><text class="label">最大记录数</text><input class="input" type="number" v-model="editData.max_records" placeholder="-1为无限" /></view>
					<view class="form-item column">
						<text class="label">关联域名（可多选）</text>
						<view class="checkbox-group" v-if="domains.length > 0">
							<view class="checkbox-item" v-for="d in domains" :key="d.id" @click="toggleEditDomain(d.id)">
								<view class="checkbox" :class="{ checked: isDomainChecked(d.id, editData.domain_ids) }">✓</view>
								<text>{{ d.name }}</text>
							</view>
						</view>
						<view class="empty-tip" v-else>
							<text>暂无可选域名</text>
						</view>
					</view>
					<view class="form-item"><text class="label">状态</text><switch :checked="editData.status === 1" @change="e => editData.status = e.detail.value ? 1 : 0" /></view>
					<view class="modal-btns">
						<view class="modal-btn cancel" @click="showEditModal = false"><text>取消</text></view>
						<view class="modal-btn danger" @click="handleDelete"><text>删除</text></view>
						<view class="modal-btn confirm" @click="handleUpdate"><text>保存</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getAdminPlans, addAdminPlan, updateAdminPlan, deleteAdminPlan, getAdminDomains } from '@/api/admin'
import { getUserInfo as getStoredUserInfo } from '@/utils/storage'

export default {
	data() {
		return {
			plans: [],
			rawPlans: [], // 原始数据，用于编辑时获取所有关联的plan id
			domains: [],
			domainOptions: [{ id: 0, name: '全部域名' }],
			filterDomain: null,
			showAddModal: false,
			showEditModal: false,
			currentPlanIds: [], // 改为数组，存储同名套餐的所有id
			userInfo: null,
			newPlan: { name: '', price: '', duration_days: '30', min_length: '1', max_length: '63', max_records: '10', domain_ids: [] },
			editData: { name: '', price: '', duration_days: '', min_length: '', max_length: '', max_records: '', status: 1, domain_ids: [] }
		}
	},
	computed: {
		isDemo() {
			return this.userInfo?.role === 'demo'
		}
	},
	onLoad() { this.userInfo = getStoredUserInfo(); this.loadDomains(); this.loadPlans() },
	methods: {
		getDomainList(plan) {
			if (plan.domain_names && Array.isArray(plan.domain_names)) return plan.domain_names
			if (plan.domain_name) return [plan.domain_name]
			return []
		},
		// 按套餐名称合并数据
		mergePlansByName(plans) {
			const map = new Map()
			plans.forEach(plan => {
				const key = plan.name
				if (map.has(key)) {
					const existing = map.get(key)
					// 合并域名
					if (plan.domain_name && !existing.domain_names.includes(plan.domain_name)) {
						existing.domain_names.push(plan.domain_name)
					}
					if (plan.domain_id && !existing.domain_ids.includes(plan.domain_id)) {
						existing.domain_ids.push(plan.domain_id)
					}
					// 记录所有关联的plan id
					existing.plan_ids.push(plan.id)
				} else {
					map.set(key, {
						...plan,
						domain_names: plan.domain_name ? [plan.domain_name] : [],
						domain_ids: plan.domain_id ? [plan.domain_id] : [],
						plan_ids: [plan.id]
					})
				}
			})
			return Array.from(map.values())
		},
		async loadDomains() {
			try { const res = await getAdminDomains(); this.domains = res.data?.domains || []; this.domainOptions = [{ id: 0, name: '全部域名' }, ...this.domains] } catch (e) {}
		},
		async loadPlans() {
			try {
				const params = {}
				if (this.filterDomain?.id) params.domain_id = this.filterDomain.id
				const res = await getAdminPlans(params)
				this.rawPlans = res.data?.plans || []
				// 合并同名套餐
				this.plans = this.mergePlansByName(this.rawPlans)
			} catch (e) {}
		},
		onDomainFilter(e) { this.filterDomain = this.domainOptions[e.detail.value]; if (this.filterDomain.id === 0) this.filterDomain = null; this.loadPlans() },
		async openAddModal() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法添加', icon: 'none' })
				return
			}
			// 确保域名列表已加载
			if (this.domains.length === 0) {
				await this.loadDomains()
			}
			this.newPlan = { name: '', price: '', duration_days: '30', min_length: '1', max_length: '63', max_records: '10', domain_ids: [] }
			this.showAddModal = true
		},
		toggleNewDomain(id) {
			const idx = this.newPlan.domain_ids.findIndex(d => d == id)
			if (idx > -1) {
				this.newPlan.domain_ids.splice(idx, 1)
			} else {
				this.newPlan.domain_ids.push(id)
			}
		},
		toggleEditDomain(id) {
			const idx = this.editData.domain_ids.findIndex(d => d == id)
			if (idx > -1) {
				this.editData.domain_ids.splice(idx, 1)
			} else {
				this.editData.domain_ids.push(id)
			}
		},
		isDomainChecked(domainId, list) {
			return list.some(d => d == domainId)
		},
		async handleAdd() {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法添加', icon: 'none' })
				return
			}
			if (!this.newPlan.name) { uni.showToast({ title: '请输入套餐名称', icon: 'none' }); return }
			if (this.newPlan.domain_ids.length === 0) { uni.showToast({ title: '请选择关联域名', icon: 'none' }); return }
			try {
				uni.showLoading({ title: '添加中...' })
				await addAdminPlan({ domain_ids: this.newPlan.domain_ids, name: this.newPlan.name, price: parseFloat(this.newPlan.price) || 0, duration_days: parseInt(this.newPlan.duration_days) || 30, min_length: parseInt(this.newPlan.min_length) || 1, max_length: parseInt(this.newPlan.max_length) || 63, max_records: parseInt(this.newPlan.max_records) || 10 })
				uni.hideLoading(); uni.showToast({ title: '添加成功', icon: 'success' }); this.showAddModal = false; this.loadPlans()
			} catch (e) { uni.hideLoading() }
		},
		async editPlan(plan) {
			if (this.isDemo) {
				uni.showToast({ title: '演示模式下无法编辑', icon: 'none' })
				return
			}
			// 确保域名列表已加载
			if (this.domains.length === 0) {
				await this.loadDomains()
			}
			this.currentPlanIds = plan.plan_ids || [plan.id]
			// 确保 domain_ids 是一个新数组的副本
			const domainIds = plan.domain_ids ? [...plan.domain_ids] : []
			this.editData = {
				name: plan.name,
				price: String(plan.price || 0),
				duration_days: String(plan.duration_days || 30),
				min_length: String(plan.min_length || 1),
				max_length: String(plan.max_length || 63),
				max_records: String(plan.max_records || 10),
				status: plan.status,
				domain_ids: domainIds
			}
			this.showEditModal = true
		},
		async handleUpdate() {
			if (!this.editData.name) { uni.showToast({ title: '请输入套餐名称', icon: 'none' }); return }
			if (this.editData.domain_ids.length === 0) { uni.showToast({ title: '请选择关联域名', icon: 'none' }); return }
			try {
				uni.showLoading({ title: '保存中...' })
				// 使用第一个plan id进行更新
				await updateAdminPlan(this.currentPlanIds[0], { domain_ids: this.editData.domain_ids, name: this.editData.name, price: parseFloat(this.editData.price) || 0, duration_days: parseInt(this.editData.duration_days) || 30, min_length: parseInt(this.editData.min_length) || 1, max_length: parseInt(this.editData.max_length) || 63, max_records: parseInt(this.editData.max_records) || 10, status: this.editData.status })
				uni.hideLoading(); uni.showToast({ title: '保存成功', icon: 'success' }); this.showEditModal = false; this.loadPlans()
			} catch (e) { uni.hideLoading() }
		},
		handleDelete() {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个套餐吗？将删除所有关联域名的套餐记录',
				confirmColor: '#ff4d4f',
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '删除中...' })
							// 删除所有关联的plan
							for (const id of this.currentPlanIds) {
								await deleteAdminPlan(id)
							}
							uni.hideLoading()
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.showEditModal = false
							this.loadPlans()
						} catch (e) { uni.hideLoading() }
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

.filter-picker {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 20rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
}

.picker-text {
	font-size: 26rpx;
	color: #1a1a2e;
	font-weight: 500;
}

.picker-arrow {
	font-size: 20rpx;
	color: #8e8e93;
}

.plan-list {
	padding: 0 30rpx;
}

.plan-card {
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

.plan-title {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.plan-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}

.plan-badge {
	font-size: 22rpx;
	color: #00b894;
	padding: 6rpx 14rpx;
	background: rgba(0,184,148,0.1);
	border-radius: 8rpx;
	font-weight: 500;
}

.plan-badge.disabled {
	color: #8e8e93;
	background: #f0f2f5;
}

.plan-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff6b00;
}

.domain-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	margin-bottom: 16rpx;
}

.domain-tag {
	font-size: 22rpx;
	color: #4c84ff;
	padding: 6rpx 14rpx;
	background: rgba(76,132,255,0.1);
	border-radius: 8rpx;
}

.plan-specs {
	display: flex;
	gap: 20rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f2f5;
}

.spec-item {
	flex: 1;
	text-align: center;
}

.spec-label {
	font-size: 22rpx;
	color: #8e8e93;
	display: block;
	margin-bottom: 6rpx;
}

.spec-value {
	font-size: 26rpx;
	color: #1a1a2e;
	font-weight: 500;
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
}

.modal-scroll {
	max-height: 80vh;
	overflow-y: auto;
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
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.form-item.column {
	flex-direction: column;
	align-items: flex-start;
}

.label {
	font-size: 28rpx;
	color: #8e8e93;
	margin-bottom: 0;
}

.form-item.column .label {
	margin-bottom: 16rpx;
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

.checkbox-group {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.checkbox-item {
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 12rpx 20rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #1a1a2e;
}

.checkbox {
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #ddd;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: transparent;
}

.checkbox.checked {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-color: #1a1a2e;
	color: #fff;
}

.empty-tip {
	padding: 20rpx;
	text-align: center;
	color: #8e8e93;
	font-size: 26rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	width: 100%;
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

.modal-btn.danger {
	background: rgba(255,77,79,0.1);
	color: #ff4d4f;
}
</style>
