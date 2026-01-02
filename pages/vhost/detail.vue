<template>
	<view class="page">
		<!-- 页面头部 -->
		<view class="page-header">
			<text class="header-title">主机详情</text>
			<view class="header-status" :class="getStatusClass(instance.status)">
				<text>{{ instance.status_name || '加载中' }}</text>
			</view>
		</view>
		
		<!-- 主机信息卡片 -->
		<view class="info-card">
			<view class="domain-header">
				<text class="domain-icon">🖥️</text>
				<text class="domain-name">{{ instance.domain }}</text>
			</view>
			<view class="info-row">
				<view class="info-item">
					<text class="info-label">套餐</text>
					<text class="info-value">{{ instance.plan?.name || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">到期时间</text>
					<text class="info-value">{{ formatDate(instance.expires_at) }}</text>
				</view>
			</view>
			<view class="info-row">
				<view class="info-item">
					<text class="info-label">剩余天数</text>
					<text class="info-value" :class="{ warning: instance.days_remaining <= 7 }">
						{{ instance.days_remaining > 0 ? instance.days_remaining + ' 天' : '已过期' }}
					</text>
				</view>
				<view class="info-item">
					<text class="info-label">服务器</text>
					<text class="info-value">{{ instance.server?.name || '-' }}</text>
				</view>
			</view>
			<view class="action-btn" @click="handleRenew">
				<text class="action-text">续费</text>
			</view>
		</view>
		
		<!-- 标签页 -->
		<view class="tabs">
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'info' }"
				@click="activeTab = 'info'"
			>
				<text>基本信息</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'domains' }"
				@click="activeTab = 'domains'"
			>
				<text>域名绑定</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'files' }"
				@click="activeTab = 'files'"
			>
				<text>文件管理</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'settings' }"
				@click="activeTab = 'settings'"
			>
				<text>设置</text>
			</view>
		</view>
		
		<!-- 基本信息 -->
		<view class="tab-content" v-if="activeTab === 'info'">
			<!-- FTP 信息 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">FTP 连接信息</text>
				</view>
				<view class="info-list">
					<view class="info-line">
						<text class="line-label">主机</text>
						<text class="line-value">{{ instance.server?.ip_address || '-' }}</text>
						<text class="copy-btn" @click="copyText(instance.server?.ip_address)">复制</text>
					</view>
					<view class="info-line">
						<text class="line-label">用户名</text>
						<text class="line-value">{{ instance.ftp_user || '-' }}</text>
						<text class="copy-btn" @click="copyText(instance.ftp_user)">复制</text>
					</view>
					<view class="info-line">
						<text class="line-label">密码</text>
						<text class="line-value">{{ showFtpPass ? instance.ftp_pass : '••••••••' }}</text>
						<text class="toggle-btn" @click="showFtpPass = !showFtpPass">{{ showFtpPass ? '隐藏' : '显示' }}</text>
						<text class="copy-btn" @click="copyText(instance.ftp_pass)">复制</text>
					</view>
				</view>
			</view>
			
			<!-- 数据库信息 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">数据库连接信息</text>
				</view>
				<view class="info-list">
					<view class="info-line">
						<text class="line-label">主机</text>
						<text class="line-value">localhost</text>
						<text class="copy-btn" @click="copyText('localhost')">复制</text>
					</view>
					<view class="info-line">
						<text class="line-label">数据库名</text>
						<text class="line-value">{{ instance.db_name || '-' }}</text>
						<text class="copy-btn" @click="copyText(instance.db_name)">复制</text>
					</view>
					<view class="info-line">
						<text class="line-label">用户名</text>
						<text class="line-value">{{ instance.db_user || '-' }}</text>
						<text class="copy-btn" @click="copyText(instance.db_user)">复制</text>
					</view>
					<view class="info-line">
						<text class="line-label">密码</text>
						<text class="line-value">{{ showDbPass ? instance.db_pass : '••••••••' }}</text>
						<text class="toggle-btn" @click="showDbPass = !showDbPass">{{ showDbPass ? '隐藏' : '显示' }}</text>
						<text class="copy-btn" @click="copyText(instance.db_pass)">复制</text>
					</view>
				</view>
			</view>
			

		</view>

		<!-- 域名绑定 -->
		<view class="tab-content" v-if="activeTab === 'domains'">
			<view class="section">
				<view class="section-header">
					<text class="section-title">已绑定域名</text>
					<view class="section-badge">{{ domains.length }}/{{ instance.plan?.max_domains || 0 }}</view>
					<view class="section-action" @click="showAddDomain = true">
						<text class="action-icon">+</text>
						<text class="action-label">添加</text>
					</view>
				</view>
				
				<view class="domain-list">
					<view class="domain-item" v-for="item in domains" :key="item.id">
						<text class="domain-text">{{ item.domain }}</text>
						<text class="delete-btn" @click="deleteDomain(item)">删除</text>
					</view>
				</view>
				
				<view class="empty-state" v-if="domains.length === 0">
					<text class="empty-icon">🌐</text>
					<text class="empty-text">暂无绑定域名</text>
				</view>
			</view>
		</view>
		
		<!-- 文件管理 -->
		<view class="tab-content" v-if="activeTab === 'files'">
			<view class="section">
				<view class="section-header">
					<text class="section-title">文件管理</text>
					<view class="section-action" @click="showFileMenu = true">
						<text class="action-icon">+</text>
						<text class="action-label">新建</text>
					</view>
				</view>
				
				<!-- 面包屑导航 -->
				<view class="breadcrumb">
					<text class="crumb-item" @click="navigateTo('/')">根目录</text>
					<text class="crumb-sep" v-for="(part, index) in pathParts" :key="index">/</text>
					<text 
						class="crumb-item" 
						v-for="(part, index) in pathParts" 
						:key="'p'+index"
						@click="navigateToIndex(index)"
					>{{ part }}</text>
				</view>
				
				<!-- 文件列表 -->
				<view class="file-list">
					<view class="file-item" v-if="currentPath !== '/'" @click="goBack">
						<text class="file-icon">📁</text>
						<text class="file-name">..</text>
					</view>
					<view 
						class="file-item" 
						v-for="file in files" 
						:key="file.path"
						@click="openFile(file)"
						@longpress="showFileActions(file)"
					>
						<text class="file-icon">{{ file.is_dir ? '📁' : '📄' }}</text>
						<view class="file-info">
							<text class="file-name">{{ file.name }}</text>
							<text class="file-meta" v-if="!file.is_dir">{{ formatSize(file.size) }}</text>
						</view>
						<text class="file-more" @click.stop="showFileActions(file)">⋮</text>
					</view>
				</view>
				
				<view class="empty-state" v-if="files.length === 0 && !filesLoading">
					<text class="empty-icon">📂</text>
					<text class="empty-text">空目录</text>
				</view>
			</view>
		</view>
		
		<!-- 设置 -->
		<view class="tab-content" v-if="activeTab === 'settings'">
			<!-- PHP 版本 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">PHP 版本</text>
				</view>
				<view class="setting-row">
					<text class="setting-label">当前版本</text>
					<picker :range="phpVersions" @change="onPhpChange">
						<view class="setting-picker">
							<text>PHP {{ currentPhpVersion || '选择版本' }}</text>
							<text class="picker-arrow">›</text>
						</view>
					</picker>
				</view>
			</view>
			
			<!-- 运行目录 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">运行目录</text>
				</view>
				<view class="setting-row">
					<text class="setting-label">当前目录</text>
					<picker :range="runPathDirs" @change="onRunPathChange">
						<view class="setting-picker">
							<text>{{ runPath || '/' }}</text>
							<text class="picker-arrow">›</text>
						</view>
					</picker>
				</view>
			</view>
			
			<!-- 伪静态 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">伪静态规则</text>
					<view class="section-action" @click="showRewriteModal = true">
						<text class="action-label">编辑</text>
					</view>
				</view>
				<view class="template-list">
					<view 
						class="template-item" 
						v-for="tpl in rewriteTemplates" 
						:key="tpl"
						@click="loadRewriteTemplate(tpl)"
					>
						<text>{{ tpl }}</text>
					</view>
				</view>
			</view>
			
			<!-- SSL 证书 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">SSL 证书</text>
				</view>
				<view class="ssl-status" v-if="sslStatus">
					<view class="ssl-badge" :class="{ active: sslStatus.status }">
						<text>{{ sslStatus.status ? '已部署' : '未部署' }}</text>
					</view>
					<view class="ssl-info" v-if="sslStatus.status && sslStatus.cert_info">
						<text class="ssl-item">颁发者：{{ sslStatus.cert_info.issuer }}</text>
						<text class="ssl-item">有效期：{{ sslStatus.cert_info.notBefore }} ~ {{ sslStatus.cert_info.notAfter }}</text>
					</view>
				</view>
				<view class="ssl-actions">
					<view class="ssl-btn" @click="showSslModal = true">
						<text>{{ sslStatus?.status ? '更换证书' : '部署证书' }}</text>
					</view>
					<view class="ssl-btn danger" v-if="sslStatus?.status" @click="handleCloseSsl">
						<text>关闭SSL</text>
					</view>
				</view>
				<view class="setting-row" v-if="sslStatus?.status">
					<text class="setting-label">强制 HTTPS</text>
					<switch :checked="sslStatus.https_force" @change="toggleForceHttps" />
				</view>
			</view>
		</view>

		<!-- 添加域名弹窗 -->
		<view class="modal" v-if="showAddDomain" @click.self="showAddDomain = false">
			<view class="modal-content">
				<text class="modal-title">添加域名绑定</text>
				<view class="form-item">
					<text class="label">域名</text>
					<input class="input" v-model="newDomain" placeholder="输入要绑定的域名" />
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showAddDomain = false"><text>取消</text></view>
					<view class="modal-btn confirm" @click="addDomain"><text>确定</text></view>
				</view>
			</view>
		</view>
		
		<!-- 文件操作菜单 -->
		<view class="modal" v-if="showFileMenu" @click.self="showFileMenu = false">
			<view class="modal-content menu-content">
				<text class="modal-title">新建</text>
				<view class="menu-item" @click="createNewFile"><text>📄 新建文件</text></view>
				<view class="menu-item" @click="createNewDir"><text>📁 新建目录</text></view>
				<view class="menu-item cancel" @click="showFileMenu = false"><text>取消</text></view>
			</view>
		</view>
		
		<!-- 文件操作弹窗 -->
		<view class="modal" v-if="showFileAction" @click.self="showFileAction = false">
			<view class="modal-content menu-content">
				<text class="modal-title">{{ selectedFile?.name }}</text>
				<view class="menu-item" v-if="!selectedFile?.is_dir" @click="editFile"><text>✏️ 编辑</text></view>
				<view class="menu-item" @click="renameFileAction"><text>📝 重命名</text></view>
				<view class="menu-item" @click="copyFileAction"><text>📋 复制</text></view>
				<view class="menu-item" @click="moveFileAction"><text>📦 移动</text></view>
				<view class="menu-item" @click="zipFileAction"><text>🗜️ 压缩</text></view>
				<view class="menu-item" v-if="selectedFile?.name.endsWith('.zip')" @click="unzipFileAction"><text>📂 解压</text></view>
				<view class="menu-item danger" @click="deleteFileAction"><text>🗑️ 删除</text></view>
				<view class="menu-item cancel" @click="showFileAction = false"><text>取消</text></view>
			</view>
		</view>
		
		<!-- 文件编辑弹窗 -->
		<view class="modal" v-if="showFileEditor" @click.self="showFileEditor = false">
			<view class="modal-content editor-content">
				<text class="modal-title">编辑文件</text>
				<textarea class="editor-textarea" v-model="fileContent" placeholder="文件内容" />
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showFileEditor = false"><text>取消</text></view>
					<view class="modal-btn confirm" @click="saveFileContent"><text>保存</text></view>
				</view>
			</view>
		</view>
		
		<!-- 伪静态编辑弹窗 -->
		<view class="modal" v-if="showRewriteModal" @click.self="showRewriteModal = false">
			<view class="modal-content editor-content">
				<text class="modal-title">伪静态规则</text>
				<textarea class="editor-textarea" v-model="rewriteContent" placeholder="伪静态规则内容" />
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showRewriteModal = false"><text>取消</text></view>
					<view class="modal-btn confirm" @click="saveRewrite"><text>保存</text></view>
				</view>
			</view>
		</view>
		
		<!-- SSL 部署弹窗 -->
		<view class="modal" v-if="showSslModal" @click.self="showSslModal = false">
			<view class="modal-content">
				<text class="modal-title">部署 SSL 证书</text>
				<view class="form-item">
					<text class="label">证书私钥 (KEY)</text>
					<textarea class="textarea" v-model="sslKey" placeholder="-----BEGIN RSA PRIVATE KEY-----" />
				</view>
				<view class="form-item">
					<text class="label">证书内容 (PEM)</text>
					<textarea class="textarea" v-model="sslCsr" placeholder="-----BEGIN CERTIFICATE-----" />
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showSslModal = false"><text>取消</text></view>
					<view class="modal-btn confirm" @click="deploySslCert"><text>部署</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { 
	getVHostInstance, renewVHost,
	getInstanceDomains, addInstanceDomain, deleteInstanceDomain,
	getFiles, readFile, saveFile, createFile, createDir, deleteFile, renameFile, copyFile, moveFile, zipFile, unzipFile,
	getPhpVersions, setPhpVersion,
	getRunPath, setRunPath,
	getRewrite, setRewrite, getRewriteTemplate,
	getSslStatus, deploySsl, closeSsl, setForceHttps
} from '@/api/vhost'

