<template>
	<view class="uni-tabbar">
		<view class="uni-tabbar__item" v-for="(item,index) in tabbar" :key="index" @tap="changeTab(item)">
			<view class="uni-tabbar__bd">
				<view class="uni-tabbar__icon">
					<image v-if="item.pagePath == pagePath" class="icon-img" mode="aspectFit" :src="item.selectedIconPath"></image>
					<image v-else class="icon-img" mode="aspectFit" :src="item.iconPath"></image>
				</view>
			</view>
			<view class="uni-tabbar__label" :class="{'active': item.pagePath == pagePath}">
				{{item.text}}
			</view>
			<uni-badge v-if="num && num > 0 && item.num" :text="num" type="error" class="badge" size='small'></uni-badge>
			<uni-badge v-if="numAll && numAll > 0 && item.numAll" :text="numAll" type="error" class="badge" size='small'></uni-badge>
		</view>
	</view>

</template>

<script>
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	import io from '@hyoga/uni-socket.io';
	let socket = '';
	export default {
		props: {
			pagePath: String,
			num: Number,
		},
		data() {
			return {
				page: 'contact',
				showPage: false,
				containerHeight: 400,
				numAll:'0',
				tabbar: getApp().globalData.is_admin === '1' ? [
					{
						"pagePath": "/pages/index/index",
						"iconPath": "/static/icon1.png",
						"selectedIconPath": "/static/icon_1.png",
						"text": "矿山"
					}, {
						"pagePath": "/pages/work/work",
						"iconPath": "/static/icon2.png",
						"selectedIconPath": "/static/icon_2.png",
						 "text": "工作督查"
					}, {
						"pagePath": "/pages/upload/upload",
						"iconPath": "/static/icon3.png",
						"selectedIconPath": "/static/icon_3.png",
						"text": "待上传",
					}, {
						"pagePath": "/pages/entrust/entrust",
						"iconPath": "/static/icon4.png",
						"selectedIconPath": "/static/icon_4.png",
						"text": "委托",
						"num":true,
					},
					{
						"pagePath": "/pages/myPage/myPage",
						"iconPath": "/static/icon5.png",
						"selectedIconPath": "/static/icon_5.png",
						"text": "我的",
						"numAll": true,
					},
				] : [
					{
						"pagePath": "/pages/index/index",
						"iconPath": "/static/icon1.png",
						"selectedIconPath": "/static/icon_1.png",
						"text": "矿山"
					}, {
						"pagePath": "/pages/upload/upload",
						"iconPath": "/static/icon3.png",
						"selectedIconPath": "/static/icon_3.png",
						"text": "待上传"
					}, {
						"pagePath": "/pages/entrust/entrust",
						"iconPath": "/static/icon4.png",
						"selectedIconPath": "/static/icon_4.png",
						"text": "委托",
						"num":true,
					},
					{
						"pagePath": "/pages/myPage/myPage",
						"iconPath": "/static/icon5.png",
						"selectedIconPath": "/static/icon_5.png",
						"text": "我的",
						"numAll": true,
					},
				]
			};
		},
		watch: {
			pagePath: {
				handler(val) {
					// console.log('pagePath监听===val', val)
				},
				immediate: true
			}
		},
		mounted() {
			this.getNum();
		},
		methods: {
			changeTab(item) {
				this.page = item.pagePath;
				// 使用reLaunch关闭所有的页面，打开新的栏目页面
				uni.reLaunch({
					url: this.page
				});
			},
			getNum:function(){
				let that = this;
				uni.getStorage({
				    key: 'userData',
				    success: function (res) {
						if(res.data){
							that.id = JSON.parse(res.data).lxdh; 
							socket = io(getApp().globalData.socketIp, {
								  query: {
									  idcard: that.id,
									  device: 'pc',
								  },
								  transports: [ 'websocket', 'polling' ], 
								});
								socket.on('connect', () => { 
								  console.log('ws 已连接');
								});
								socket.on('chat-list', function (data) {
									let num = 0;
									data.map((item)=>{
										num = num + item.unread;
										that.numAll = num.toString();
										that.$emit('getMsgNum', num.toString());
									});
								});
								socket.on('chat-message', (data) => { 
									that.numAll = (parseInt(that.numAll) + 1).toString();
								});
						}
					},
				});
			}
		}
	}
</script>

<style scoped>
	.badge{
		position: absolute;
		top: -5px;
		right: 15%;
	}
	.uni-tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		display: flex;
		justify-content: space-around;
		height: 98upx;
		padding: 10upx 0 16upx 0;
		box-sizing: border-box;
		border-top: solid 1upx #E1E1E1;
		background-color: #fff;
		box-shadow: 0px 0px 17upx 1upx rgba(206, 206, 206, 0.32);
	}
	.uni-tabbar__item {
		display: block;
		line-height: 24upx;
		font-size: 20upx;
		text-align: center;
		width: 25%;
		position: relative;
	}
	
	.uni-tabbar__icon {
		height: 24px;
		line-height: 24px;
		text-align: center;
	}
	
	.icon {
		display: inline-block;
	}
	
	.uni-tabbar__label {
		line-height: 24upx;
		font-size: 24upx;
		color: #999;
		margin-top: 2px;
	}
	.uni-tabbar__label.active {
		color: #243a85;
	}
	.icon-img {
		height: 24px;
		width: 24px;
	}
</style>

