<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">虚拟主机管理</text>
			<text class="header-subtitle">管理服务器、套餐、主机和订单</text>
		</view>
		
		<!-- 标签页 -->
		<view class="tabs-wrapper">
			<scroll-view scroll-x class="tabs-scroll">
				<view class="tabs">
					<view 
						class="tab-item" 
						:class="{ active: activeTab === 'stats' }"
						@click="switchTab('stats')"
					>
						<text class="tab-icon">📊</text>
						<text class="tab-text">统计</text>
					</view>
					<view 
						class="tab-item" 
						:class="{ active: activeTab === 'servers' }"
						@click="switchTab('servers')"
					>
						<text class="tab-icon">🖥️</text>
						<text class="tab-text">服务器</text>
					</view>
					<view 
						class="tab-item" 
						:class="{ active: activeTab === 'plans' }"
						@click="switchTab('plans')"
					>
						<text class="tab-icon">📦</text>
						<text class="tab-text">套餐</text>
					</view>
					<view 
						class="tab-item" 
						:class="{ active: activeTab === 'instances' }"
						@click="switchTab('instances')"
					>
						<text class="tab-icon">🌐</text>
						<text class="tab-text">主机</text>
					</view>
					<view 
						class="tab-item" 
						:class="{ active: activeTab === 'orders' }"
						@click="switchTab('orders')"
					>
						<text class="tab-icon">📋</text>
						<text class="tab-text">订单</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 统计标签页 -->
		<view class="tab-content" v-if="activeTab === 'stats'">
			<view class="stats-grid">
				<view class="stat-card">
					<view class="stat-icon green">💰</view>
					<view class="stat-info">
						<text class="stat-value">¥{{ stats.total_revenue || 0 }}</text>
						<text class="stat-label">总收入</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon blue">📅</view>
					<view class="stat-info">
						<text class="stat-value">¥{{ stats.month_revenue || 0 }}</text>
						<text class="stat-label">本月收入</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon purple">🌐</view>
					<view class="stat-info">
						<text class="stat-value">{{ stats.total_instances || 0 }}</text>
						<text class="stat-label">总主机数</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon teal">✅</view>
					<view class="stat-info">
						<text class="stat-value">{{ stats.active_instances || 0 }}</text>
						<text class="stat-label">活跃主机</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon orange">⏰</view>
					<view class="stat-info">
						<text class="stat-value">{{ stats.expired_instances || 0 }}</text>
						<text class="stat-label">过期主机</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon cyan">🖥️</view>
					<view class="stat-info">
						<text class="stat-value">{{ stats.total_servers || 0 }}</text>
						<text class="stat-label">服务器总数</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务器标签页 -->
		<view class="tab-content" v-if="activeTab === 'servers'">
			<view class="action-bar">
				<view class="add-btn" @click="showAddServer">
					<text class="add-icon">+</text>
					<text>添加服务器</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="servers.length === 0">
				<text class="empty-icon">🖥️</text>
				<text class="empty-text">暂无服务器</text>
			</view>
			
			<view class="card-list" v-else>
				<view class="server-card" v-for="server in servers" :key="server.id">
					<view class="server-header">
						<view class="server-name">{{ server.name }}</view>
						<view class="server-status" :class="server.status === 1 ? 'active' : 'inactive'">
							{{ server.status === 1 ? '正常' : '停用' }}
						</view>
					</view>
					<view class="server-info">
						<view class="info-row">
							<text class="info-label">面板地址</text>
							<text class="info-value">{{ server.panel_url }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">IP地址</text>
							<text class="info-value">{{ server.ip_address || '-' }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">站点数</text>
							<text class="info-value">{{ server.current_sites || 0 }} / {{ server.max_sites || 100 }}</text>
						</view>
					</view>
					<view class="server-actions">
						<view class="action-btn test" @click="testServer(server)">测试连接</view>
						<view class="action-btn edit" @click="editServer(server)">编辑</view>
						<view class="action-btn delete" @click="deleteServer(server)">删除</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 套餐标签页 -->
		<view class="tab-content" v-if="activeTab === 'plans'">
			<view class="action-bar">
				<view class="add-btn" @click="showAddPlan">
					<text class="add-icon">+</text>
					<text>创建套餐</text>
				</view>
			</view>
			
			<view class="empty-state" v-if="plans.length === 0">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无套餐</text>
			</view>
			
			<view class="card-list" v-else>
				<view class="plan-card" v-for="plan in plans" :key="plan.id">
					<view class="plan-header">
						<view class="plan-name">{{ plan.name }}</view>
						<view class="plan-price">¥{{ plan.price || 0 }}</view>
					</view>
					<view class="plan-desc" v-if="plan.description">{{ plan.description }}</view>
					<view class="plan-specs">
						<view class="spec-item">
							<text class="spec-label">磁盘</text>
							<text class="spec-value">{{ plan.disk_space || 0 }}MB</text>
						</view>
						<view class="spec-item">
							<text class="spec-label">流量</text>
							<text class="spec-value">{{ plan.bandwidth || 0 }}GB/月</text>
						</view>
						<view class="spec-item">
							<text class="spec-label">域名</text>
							<text class="spec-value">{{ plan.max_domains || 1 }}个</text>
						</view>
						<view class="spec-item">
							<text class="spec-label">数据库</text>
							<text class="spec-value">{{ plan.max_databases || 1 }}个</text>
						</view>
						<view class="spec-item">
							<text class="spec-label">FTP</text>
							<text class="spec-value">{{ plan.max_ftp || 1 }}个</text>
						</view>
						<view class="spec-item">
							<text class="spec-label">有效期</text>
							<text class="spec-value">{{ plan.duration_days === -1 ? '永久' : plan.duration_days + '天' }}</text>
						</view>
					</view>
					<view class="plan-actions">
						<view class="action-btn edit" @click="editPlan(plan)">编辑</view>
						<view class="action-btn delete" @click="deletePlan(plan)">删除</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 主机标签页 -->
		<view class="tab-content" v-if="activeTab === 'instances'">
			<!-- 筛选栏 -->
			<view class="filter-bar">
				<input class="filter-input" v-model="instanceFilters.domain" placeholder="搜索域名" @confirm="loadInstances" />
				<picker mode="selector" :range="serverOptions" range-key="name" @change="onServerFilterChange">
					<view class="filter-picker">{{ selectedServerName || '全部服务器' }}</view>
				</picker>
				<picker mode="selector" :range="statusOptions" range-key="name" @change="onStatusFilterChange">
					<view class="filter-picker">{{ selectedStatusName || '全部状态' }}</view>
				</picker>
			</view>
			
			<!-- 批量操作 -->
			<view class="batch-bar" v-if="selectedInstances.length > 0">
				<text class="batch-text">已选 {{ selectedInstances.length }} 项</text>
				<view class="batch-btn delete" @click="batchDeleteInstances">批量删除</view>
			</view>
			
			<view class="empty-state" v-if="instances.length === 0">
				<text class="empty-icon">🌐</text>
				<text class="empty-text">暂无主机</text>
			</view>
			
			<view class="card-list" v-else>
				<view class="instance-card" v-for="instance in instances" :key="instance.id">
					<view class="instance-checkbox" @click="toggleInstanceSelect(instance)">
						<view class="checkbox" :class="{ checked: selectedInstances.includes(instance.id) }">
							<text v-if="selectedInstances.includes(instance.id)">✓</text>
						</view>
					</view>
					<view class="instance-content">
						<view class="instance-header">
							<view class="instance-domain">{{ instance.domain }}</view>
							<view class="instance-status" :class="getStatusClass(instance.status)">
								{{ instance.status_name || getStatusName(instance.status) }}
							</view>
						</view>
						<view class="instance-info">
							<view class="info-item">
								<text class="info-label">用户</text>
								<text class="info-value">{{ instance.user?.username || instance.user_id }}</text>
							</view>
							<view class="info-item">
								<text class="info-label">服务器</text>
								<text class="info-value">{{ instance.server?.name || '-' }}</text>
							</view>
							<view class="info-item">
								<text class="info-label">套餐</text>
								<text class="info-value">{{ instance.plan?.name || '-' }}</text>
							</view>
							<view class="info-item">
								<text class="info-label">到期时间</text>
								<text class="info-value">{{ formatDate(instance.expires_at) }}</text>
							</view>
						</view>
						<view class="instance-actions">
							<view class="action-btn" :class="instance.status === 1 ? 'warning' : 'success'" @click="toggleInstanceStatus(instance)">
								{{ instance.status === 1 ? '暂停' : '恢复' }}
							</view>
							<view class="action-btn edit" @click="showExpiryModal(instance)">修改到期</view>
							<view class="action-btn delete" @click="deleteInstance(instance)">删除</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 分页 -->
			<view class="pagination" v-if="instanceTotal > instancePageSize">
				<view class="page-btn" :class="{ disabled: instancePage <= 1 }" @click="prevInstancePage">上一页</view>
				<text class="page-info">{{ instancePage }} / {{ Math.ceil(instanceTotal / instancePageSize) }}</text>
				<view class="page-btn" :class="{ disabled: instancePage >= Math.ceil(instanceTotal / instancePageSize) }" @click="nextInstancePage">下一页</view>
			</view>
		</view>

		<!-- 订单标签页 -->
		<view class="tab-content" v-if="activeTab === 'orders'">
			<!-- 筛选栏 -->
			<view class="filter-bar">
				<input class="filter-input" v-model="orderFilters.user_id" placeholder="用户ID" @confirm="loadOrders" />
				<picker mode="selector" :range="orderTypeOptions" range-key="name" @change="onOrderTypeFilterChange">
					<view class="filter-picker">{{ selectedOrderTypeName || '全部类型' }}</view>
				</picker>
			</view>
			
			<!-- 批量操作 -->
			<view class="batch-bar" v-if="selectedOrders.length > 0">
				<text class="batch-text">已选 {{ selectedOrders.length }} 项</text>
				<view class="batch-btn delete" @click="batchDeleteOrders">批量删除</view>
			</view>
			
			<view class="empty-state" v-if="orders.length === 0">
				<text class="empty-icon">📋</text>
				<text class="empty-text">暂无订单</text>
			</view>
			
			<view class="card-list" v-else>
				<view class="order-card" v-for="order in orders" :key="order.id">
					<view class="order-checkbox" @click="toggleOrderSelect(order)">
						<view class="checkbox" :class="{ checked: selectedOrders.includes(order.id) }">
							<text v-if="selectedOrders.includes(order.id)">✓</text>
						</view>
					</view>
					<view class="order-content">
						<view class="order-header">
							<view class="order-type" :class="order.order_type">
								{{ order.order_type === 'new' ? '新购' : '续费' }}
							</view>
							<view class="order-amount">¥{{ order.amount || 0 }}</view>
						</view>
						<view class="order-info">
							<view class="info-item">
								<text class="info-label">用户</text>
								<text class="info-value">{{ order.user?.username || order.user_id }}</text>
							</view>
							<view class="info-item">
								<text class="info-label">时间</text>
								<text class="info-value">{{ formatDate(order.created_at) }}</text>
							</view>
						</view>
						<view class="order-actions">
							<view class="action-btn delete" @click="deleteOrder(order)">删除</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 分页 -->
			<view class="pagination" v-if="orderTotal > orderPageSize">
				<view class="page-btn" :class="{ disabled: orderPage <= 1 }" @click="prevOrderPage">上一页</view>
				<text class="page-info">{{ orderPage }} / {{ Math.ceil(orderTotal / orderPageSize) }}</text>
				<view class="page-btn" :class="{ disabled: orderPage >= Math.ceil(orderTotal / orderPageSize) }" @click="nextOrderPage">下一页</view>
			</view>
		</view>

		<!-- 服务器弹窗 -->
		<view class="modal" v-if="showServerModal" @click.self="showServerModal = false">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">{{ serverForm.id ? '编辑服务器' : '添加服务器' }}</text>
					<text class="modal-close" @click="showServerModal = false">×</text>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="form-label">服务器名称 *</text>
						<input class="form-input" v-model="serverForm.name" placeholder="请输入服务器名称" />
					</view>
					<view class="form-item">
						<text class="form-label">面板地址 *</text>
						<input class="form-input" v-model="serverForm.panel_url" placeholder="如: https://bt.example.com:8888" />
					</view>
					<view class="form-item">
						<text class="form-label">API密钥 *</text>
						<input class="form-input" v-model="serverForm.api_key" placeholder="宝塔面板API密钥" :password="!showApiKey" />
						<text class="toggle-password" @click="showApiKey = !showApiKey">{{ showApiKey ? '隐藏' : '显示' }}</text>
					</view>
					<view class="form-item">
						<text class="form-label">服务器IP</text>
						<input class="form-input" v-model="serverForm.ip_address" placeholder="可选" />
					</view>
					<view class="form-item">
						<text class="form-label">最大站点数</text>
						<input class="form-input" type="number" v-model="serverForm.max_sites" placeholder="默认100" />
					</view>
					<view class="form-item">
						<text class="form-label">状态</text>
						<switch :checked="serverForm.status === 1" @change="serverForm.status = $event.detail.value ? 1 : 0" />
					</view>
				</view>
				<view class="modal-footer">
					<view class="modal-btn cancel" @click="showServerModal = false">取消</view>
					<view class="modal-btn confirm" @click="saveServer">保存</view>
				</view>
			</view>
		</view>
		
		<!-- 套餐弹窗 -->
		<view class="modal" v-if="showPlanModal" @click.self="showPlanModal = false">
			<view class="modal-content large">
				<view class="modal-header">
					<text class="modal-title">{{ planForm.id ? '编辑套餐' : '创建套餐' }}</text>
					<text class="modal-close" @click="showPlanModal = false">×</text>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="form-label">套餐名称 *</text>
						<input class="form-input" v-model="planForm.name" placeholder="请输入套餐名称" />
					</view>
					<view class="form-item">
						<text class="form-label">套餐描述</text>
						<textarea class="form-textarea" v-model="planForm.description" placeholder="可选" />
					</view>
					<view class="form-row">
						<view class="form-item half">
							<text class="form-label">磁盘空间(MB)</text>
							<input class="form-input" type="number" v-model="planForm.disk_space" placeholder="0" />
						</view>
						<view class="form-item half">
							<text class="form-label">月流量(GB)</text>
							<input class="form-input" type="number" v-model="planForm.bandwidth" placeholder="0" />
						</view>
					</view>
					<view class="form-row">
						<view class="form-item half">
							<text class="form-label">可绑域名数</text>
							<input class="form-input" type="number" v-model="planForm.max_domains" placeholder="1" />
						</view>
						<view class="form-item half">
							<text class="form-label">数据库数</text>
							<input class="form-input" type="number" v-model="planForm.max_databases" placeholder="1" />
						</view>
					</view>
					<view class="form-row">
						<view class="form-item half">
							<text class="form-label">FTP账号数</text>
							<input class="form-input" type="number" v-model="planForm.max_ftp" placeholder="1" />
						</view>
						<view class="form-item half">
							<text class="form-label">价格(元)</text>
							<input class="form-input" type="digit" v-model="planForm.price" placeholder="0" />
						</view>
					</view>
					<view class="form-row">
						<view class="form-item half">
							<text class="form-label">有效期(天)</text>
							<input class="form-input" type="number" v-model="planForm.duration_days" placeholder="-1为永久" />
						</view>
						<view class="form-item half">
							<text class="form-label">排序</text>
							<input class="form-input" type="number" v-model="planForm.sort_order" placeholder="0" />
						</view>
					</view>
					<view class="form-item">
						<text class="form-label">指定服务器</text>
						<picker mode="selector" :range="serverOptionsWithAll" range-key="name" :value="getServerIndex()" @change="onPlanServerChange">
							<view class="form-picker">{{ getServerName(planForm.server_id) }}</view>
						</picker>
					</view>
					<view class="form-item">
						<text class="form-label">状态</text>
						<switch :checked="planForm.status === 1" @change="planForm.status = $event.detail.value ? 1 : 0" />
					</view>
				</view>
				<view class="modal-footer">
					<view class="modal-btn cancel" @click="showPlanModal = false">取消</view>
					<view class="modal-btn confirm" @click="savePlan">保存</view>
				</view>
			</view>
		</view>
		
		<!-- 修改到期时间弹窗 -->
		<view class="modal" v-if="showExpiryModalFlag" @click.self="showExpiryModalFlag = false">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">修改到期时间</text>
					<text class="modal-close" @click="showExpiryModalFlag = false">×</text>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="form-label">当前到期时间</text>
						<text class="form-value">{{ formatDate(currentInstance.expires_at) }}</text>
					</view>
					<view class="form-item">
						<text class="form-label">新到期时间</text>
						<picker mode="date" :value="expiryDate" @change="expiryDate = $event.detail.value">
							<view class="form-picker">{{ expiryDate || '请选择日期' }}</view>
						</picker>
					</view>
				</view>
				<view class="modal-footer">
					<view class="modal-btn cancel" @click="showExpiryModalFlag = false">取消</view>
					<view class="modal-btn confirm" @click="saveExpiry">保存</view>
				</view>
			</view>
		</view>
		
		<view class="bottom-space"></view>
	</view>
</template>

<script>
import {
	getVHostServers,
	addVHostServer,
	updateVHostServer,
	deleteVHostServer,
	testVHostServer,
	getAdminVHostPlans,
	createVHostPlan,
	updateVHostPlan,
	deleteVHostPlan,
	getAdminVHostInstances,
	updateVHostInstance,
	deleteVHostInstance,
	batchDeleteVHostInstances,
	getAdminVHostOrders,
	deleteVHostOrder,
	batchDeleteVHostOrders,
	getVHostStats
} from '@/api/admin.js'

export default {
	data() {
		return {
			activeTab: 'stats',
			// 统计
			stats: {},
			// 服务器
			servers: [],
			showServerModal: false,
			showApiKey: false,
			serverForm: {
				name: '',
				panel_url: '',
				api_key: '',
				ip_address: '',
				max_sites: 100,
				status: 1
			},
			// 套餐
			plans: [],
			showPlanModal: false,
			planForm: {
				name: '',
				description: '',
				server_id: null,
				disk_space: 0,
				bandwidth: 0,
				max_domains: 1,
				max_databases: 1,
				max_ftp: 1,
				price: 0,
				duration_days: 30,
				sort_order: 0,
				status: 1
			},
			// 主机实例
			instances: [],
			instanceFilters: {
				domain: '',
				server_id: null,
				status: null
			},
			selectedInstances: [],
			instancePage: 1,
			instancePageSize: 10,
			instanceTotal: 0,
			// 修改到期时间
			showExpiryModalFlag: false,
			currentInstance: {},
			expiryDate: '',
			// 订单
			orders: [],
			orderFilters: {
				user_id: '',
				order_type: ''
			},
			selectedOrders: [],
			orderPage: 1,
			orderPageSize: 10,
			orderTotal: 0,
			// 筛选选项
			statusOptions: [
				{ name: '全部状态', value: null },
				{ name: '正常', value: 1 },
				{ name: '已暂停', value: 2 },
				{ name: '已过期', value: 3 }
			],
			orderTypeOptions: [
				{ name: '全部类型', value: '' },
				{ name: '新购', value: 'new' },
				{ name: '续费', value: 'renew' }
			]
		}
	},
	computed: {
		serverOptions() {
			return [{ name: '全部服务器', value: null }, ...this.servers.map(s => ({ name: s.name, value: s.id }))]
		},
		serverOptionsWithAll() {
			return [{ name: '不指定', value: null }, ...this.servers.map(s => ({ name: s.name, value: s.id }))]
		},
		selectedServerName() {
			if (!this.instanceFilters.server_id) return ''
			const server = this.servers.find(s => s.id === this.instanceFilters.server_id)
			return server ? server.name : ''
		},
		selectedStatusName() {
			if (this.instanceFilters.status === null) return ''
			const status = this.statusOptions.find(s => s.value === this.instanceFilters.status)
			return status ? status.name : ''
		},
		selectedOrderTypeName() {
			if (!this.orderFilters.order_type) return ''
			const type = this.orderTypeOptions.find(t => t.value === this.orderFilters.order_type)
			return type ? type.name : ''
		}
	},
	onLoad() {
		this.loadStats()
	},
	methods: {
		switchTab(tab) {
			this.activeTab = tab
			if (tab === 'stats') this.loadStats()
			else if (tab === 'servers') this.loadServers()
			else if (tab === 'plans') this.loadPlans()
			else if (tab === 'instances') this.loadInstances()
			else if (tab === 'orders') this.loadOrders()
		},
		
		// ========== 统计 ==========
		async loadStats() {
			try {
				uni.showLoading({ title: '加载中' })
				const res = await getVHostStats()
				this.stats = res.data || {}
			} catch (e) {
				console.error(e)
			} finally {
				uni.hideLoading()
			}
		},
		
		// ========== 服务器管理 ==========
		async loadServers() {
			try {
				uni.showLoading({ title: '加载中' })
				const res = await getVHostServers()
				this.servers = res.data || []
			} catch (e) {
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		showAddServer() {
			this.serverForm = { name: '', panel_url: '', api_key: '', ip_address: '', max_sites: 100, status: 1 }
			this.showServerModal = true
		},
		editServer(server) {
			this.serverForm = { ...server }
			this.showServerModal = true
		},
		async saveServer() {
			if (!this.serverForm.name || !this.serverForm.panel_url || !this.serverForm.api_key) {
				return uni.showToast({ title: '请填写必填项', icon: 'none' })
			}
			try {
				uni.showLoading({ title: '保存中' })
				if (this.serverForm.id) {
					await updateVHostServer(this.serverForm.id, this.serverForm)
				} else {
					await addVHostServer(this.serverForm)
				}
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showServerModal = false
				this.loadServers()
			} catch (e) {
				uni.showToast({ title: e.message || '保存失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		async testServer(server) {
			try {
				uni.showLoading({ title: '测试中' })
				await testVHostServer(server.id)
				uni.showToast({ title: '连接成功', icon: 'success' })
			} catch (e) {
				uni.showToast({ title: e.message || '连接失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		deleteServer(server) {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除服务器"${server.name}"吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '删除中' })
							await deleteVHostServer(server.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.loadServers()
						} catch (e) {
							uni.showToast({ title: e.message || '删除失败', icon: 'none' })
						} finally {
							uni.hideLoading()
						}
					}
				}
			})
		},

		// ========== 套餐管理 ==========
		async loadPlans() {
			try {
				uni.showLoading({ title: '加载中' })
				const res = await getAdminVHostPlans()
				this.plans = res.data || []
			} catch (e) {
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		showAddPlan() {
			this.planForm = {
				name: '', description: '', server_id: null, disk_space: 0, bandwidth: 0,
				max_domains: 1, max_databases: 1, max_ftp: 1, price: 0, duration_days: 30, sort_order: 0, status: 1
			}
			this.showPlanModal = true
		},
		editPlan(plan) {
			this.planForm = { ...plan }
			this.showPlanModal = true
		},
		async savePlan() {
			if (!this.planForm.name) {
				return uni.showToast({ title: '请填写套餐名称', icon: 'none' })
			}
			try {
				uni.showLoading({ title: '保存中' })
				if (this.planForm.id) {
					await updateVHostPlan(this.planForm.id, this.planForm)
				} else {
					await createVHostPlan(this.planForm)
				}
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showPlanModal = false
				this.loadPlans()
			} catch (e) {
				uni.showToast({ title: e.message || '保存失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		deletePlan(plan) {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除套餐"${plan.name}"吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '删除中' })
							await deleteVHostPlan(plan.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.loadPlans()
						} catch (e) {
							uni.showToast({ title: e.message || '删除失败', icon: 'none' })
						} finally {
							uni.hideLoading()
						}
					}
				}
			})
		},
		getServerIndex() {
			if (!this.planForm.server_id) return 0
			const idx = this.servers.findIndex(s => s.id === this.planForm.server_id)
			return idx >= 0 ? idx + 1 : 0
		},
		getServerName(serverId) {
			if (!serverId) return '不指定'
			const server = this.servers.find(s => s.id === serverId)
			return server ? server.name : '不指定'
		},
		onPlanServerChange(e) {
			const idx = e.detail.value
			this.planForm.server_id = idx === 0 ? null : this.servers[idx - 1].id
		},
		
		// ========== 主机实例管理 ==========
		async loadInstances() {
			try {
				uni.showLoading({ title: '加载中' })
				const params = {
					page: this.instancePage,
					per_page: this.instancePageSize
				}
				if (this.instanceFilters.domain) params.domain = this.instanceFilters.domain
				if (this.instanceFilters.server_id) params.server_id = this.instanceFilters.server_id
				if (this.instanceFilters.status !== null) params.status = this.instanceFilters.status
				const res = await getAdminVHostInstances(params)
				this.instances = res.data?.list || res.data || []
				this.instanceTotal = res.data?.total || this.instances.length
			} catch (e) {
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		onServerFilterChange(e) {
			const idx = e.detail.value
			this.instanceFilters.server_id = idx === 0 ? null : this.servers[idx - 1].id
			this.instancePage = 1
			this.loadInstances()
		},
		onStatusFilterChange(e) {
			this.instanceFilters.status = this.statusOptions[e.detail.value].value
			this.instancePage = 1
			this.loadInstances()
		},
		toggleInstanceSelect(instance) {
			const idx = this.selectedInstances.indexOf(instance.id)
			if (idx >= 0) {
				this.selectedInstances.splice(idx, 1)
			} else {
				this.selectedInstances.push(instance.id)
			}
		},
		async toggleInstanceStatus(instance) {
			const action = instance.status === 1 ? 'suspend' : 'resume'
			const actionText = instance.status === 1 ? '暂停' : '恢复'
			try {
				uni.showLoading({ title: '处理中' })
				await updateVHostInstance(instance.id, { action })
				uni.showToast({ title: `${actionText}成功`, icon: 'success' })
				this.loadInstances()
			} catch (e) {
				uni.showToast({ title: e.message || `${actionText}失败`, icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		showExpiryModal(instance) {
			this.currentInstance = instance
			this.expiryDate = instance.expires_at ? instance.expires_at.split('T')[0] : ''
			this.showExpiryModalFlag = true
		},
		async saveExpiry() {
			if (!this.expiryDate) {
				return uni.showToast({ title: '请选择日期', icon: 'none' })
			}
			try {
				uni.showLoading({ title: '保存中' })
				await updateVHostInstance(this.currentInstance.id, { expires_at: this.expiryDate })
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showExpiryModalFlag = false
				this.loadInstances()
			} catch (e) {
				uni.showToast({ title: e.message || '保存失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		deleteInstance(instance) {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除主机"${instance.domain}"吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '删除中' })
							await deleteVHostInstance(instance.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.loadInstances()
						} catch (e) {
							uni.showToast({ title: e.message || '删除失败', icon: 'none' })
						} finally {
							uni.hideLoading()
						}
					}
				}
			})
		},
		batchDeleteInstances() {
			if (this.selectedInstances.length === 0) return
			uni.showModal({
				title: '确认批量删除',
				content: `确定要删除选中的 ${this.selectedInstances.length} 个主机吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '删除中' })
							await batchDeleteVHostInstances(this.selectedInstances)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.selectedInstances = []
							this.loadInstances()
						} catch (e) {
							uni.showToast({ title: e.message || '删除失败', icon: 'none' })
						} finally {
							uni.hideLoading()
						}
					}
				}
			})
		},
		prevInstancePage() {
			if (this.instancePage > 1) {
				this.instancePage--
				this.loadInstances()
			}
		},
		nextInstancePage() {
			if (this.instancePage < Math.ceil(this.instanceTotal / this.instancePageSize)) {
				this.instancePage++
				this.loadInstances()
			}
		},

		// ========== 订单管理 ==========
		async loadOrders() {
			try {
				uni.showLoading({ title: '加载中' })
				const params = {
					page: this.orderPage,
					per_page: this.orderPageSize
				}
				if (this.orderFilters.user_id) params.user_id = this.orderFilters.user_id
				if (this.orderFilters.order_type) params.order_type = this.orderFilters.order_type
				const res = await getAdminVHostOrders(params)
				this.orders = res.data?.list || res.data || []
				this.orderTotal = res.data?.total || this.orders.length
			} catch (e) {
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		onOrderTypeFilterChange(e) {
			this.orderFilters.order_type = this.orderTypeOptions[e.detail.value].value
			this.orderPage = 1
			this.loadOrders()
		},
		toggleOrderSelect(order) {
			const idx = this.selectedOrders.indexOf(order.id)
			if (idx >= 0) {
				this.selectedOrders.splice(idx, 1)
			} else {
				this.selectedOrders.push(order.id)
			}
		},
		deleteOrder(order) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除该订单吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '删除中' })
							await deleteVHostOrder(order.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.loadOrders()
						} catch (e) {
							uni.showToast({ title: e.message || '删除失败', icon: 'none' })
						} finally {
							uni.hideLoading()
						}
					}
				}
			})
		},
		batchDeleteOrders() {
			if (this.selectedOrders.length === 0) return
			uni.showModal({
				title: '确认批量删除',
				content: `确定要删除选中的 ${this.selectedOrders.length} 个订单吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '删除中' })
							await batchDeleteVHostOrders(this.selectedOrders)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.selectedOrders = []
							this.loadOrders()
						} catch (e) {
							uni.showToast({ title: e.message || '删除失败', icon: 'none' })
						} finally {
							uni.hideLoading()
						}
					}
				}
			})
		},
		prevOrderPage() {
			if (this.orderPage > 1) {
				this.orderPage--
				this.loadOrders()
			}
		},
		nextOrderPage() {
			if (this.orderPage < Math.ceil(this.orderTotal / this.orderPageSize)) {
				this.orderPage++
				this.loadOrders()
			}
		},
		
		// ========== 工具方法 ==========
		getStatusClass(status) {
			const map = { 1: 'active', 2: 'suspended', 3: 'expired' }
			return map[status] || ''
		},
		getStatusName(status) {
			const map = { 1: '正常', 2: '已暂停', 3: '已过期', 0: '已删除' }
			return map[status] || '未知'
		},
		formatDate(dateStr) {
			if (!dateStr) return '-'
			const date = new Date(dateStr)
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #f0f2f5;
}

/* 页面头部 */
.page-header {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	padding: 40rpx 30rpx 30rpx;
}
.header-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
	display: block;
	margin-bottom: 8rpx;
}
.header-subtitle {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.7);
}

/* 标签页 */
.tabs-wrapper {
	background: #fff;
	border-bottom: 1rpx solid #eee;
}
.tabs-scroll {
	white-space: nowrap;
}
.tabs {
	display: flex;
	padding: 0 20rpx;
}
.tab-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 30rpx;
	position: relative;
}
.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 4rpx;
	background: #4C84FF;
	border-radius: 2rpx;
}
.tab-icon {
	font-size: 32rpx;
	margin-bottom: 6rpx;
}
.tab-text {
	font-size: 24rpx;
	color: #666;
}
.tab-item.active .tab-text {
	color: #4C84FF;
	font-weight: 600;
}

/* 标签页内容 */
.tab-content {
	padding: 20rpx 30rpx;
}

/* 统计卡片 */
.stats-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16rpx;
}
.stat-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.stat-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin-right: 16rpx;
}
.stat-icon.green { background: linear-gradient(135deg, #00b894 0%, #55efc4 100%); }
.stat-icon.blue { background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%); }
.stat-icon.purple { background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); }
.stat-icon.teal { background: linear-gradient(135deg, #00cec9 0%, #81ecec 100%); }
.stat-icon.orange { background: linear-gradient(135deg, #e17055 0%, #fab1a0 100%); }
.stat-icon.cyan { background: linear-gradient(135deg, #0984e3 0%, #74b9ff 100%); }
.stat-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.stat-value {
	font-size: 32rpx;
	font-weight: 700;
	color: #1a1a2e;
}
.stat-label {
	font-size: 22rpx;
	color: #8e8e93;
	margin-top: 4rpx;
}

/* 操作栏 */
.action-bar {
	margin-bottom: 20rpx;
}
.add-btn {
	display: inline-flex;
	align-items: center;
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	color: #fff;
	padding: 16rpx 32rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
}
.add-icon {
	font-size: 32rpx;
	margin-right: 8rpx;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 0;
}
.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}
.empty-text {
	font-size: 28rpx;
	color: #8e8e93;
}

/* 卡片列表 */
.card-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

/* 服务器卡片 */
.server-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.server-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}
.server-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1a2e;
}
.server-status {
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}
.server-status.active {
	background: rgba(0, 184, 148, 0.1);
	color: #00b894;
}
.server-status.inactive {
	background: rgba(255, 77, 79, 0.1);
	color: #ff4d4f;
}
.server-info {
	margin-bottom: 16rpx;
}
.info-row {
	display: flex;
	justify-content: space-between;
	padding: 8rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}
.info-row:last-child {
	border-bottom: none;
}
.info-label {
	font-size: 24rpx;
	color: #8e8e93;
}
.info-value {
	font-size: 24rpx;
	color: #1a1a2e;
}
.server-actions {
	display: flex;
	gap: 12rpx;
	margin-top: 16rpx;
}

/* 套餐卡片 */
.plan-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.plan-header {
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
.plan-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff6b00;
}
.plan-desc {
	font-size: 24rpx;
	color: #8e8e93;
	margin-bottom: 16rpx;
}
.plan-specs {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-bottom: 16rpx;
}
.spec-item {
	background: #f8f9fa;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}
.spec-label {
	font-size: 20rpx;
	color: #8e8e93;
	margin-right: 8rpx;
}
.spec-value {
	font-size: 22rpx;
	color: #1a1a2e;
	font-weight: 500;
}
.plan-actions {
	display: flex;
	gap: 12rpx;
}

/* 主机实例卡片 */
.instance-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
	display: flex;
	gap: 16rpx;
}
.instance-checkbox {
	padding-top: 4rpx;
}
.checkbox {
	width: 40rpx;
	height: 40rpx;
	border: 2rpx solid #ddd;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #fff;
}
.checkbox.checked {
	background: #4C84FF;
	border-color: #4C84FF;
}
.instance-content {
	flex: 1;
}
.instance-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}
.instance-domain {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a2e;
}
.instance-status {
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}
.instance-status.active {
	background: rgba(0, 184, 148, 0.1);
	color: #00b894;
}
.instance-status.suspended {
	background: rgba(255, 107, 0, 0.1);
	color: #ff6b00;
}
.instance-status.expired {
	background: rgba(255, 77, 79, 0.1);
	color: #ff4d4f;
}
.instance-info {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-bottom: 16rpx;
}
.info-item {
	display: flex;
	gap: 8rpx;
}
.instance-actions {
	display: flex;
	gap: 12rpx;
}

/* 订单卡片 */
.order-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
	display: flex;
	gap: 16rpx;
}
.order-checkbox {
	padding-top: 4rpx;
}
.order-content {
	flex: 1;
}
.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}
.order-type {
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}
.order-type.new {
	background: rgba(76, 132, 255, 0.1);
	color: #4C84FF;
}
.order-type.renew {
	background: rgba(0, 184, 148, 0.1);
	color: #00b894;
}
.order-amount {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff6b00;
}
.order-info {
	display: flex;
	gap: 24rpx;
	margin-bottom: 16rpx;
}
.order-actions {
	display: flex;
	gap: 12rpx;
}

/* 操作按钮 */
.action-btn {
	font-size: 24rpx;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	background: #f5f5f5;
	color: #666;
}
.action-btn.test {
	background: rgba(76, 132, 255, 0.1);
	color: #4C84FF;
}
.action-btn.edit {
	background: rgba(0, 184, 148, 0.1);
	color: #00b894;
}
.action-btn.delete {
	background: rgba(255, 77, 79, 0.1);
	color: #ff4d4f;
}
.action-btn.warning {
	background: rgba(255, 107, 0, 0.1);
	color: #ff6b00;
}
.action-btn.success {
	background: rgba(0, 184, 148, 0.1);
	color: #00b894;
}

/* 筛选栏 */
.filter-bar {
	display: flex;
	gap: 12rpx;
	margin-bottom: 20rpx;
	flex-wrap: wrap;
}
.filter-input {
	flex: 1;
	min-width: 200rpx;
	background: #fff;
	border-radius: 16rpx;
	padding: 16rpx 20rpx;
	font-size: 26rpx;
}
.filter-picker {
	background: #fff;
	border-radius: 16rpx;
	padding: 16rpx 20rpx;
	font-size: 26rpx;
	color: #666;
}

/* 批量操作栏 */
.batch-bar {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 20rpx;
	padding: 16rpx 20rpx;
	background: rgba(76, 132, 255, 0.1);
	border-radius: 16rpx;
}
.batch-text {
	font-size: 26rpx;
	color: #4C84FF;
}
.batch-btn {
	font-size: 24rpx;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
}
.batch-btn.delete {
	background: #ff4d4f;
	color: #fff;
}

/* 分页 */
.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20rpx;
	margin-top: 30rpx;
	padding: 20rpx 0;
}
.page-btn {
	font-size: 26rpx;
	padding: 12rpx 24rpx;
	background: #fff;
	border-radius: 20rpx;
	color: #4C84FF;
}
.page-btn.disabled {
	color: #ccc;
	pointer-events: none;
}
.page-info {
	font-size: 26rpx;
	color: #666;
}

/* 弹窗 */
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
	z-index: 999;
}
.modal-content {
	background: #fff;
	border-radius: 24rpx;
	width: 90%;
	max-width: 600rpx;
	max-height: 80vh;
	overflow-y: auto;
}
.modal-content.large {
	max-width: 680rpx;
}
.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f5f5f5;
}
.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a2e;
}
.modal-close {
	font-size: 40rpx;
	color: #8e8e93;
	line-height: 1;
}
.modal-body {
	padding: 30rpx;
}
.modal-footer {
	display: flex;
	gap: 20rpx;
	padding: 20rpx 30rpx 30rpx;
}
.modal-btn {
	flex: 1;
	text-align: center;
	padding: 20rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
}
.modal-btn.cancel {
	background: #f5f5f5;
	color: #666;
}
.modal-btn.confirm {
	background: linear-gradient(135deg, #4C84FF 0%, #6A9DFF 100%);
	color: #fff;
}

/* 表单 */
.form-item {
	margin-bottom: 24rpx;
}
.form-item.half {
	flex: 1;
}
.form-row {
	display: flex;
	gap: 20rpx;
}
.form-label {
	display: block;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
}
.form-input {
	width: 100%;
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}
.form-textarea {
	width: 100%;
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 20rpx;
	font-size: 28rpx;
	min-height: 120rpx;
	box-sizing: border-box;
}
.form-picker {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 20rpx;
	font-size: 28rpx;
	color: #1a1a2e;
}
.form-value {
	font-size: 28rpx;
	color: #1a1a2e;
}
.toggle-password {
	font-size: 24rpx;
	color: #4C84FF;
	margin-top: 8rpx;
	display: inline-block;
}

.bottom-space {
	height: 40rpx;
}
</style>
