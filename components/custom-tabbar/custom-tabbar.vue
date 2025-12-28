<template>
	<view class="tabbar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
		<view 
			class="tabbar-item" 
			v-for="(item, index) in tabs" 
			:key="index"
			@click="switchTab(item)"
		>
			<view class="icon-wrap">
				<!-- 首页图标 -->
				<view v-if="item.name === 'home'" class="icon-box">
					<view class="home-icon" :class="{ active: current === item.path }">
						<view class="home-roof"></view>
						<view class="home-body"></view>
					</view>
				</view>
				<!-- 我的图标 -->
				<view v-if="item.name === 'mine'" class="icon-box">
					<view class="user-icon" :class="{ active: current === item.path }">
						<view class="user-head"></view>
						<view class="user-body"></view>
					</view>
				</view>
			</view>
			<text class="tabbar-text" :class="{ active: current === item.path }">{{ item.text }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomTabbar',
	props: {
		current: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			safeAreaBottom: 0,
			tabs: [
				{ name: 'home', path: '/pages/index/index', text: '首页' },
				{ name: 'mine', path: '/pages/mine/mine', text: '我的' }
			]
		}
	},
	created() {
		const sysInfo = uni.getSystemInfoSync()
		this.safeAreaBottom = sysInfo.safeAreaInsets?.bottom || 0
	},
	methods: {
		switchTab(item) {
			if (this.current === item.path) return
			uni.reLaunch({ url: item.path })
		}
	}
}
</script>

<style scoped>
.tabbar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100rpx;
	background: #ffffff;
	display: flex;
	align-items: center;
	border-top: 1rpx solid #eaeaea;
	z-index: 999;
}

.tabbar-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.icon-wrap {
	width: 48rpx;
	height: 48rpx;
	margin-bottom: 6rpx;
}

.icon-box {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 首页图标 - 房子 */
.home-icon {
	width: 44rpx;
	height: 44rpx;
	position: relative;
}

.home-roof {
	width: 0;
	height: 0;
	border-left: 22rpx solid transparent;
	border-right: 22rpx solid transparent;
	border-bottom: 18rpx solid #999999;
	position: absolute;
	top: 0;
	left: 0;
}

.home-body {
	width: 32rpx;
	height: 22rpx;
	background: #999999;
	border-radius: 0 0 4rpx 4rpx;
	position: absolute;
	bottom: 0;
	left: 6rpx;
}

.home-icon.active .home-roof {
	border-bottom-color: #4C84FF;
}

.home-icon.active .home-body {
	background: #4C84FF;
}

/* 我的图标 - 用户 */
.user-icon {
	width: 44rpx;
	height: 44rpx;
	position: relative;
}

.user-head {
	width: 18rpx;
	height: 18rpx;
	background: #999999;
	border-radius: 50%;
	position: absolute;
	top: 2rpx;
	left: 13rpx;
}

.user-body {
	width: 32rpx;
	height: 16rpx;
	background: #999999;
	border-radius: 16rpx 16rpx 0 0;
	position: absolute;
	bottom: 2rpx;
	left: 6rpx;
}

.user-icon.active .user-head {
	background: #4C84FF;
}

.user-icon.active .user-body {
	background: #4C84FF;
}

.tabbar-text {
	font-size: 22rpx;
	color: #999999;
}

.tabbar-text.active {
	color: #4C84FF;
}
</style>
