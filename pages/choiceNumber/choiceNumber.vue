<template>
	<view style="margin-top: 80px;">
		<view class="choiceBtn">
			<image src="../../static/myHeader.png"></image>
			<text class="name">警员1</text>
			<text class="tag">当前登陆中</text>
		</view>
		<view class="choiceBtn">
			<image src="../../static/myHeader.png"></image>
			<text class="name">警员2</text>
		</view>
		<view class="choiceBtn">
			<image src="../../static/myHeader.png"></image>
			<text class="name">警员3</text>
		</view>
		<button type="primary" class="btn" @click="goBack">换个账号登陆</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goBack:function(){
				uni.reLaunch({
				    url: '../login/index'
				});
			}
		}
	}
</script>

<style>
page {
	      background-color: #fff;
}
.choiceBtn{
	width: 70%;
	margin: 15px 12%;
	background: #F5F5F5;
	height: 60px;
	border-radius:10px;
	padding: 10px 0 10px 6%;
}
uni-image{
	width: 60px!important;
	height: 60px!important;
	float: left;
}
.name{
	float: left;
	line-height: 60px;
	margin-left: 20px;
}
.tag{
	float: left;
	background: #FECA4E;
	font-size: 12px;
	padding: 2px 6px;
	border-radius: 10px;
	color: #fff;
	margin: 20px 0 0 10px;
}
.btn{
	width: 86%;
	margin: 80px 7%;
	background: #F5F5F5!important;
	color: #4D4D4D!important;
}
.btn:after{
	border: 0!important;
}
</style>
