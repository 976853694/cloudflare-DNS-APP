<script>
	import { checkAppUpdate } from '@/api/app'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 检测APP更新
			this.checkUpdate()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			async checkUpdate() {
				// 仅在APP环境下检测更新
				// #ifdef APP-PLUS
				try {
					const systemInfo = uni.getSystemInfoSync()
					const platform = systemInfo.platform // android 或 ios
					
					// 获取当前APP版本
					plus.runtime.getProperty(plus.runtime.appid, (info) => {
						const currentVersion = info.version
						console.log('当前版本：', currentVersion)
						
						checkAppUpdate({
							platform: platform,
							version: currentVersion
						}).then(res => {
							console.log('检测更新结果：', res)
							if (res.data?.has_update) {
								this.showUpdateDialog(res.data)
							}
						}).catch(err => {
							console.log('检测更新失败', err)
						})
					})
				} catch (e) {
					console.log('检测更新异常', e)
				}
				// #endif
			},
			showUpdateDialog(updateInfo) {
				const content = `发现新版本 v${updateInfo.latest_version}\n\n${updateInfo.update_log || '修复已知问题，提升用户体验'}`
				
				if (updateInfo.force_update) {
					// 强制更新，不显示取消按钮
					uni.showModal({
						title: '发现新版本',
						content: content,
						showCancel: false,
						confirmText: '立即更新',
						success: (res) => {
							if (res.confirm) {
								this.downloadUpdate(updateInfo)
							}
						}
					})
				} else {
					// 非强制更新
					uni.showModal({
						title: '发现新版本',
						content: content,
						cancelText: '稍后再说',
						confirmText: '立即更新',
						success: (res) => {
							if (res.confirm) {
								this.downloadUpdate(updateInfo)
							}
						}
					})
				}
			},
			downloadUpdate(updateInfo) {
				// #ifdef APP-PLUS
				const downloadUrl = updateInfo.download_url
				console.log('开始下载更新：', downloadUrl)
				
				// 直接打开浏览器下载apk
				plus.runtime.openURL(downloadUrl)
				// #endif
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	
	/* 隐藏原生 tabBar (H5端) */
	uni-tabbar,
	.uni-tabbar,
	.uni-tabbar-bottom {
		display: none !important;
		height: 0 !important;
		visibility: hidden !important;
	}
</style>
