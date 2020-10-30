<template>
	<view>
		 <view class="qrcode">
		 	<canvas style="width: 200px;height: 200px;" canvas-id="couponQrcode"></canvas>
		</view>
		<view class="title">
			请浏览器扫一扫上方二维码可直接下载此应用
		</view>
	</view>
</template>

<script>
	const qrCode = require('../common/weapp-qrcode.js');
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			let that = this;
			uni.request({
			    url: getApp().globalData.ip + '/getConfig', 
			    data: {},
				method:'POST',
			    success: (res) => {
					if(res.data.data && !res.data.error){
						console.log('res.data.data',res.data.data.app_down);
						that.couponQrCodes(res.data.data.app_down);
					}
				},
			});
		},
		methods: {
			couponQrCodes(app_down) {
				new qrCode('couponQrcode', {
					text: app_down,
					width: 200,
					height: 200,
					colorDark: "#333333",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.H
				})
			}
		}
	}
</script>

<style>
.qrcode{
	margin: 100px calc(50% - 100px) 50px;
}
.title{
	text-align: center;
	color: #666;
	width: 100%;
	font-size: 16px;
}
</style>