export default {
	data() {
		return {
			instanceId: null,
			instance: {},
			activeTab: 'info',
			showFtpPass: false,
			showDbPass: false,
			// 域名绑定
			domains: [],
			showAddDomain: false,
			newDomain: '',
			// 文件管理
			files: [],
			filesLoading: false,
			currentPath: '/',
			showFileMenu: false,
			showFileAction: false,
			showFileEditor: false,
			selectedFile: null,
			fileContent: '',
			// 设置
			phpVersions: [],
			phpVersionList: null,
			currentPhpVersion: '',
			runPath: '/',
			runPathDirs: [],
			rewriteTemplates: [],
			rewriteContent: '',
			showRewriteModal: false,
			sslStatus: null,
			showSslModal: false,
			sslKey: '',
			sslCsr: ''
		}
	},
	computed: {
		pathParts() {
			if (this.currentPath === '/') return []
			return this.currentPath.split('/').filter(p => p)
		}
	},
	onLoad(options) {
		this.instanceId = options.id
		this.loadInstance()
	},
	methods: {
		async loadInstance() {
			try {
				const res = await getVHostInstance(this.instanceId)
				this.instance = res.data?.instance || {}
			} catch (e) {
				console.error('加载主机详情失败', e)
			}
		},
		getStatusClass(status) {
			return { 1: 'success', 2: 'warning', 3: 'danger' }[status] || ''
		},
		formatDate(dateStr) {
			if (!dateStr) return '-'
			return dateStr.split('T')[0]
		},
		formatSize(bytes) {
			if (bytes < 1024) return bytes + ' B'
			if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
			return (bytes / 1024 / 1024).toFixed(1) + ' MB'
		},
		// 套餐配置辅助方法 - 兼容不同字段名
		getPlanDiskSpace() {
			const plan = this.instance.plan
			if (!plan) return '-'
			// 尝试多种可能的字段名
			if (plan.disk_space_display) return plan.disk_space_display
			if (plan.diskSpaceDisplay) return plan.diskSpaceDisplay
			if (plan.disk_space) {
				// 如果是数字，转换为可读格式
				const size = parseInt(plan.disk_space)
				if (size >= 1024) return (size / 1024).toFixed(0) + ' GB'
				return size + ' MB'
			}
			if (plan.diskSpace) {
				const size = parseInt(plan.diskSpace)
				if (size >= 1024) return (size / 1024).toFixed(0) + ' GB'
				return size + ' MB'
			}
			return '-'
		},
		getPlanBandwidth() {
			const plan = this.instance.plan
			if (!plan) return '-'
			if (plan.bandwidth_display) return plan.bandwidth_display
			if (plan.bandwidthDisplay) return plan.bandwidthDisplay
			if (plan.bandwidth) {
				const size = parseInt(plan.bandwidth)
				if (size >= 1024) return (size / 1024).toFixed(0) + ' GB'
				return size + ' MB'
			}
			if (plan.monthly_bandwidth) {
				const size = parseInt(plan.monthly_bandwidth)
				if (size >= 1024) return (size / 1024).toFixed(0) + ' GB'
				return size + ' MB'
			}
			return '-'
		},
		getPlanMaxDomains() {
			const plan = this.instance.plan
			if (!plan) return '-'
			return plan.max_domains || plan.maxDomains || plan.domains || '-'
		},
		getPlanMaxDatabases() {
			const plan = this.instance.plan
			if (!plan) return '-'
			return plan.max_databases || plan.maxDatabases || plan.databases || '-'
		},
		copyText(text) {
			if (!text) return
			uni.setClipboardData({
				data: text,
				success: () => uni.showToast({ title: '已复制', icon: 'success' })
			})
		},
		async handleRenew() {
			uni.showModal({
				title: '续费确认',
				content: `确定续费该主机吗？将扣除 ¥${this.instance.plan?.price || 0}`,
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({ title: '续费中...' })
							await renewVHost(this.instanceId)
							uni.hideLoading()
							uni.showToast({ title: '续费成功', icon: 'success' })
							this.loadInstance()
						} catch (e) {
							uni.hideLoading()
						}
					}
				}
			})
		},
		// 域名绑定
		async loadDomains() {
			try {
				const res = await getInstanceDomains(this.instanceId)
				this.domains = res.data?.domains || []
			} catch (e) {
				console.error('加载域名列表失败', e)
			}
		},
		async addDomain() {
			if (!this.newDomain.trim()) {
				uni.showToast({ title: '请输入域名', icon: 'none' })
				return
			}
			if (this.domains.length >= (this.instance.plan?.max_domains || 0)) {
				uni.showToast({ title: '已达到最大域名数量限制', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '添加中...' })
				await addInstanceDomain(this.instanceId, { domain: this.newDomain.trim() })
				uni.hideLoading()
				uni.showToast({ title: '添加成功', icon: 'success' })
				this.showAddDomain = false
				this.newDomain = ''
				this.loadDomains()
			} catch (e) {
				uni.hideLoading()
			}
		},
		deleteDomain(item) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除域名 ${item.domain} 吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteInstanceDomain(this.instanceId, item.id)
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.loadDomains()
						} catch (e) {}
					}
				}
			})
		},
		// 文件管理
		async loadFiles(path = '/') {
			this.filesLoading = true
			this.currentPath = path
			try {
				console.log('Loading files from path:', path)
				const res = await getFiles(this.instanceId, path)
				console.log('Files API response:', res)
				
				// 兼容不同的返回格式
				const data = res.data || res
				let fileList = data.files || data.list || data.items || data.data || []
				
				// 如果 fileList 不是数组，尝试其他方式
				if (!Array.isArray(fileList)) {
					console.warn('fileList is not an array:', fileList)
					fileList = []
				}
				
				// 标准化文件对象字段
				this.files = fileList.map(f => {
					const fileName = f.name || f.filename || f.file_name || ''
					// 构建完整路径
					let filePath = f.path || f.full_path
					if (!filePath && fileName) {
						filePath = path === '/' ? '/' + fileName : path + '/' + fileName
					}
					
					return {
						name: fileName,
						path: filePath,
						is_dir: f.is_dir !== undefined ? f.is_dir : (f.isDir !== undefined ? f.isDir : f.type === 'dir' || f.type === 'directory'),
						size: f.size || f.file_size || 0
					}
				})
				console.log('Files loaded:', this.files.length, 'items in', path)
			} catch (e) {
				console.error('加载文件列表失败', e)
				this.files = []
				uni.showToast({ title: '加载文件列表失败', icon: 'none' })
			}
			this.filesLoading = false
		},
		navigateTo(path) {
			this.loadFiles(path)
		},
		navigateToIndex(index) {
			const path = '/' + this.pathParts.slice(0, index + 1).join('/')
			this.loadFiles(path)
		},
		goBack() {
			const parts = this.pathParts
			parts.pop()
			const path = parts.length ? '/' + parts.join('/') : '/'
			this.loadFiles(path)
		},
		openFile(file) {
			console.log('Opening file:', file)
			if (!file) {
				console.error('File object is null')
				return
			}
			
			if (file.is_dir) {
				// 进入目录
				const targetPath = file.path || (this.currentPath === '/' ? '/' + file.name : this.currentPath + '/' + file.name)
				console.log('Navigating to directory:', targetPath)
				this.loadFiles(targetPath)
			} else {
				// 编辑文件
				this.selectedFile = {
					...file,
					path: file.path || (this.currentPath === '/' ? '/' + file.name : this.currentPath + '/' + file.name)
				}
				console.log('Selected file for edit:', this.selectedFile)
				this.editFile()
			}
		},
		showFileActions(file) {
			console.log('Show actions for:', file)
			if (!file) {
				console.error('File object is null')
				return
			}
			
			// 确保文件有正确的路径
			this.selectedFile = {
				...file,
				path: file.path || (this.currentPath === '/' ? '/' + file.name : this.currentPath + '/' + file.name)
			}
			console.log('Selected file:', this.selectedFile)
			this.showFileAction = true
		},
		async editFile() {
			this.showFileAction = false
			console.log('Editing file:', this.selectedFile)
			
			if (!this.selectedFile || !this.selectedFile.path) {
				uni.showToast({ title: '文件路径无效', icon: 'none' })
				return
			}
			
			try {
				uni.showLoading({ title: '加载中...' })
				console.log('Reading file path:', this.selectedFile.path)
				const res = await readFile(this.instanceId, this.selectedFile.path)
				console.log('Read file response:', res)
				
				// 兼容不同的返回格式
				const data = res.data || res
				// 文件内容可能是空字符串，所以用 !== undefined 判断
				if (data.content !== undefined) {
					this.fileContent = data.content
				} else if (data.data !== undefined) {
					this.fileContent = data.data
				} else if (data.body !== undefined) {
					this.fileContent = data.body
				} else if (typeof data === 'string') {
					this.fileContent = data
				} else {
					this.fileContent = ''
				}
				
				uni.hideLoading()
				this.showFileEditor = true
			} catch (e) {
				console.error('读取文件失败:', e)
				uni.hideLoading()
				const errMsg = e.message || e.msg || '读取文件失败'
				uni.showToast({ title: errMsg, icon: 'none' })
			}
		},
		async saveFileContent() {
			try {
				uni.showLoading({ title: '保存中...' })
				await saveFile(this.instanceId, { path: this.selectedFile.path, content: this.fileContent })
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showFileEditor = false
			} catch (e) {
				uni.hideLoading()
			}
		},
		createNewFile() {
			this.showFileMenu = false
			uni.showModal({
				title: '新建文件',
				editable: true,
				placeholderText: '输入文件名',
				success: async (res) => {
					if (res.confirm && res.content) {
						try {
							const path = this.currentPath === '/' ? '/' + res.content : this.currentPath + '/' + res.content
							await createFile(this.instanceId, { path })
							uni.showToast({ title: '创建成功', icon: 'success' })
							this.loadFiles(this.currentPath)
						} catch (e) {}
					}
				}
			})
		},
		createNewDir() {
			this.showFileMenu = false
			uni.showModal({
				title: '新建目录',
				editable: true,
				placeholderText: '输入目录名',
				success: async (res) => {
					if (res.confirm && res.content) {
						try {
							const path = this.currentPath === '/' ? '/' + res.content : this.currentPath + '/' + res.content
							await createDir(this.instanceId, { path })
							uni.showToast({ title: '创建成功', icon: 'success' })
							this.loadFiles(this.currentPath)
						} catch (e) {}
					}
				}
			})
		},
		renameFileAction() {
			this.showFileAction = false
			uni.showModal({
				title: '重命名',
				editable: true,
				placeholderText: '输入新名称',
				success: async (res) => {
					if (res.confirm && res.content) {
						try {
							await renameFile(this.instanceId, { path: this.selectedFile.path, new_name: res.content })
							uni.showToast({ title: '重命名成功', icon: 'success' })
							this.loadFiles(this.currentPath)
						} catch (e) {}
					}
				}
			})
		},
		copyFileAction() {
			this.showFileAction = false
			uni.showModal({
				title: '复制到',
				editable: true,
				placeholderText: '输入目标路径',
				success: async (res) => {
					if (res.confirm && res.content) {
						try {
							await copyFile(this.instanceId, { source: this.selectedFile.path, dest: res.content })
							uni.showToast({ title: '复制成功', icon: 'success' })
							this.loadFiles(this.currentPath)
						} catch (e) {}
					}
				}
			})
		},
		moveFileAction() {
			this.showFileAction = false
			uni.showModal({
				title: '移动到',
				editable: true,
				placeholderText: '输入目标路径',
				success: async (res) => {
					if (res.confirm && res.content) {
						try {
							await moveFile(this.instanceId, { source: this.selectedFile.path, dest: res.content })
							uni.showToast({ title: '移动成功', icon: 'success' })
							this.loadFiles(this.currentPath)
						} catch (e) {}
					}
				}
			})
		},
		zipFileAction() {
			this.showFileAction = false
			uni.showModal({
				title: '压缩',
				editable: true,
				placeholderText: '输入压缩包名称',
				success: async (res) => {
					if (res.confirm && res.content) {
						try {
							await zipFile(this.instanceId, { source: this.selectedFile.path, zip_name: res.content })
							uni.showToast({ title: '压缩成功', icon: 'success' })
							this.loadFiles(this.currentPath)
						} catch (e) {}
					}
				}
			})
		},
		async unzipFileAction() {
			this.showFileAction = false
			try {
				uni.showLoading({ title: '解压中...' })
				await unzipFile(this.instanceId, { zip_path: this.selectedFile.path })
				uni.hideLoading()
				uni.showToast({ title: '解压成功', icon: 'success' })
				this.loadFiles(this.currentPath)
			} catch (e) {
				uni.hideLoading()
			}
		},
		deleteFileAction() {
			this.showFileAction = false
			uni.showModal({
				title: '确认删除',
				content: `确定删除 ${this.selectedFile.name} 吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteFile(this.instanceId, { path: this.selectedFile.path, is_dir: this.selectedFile.is_dir })
							uni.showToast({ title: '删除成功', icon: 'success' })
							this.loadFiles(this.currentPath)
						} catch (e) {}
					}
				}
			})
		},
		// 设置
		async loadPhpVersions() {
			try {
				const res = await getPhpVersions(this.instanceId)
				// 兼容不同的返回格式
				const data = res.data || res
				const versions = data.versions || data.php_versions || data.list || []
				
				// 如果返回的是对象数组 [{name, version, status}]，提取版本号用于显示
				if (versions.length > 0 && typeof versions[0] === 'object') {
					this.phpVersionList = versions // 保存完整列表
					this.phpVersions = versions.map(v => v.name || `PHP-${v.version}`)
					// 查找当前版本
					const current = data.current_version || data.currentVersion || data.current || data.php_version || ''
					if (current) {
						const currentItem = versions.find(v => v.version === current || v.name === current)
						this.currentPhpVersion = currentItem ? (currentItem.name || `PHP-${currentItem.version}`) : current
					} else {
						this.currentPhpVersion = ''
					}
				} else {
					this.phpVersionList = null
					this.phpVersions = versions
					this.currentPhpVersion = data.current_version || data.currentVersion || data.current || data.php_version || ''
				}
				console.log('PHP versions loaded:', this.phpVersions, 'current:', this.currentPhpVersion)
			} catch (e) {
				console.error('加载PHP版本失败', e)
			}
		},
		async onPhpChange(e) {
			let version = this.phpVersions[e.detail.value]
			// 如果有完整列表，获取实际的版本号
			if (this.phpVersionList && this.phpVersionList[e.detail.value]) {
				version = this.phpVersionList[e.detail.value].version
			}
			try {
				uni.showLoading({ title: '切换中...' })
				await setPhpVersion(this.instanceId, { version })
				uni.hideLoading()
				uni.showToast({ title: '切换成功', icon: 'success' })
				this.currentPhpVersion = this.phpVersions[e.detail.value]
			} catch (e) {
				uni.hideLoading()
			}
		},
		async loadRunPath() {
			try {
				const res = await getRunPath(this.instanceId)
				// 兼容不同的返回格式
				const data = res.data || res
				this.runPath = data.run_path || data.runPath || data.path || '/'
				this.runPathDirs = data.dirs || data.directories || data.list || ['/']
				console.log('Run path loaded:', this.runPath, 'dirs:', this.runPathDirs)
			} catch (e) {
				console.error('加载运行目录失败', e)
			}
		},
		async onRunPathChange(e) {
			const path = this.runPathDirs[e.detail.value]
			try {
				uni.showLoading({ title: '设置中...' })
				await setRunPath(this.instanceId, { run_path: path })
				uni.hideLoading()
				uni.showToast({ title: '设置成功', icon: 'success' })
				this.runPath = path
			} catch (e) {
				uni.hideLoading()
			}
		},
		async loadRewrite() {
			try {
				const res = await getRewrite(this.instanceId)
				// 兼容不同的返回格式
				const data = res.data || res
				this.rewriteTemplates = data.templates || data.template_list || ['wordpress', 'thinkphp', 'laravel', 'codeigniter', 'typecho']
				this.rewriteContent = data.content || data.rewrite || ''
				console.log('Rewrite loaded, templates:', this.rewriteTemplates)
			} catch (e) {
				console.error('加载伪静态失败', e)
				// 提供默认模板列表
				this.rewriteTemplates = ['wordpress', 'thinkphp', 'laravel', 'codeigniter', 'typecho']
			}
		},
		async loadRewriteTemplate(name) {
			try {
				uni.showLoading({ title: '加载中...' })
				const res = await getRewriteTemplate(this.instanceId, name)
				this.rewriteContent = res.data?.content || ''
				uni.hideLoading()
				this.showRewriteModal = true
			} catch (e) {
				uni.hideLoading()
			}
		},
		async saveRewrite() {
			try {
				uni.showLoading({ title: '保存中...' })
				await setRewrite(this.instanceId, { content: this.rewriteContent })
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				this.showRewriteModal = false
			} catch (e) {
				uni.hideLoading()
			}
		},
		async loadSslStatus() {
			try {
				const res = await getSslStatus(this.instanceId)
				// 兼容不同的返回格式
				const data = res.data || res
				this.sslStatus = {
					status: data.status || data.enabled || data.ssl_enabled || false,
					https_force: data.https_force || data.force_https || data.forceHttps || false,
					cert_info: data.cert_info || data.certInfo || data.certificate || null
				}
				console.log('SSL status loaded:', this.sslStatus)
			} catch (e) {
				console.error('加载SSL状态失败', e)
				this.sslStatus = { status: false, https_force: false, cert_info: null }
			}
		},
		async deploySslCert() {
			if (!this.sslKey.trim() || !this.sslCsr.trim()) {
				uni.showToast({ title: '请填写证书信息', icon: 'none' })
				return
			}
			try {
				uni.showLoading({ title: '部署中...' })
				await deploySsl(this.instanceId, { key: this.sslKey, csr: this.sslCsr })
				uni.hideLoading()
				uni.showToast({ title: '部署成功', icon: 'success' })
				this.showSslModal = false
				this.sslKey = ''
				this.sslCsr = ''
				this.loadSslStatus()
			} catch (e) {
				uni.hideLoading()
			}
		},
		handleCloseSsl() {
			uni.showModal({
				title: '确认关闭',
				content: '确定关闭 SSL 吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await closeSsl(this.instanceId)
							uni.showToast({ title: '已关闭', icon: 'success' })
							this.loadSslStatus()
						} catch (e) {}
					}
				}
			})
		},
		async toggleForceHttps(e) {
			try {
				await setForceHttps(this.instanceId, { enable: e.detail.value })
				uni.showToast({ title: '设置成功', icon: 'success' })
			} catch (e) {}
		}
	},
	watch: {
		activeTab(val) {
			if (val === 'domains' && this.domains.length === 0) this.loadDomains()
			if (val === 'files' && this.files.length === 0) this.loadFiles()
			if (val === 'settings') {
				if (this.phpVersions.length === 0) this.loadPhpVersions()
				if (this.runPathDirs.length === 0) this.loadRunPath()
				if (this.rewriteTemplates.length === 0) this.loadRewrite()
				if (!this.sslStatus) this.loadSslStatus()
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
	padding: 40rpx 30rpx 70rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.header-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #fff;
}

.header-status {
	font-size: 22rpx;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	background: rgba(255,255,255,0.2);
	color: #fff;
}

.header-status.success {
	background: rgba(0,184,148,0.3);
}

.header-status.warning {
	background: rgba(255,107,0,0.3);
}

.header-status.danger {
	background: rgba(255,77,79,0.3);
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
	margin-bottom: 20rpx;
}

.domain-icon {
	font-size: 40rpx;
}

.domain-name {
	font-size: 32rpx;
	font-weight: 700;
	color: #1a1a2e;
	flex: 1;
	word-break: break-all;
}

.info-row {
	display: flex;
	gap: 20rpx;
	margin-bottom: 16rpx;
}

.info-item {
	flex: 1;
	background: #f8f9fa;
	padding: 16rpx 20rpx;
	border-radius: 12rpx;
}

.info-label {
	font-size: 22rpx;
	color: #8e8e93;
	display: block;
	margin-bottom: 6rpx;
}

.info-value {
	font-size: 26rpx;
	color: #1a1a2e;
	font-weight: 600;
}

.info-value.warning {
	color: #ff6b00;
}

.action-btn {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20rpx;
}

.action-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: 500;
}

/* 标签页 */
.tabs {
	display: flex;
	background: #fff;
	margin: 0 30rpx 20rpx;
	border-radius: 16rpx;
	padding: 8rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.tab-item {
	flex: 1;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #8e8e93;
	border-radius: 12rpx;
	transition: all 0.3s;
}

.tab-item.active {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
	font-weight: 600;
}

.tab-content {
	padding: 0 30rpx 30rpx;
}

/* 区块 */
.section {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 28rpx;
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
	padding: 10rpx 18rpx;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 16rpx;
}

.action-icon {
	font-size: 24rpx;
	color: #fff;
}

.action-label {
	font-size: 22rpx;
	color: #fff;
}

/* 信息列表 */
.info-list {
	background: #f8f9fa;
	border-radius: 12rpx;
	overflow: hidden;
}

.info-line {
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.info-line:last-child {
	border-bottom: none;
}

.line-label {
	font-size: 24rpx;
	color: #8e8e93;
	width: 140rpx;
}

.line-value {
	flex: 1;
	font-size: 24rpx;
	color: #1a1a2e;
	font-family: monospace;
	word-break: break-all;
}

.copy-btn, .toggle-btn {
	font-size: 22rpx;
	color: #4C84FF;
	padding: 8rpx 16rpx;
	background: rgba(76,132,255,0.1);
	border-radius: 8rpx;
	margin-left: 12rpx;
}

.toggle-btn {
	color: #8e8e93;
	background: rgba(142,142,147,0.1);
}

/* 规格网格 */
.spec-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.spec-item {
	width: calc(50% - 8rpx);
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 12rpx;
	text-align: center;
}

.spec-icon {
	font-size: 36rpx;
	display: block;
	margin-bottom: 8rpx;
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
	font-weight: 600;
}

/* 域名列表 */
.domain-list {
	background: #f8f9fa;
	border-radius: 12rpx;
	overflow: hidden;
}

.domain-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.domain-item:last-child {
	border-bottom: none;
}

.domain-text {
	flex: 1;
	font-size: 26rpx;
	color: #1a1a2e;
}

.delete-btn {
	font-size: 22rpx;
	color: #ff4d4f;
	padding: 8rpx 16rpx;
	background: rgba(255,77,79,0.1);
	border-radius: 8rpx;
}

/* 文件管理 */
.breadcrumb {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding: 16rpx 20rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
}

.crumb-item {
	font-size: 24rpx;
	color: #4C84FF;
	padding: 4rpx 8rpx;
}

.crumb-sep {
	font-size: 24rpx;
	color: #8e8e93;
}

.file-list {
	background: #f8f9fa;
	border-radius: 12rpx;
	overflow: hidden;
}

.file-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.file-item:last-child {
	border-bottom: none;
}

.file-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
}

.file-info {
	flex: 1;
	overflow: hidden;
}

.file-name {
	font-size: 26rpx;
	color: #1a1a2e;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.file-meta {
	font-size: 22rpx;
	color: #8e8e93;
	margin-top: 4rpx;
}

.file-more {
	font-size: 32rpx;
	color: #8e8e93;
	padding: 10rpx;
}

/* 设置 */
.setting-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.setting-row:last-child {
	border-bottom: none;
}

.setting-label {
	font-size: 26rpx;
	color: #1a1a2e;
}

.setting-picker {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 26rpx;
	color: #4C84FF;
}

.picker-arrow {
	font-size: 28rpx;
	color: #8e8e93;
}

.template-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.template-item {
	font-size: 24rpx;
	color: #4C84FF;
	padding: 12rpx 20rpx;
	background: rgba(76,132,255,0.1);
	border-radius: 20rpx;
}

/* SSL */
.ssl-status {
	margin-bottom: 20rpx;
}

.ssl-badge {
	display: inline-block;
	font-size: 24rpx;
	color: #8e8e93;
	padding: 8rpx 20rpx;
	background: #f0f0f0;
	border-radius: 20rpx;
	margin-bottom: 12rpx;
}

.ssl-badge.active {
	color: #00b894;
	background: rgba(0,184,148,0.1);
}

.ssl-info {
	background: #f8f9fa;
	padding: 16rpx 20rpx;
	border-radius: 12rpx;
}

.ssl-item {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 8rpx;
}

.ssl-item:last-child {
	margin-bottom: 0;
}

.ssl-actions {
	display: flex;
	gap: 16rpx;
	margin-bottom: 20rpx;
}

.ssl-btn {
	flex: 1;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #fff;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 36rpx;
}

.ssl-btn.danger {
	background: #fff;
	border: 2rpx solid #ff4d4f;
	color: #ff4d4f;
}

/* 空状态 */
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
}

/* 弹窗 */
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
	max-height: 80vh;
	overflow-y: auto;
}

.menu-content {
	width: 70%;
	padding: 30rpx;
}

.editor-content {
	width: 90%;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1a2e;
	text-align: center;
	margin-bottom: 30rpx;
	display: block;
}

.menu-item {
	padding: 28rpx 20rpx;
	font-size: 28rpx;
	color: #1a1a2e;
	border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item.danger {
	color: #ff4d4f;
}

.menu-item.cancel {
	color: #8e8e93;
	text-align: center;
	margin-top: 16rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
}

.form-item {
	margin-bottom: 24rpx;
}

.label {
	font-size: 26rpx;
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

.textarea {
	width: 100%;
	height: 200rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 20rpx 24rpx;
	font-size: 26rpx;
	box-sizing: border-box;
}

.editor-textarea {
	width: 100%;
	height: 500rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 20rpx 24rpx;
	font-size: 24rpx;
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
	height: 80rpx;
	border-radius: 40rpx;
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
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}
</style>
