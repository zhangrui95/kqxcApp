// An highlighted block
<template>
	<view class="content">
		<view class="avatorWrapper">
			<view class="avator">
				<image class="img" src="../../static/logo.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="titleTop">矿区巡检</view>
		<view class="form">
			<view class="loginBox">
				<form @submit="formSubmit" @reset="formReset">
					<view class="uni-form-item uni-column">
						<view class="title">用户名</view>
						<input class="uni-input" name="input" placeholder="请输入用户名" />
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">密码</view>
						<input class="uni-input" name="password" password='true'  placeholder="请输入密码" />
					</view>
					<view class="uni-btn-v">
						<button form-type="submit" class="loginBtn">登录</button>
					</view>
				</form>
			</view>
			<view class="forgotBtn">
				<text>忘记密码</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			formSubmit: function(e) {
				console.log('e.detail.value',e.detail.value);
				uni.switchTab({
					url: '../index/index'
				});
			}
		}
	}
</script>

<style>
	 @font-face {
	     font-family: lxjt;
	     src: url('~@/static/lxjt.ttf');
	 }
	.titleTop{
		text-align: center;
		color: #fff;
		font-family: 'lxjt';
		margin: 25px 0;
		font-size: 22px;
	}
	.loginBox{
		background: #fff;
		width: 90%; 
	    border-radius: 8px;
		padding: 5%;
		position: relative;
		padding-bottom: 50px;
	}
	.content {
		background: url('~@/static/bg.png');
		width: 100vw;
		height: 100vh;
		background-size: 100% 100%;
	}
	.avatorWrapper{
		height: 25vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.avator{
		width: 160upx;
		overflow: hidden;
	}
	.avator .img{
		width: 100%
	}
	.form{
		padding: 0 50upx;
	}
	
	.loginBtn{
		width: 100%;
		height: 80upx;
		background: linear-gradient(45deg, #0055ff, #00eaff);
		border-radius: 50upx;
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
	}
	.forgotBtn{
		text-align: center;
		color: #EAF6F9;
		font-size: 12px;
		margin-top: 20px;
		position: absolute;
		width: 90%;
		bottom:50px;
		text-decoration: underline;
	}
	.title{
		font-size: 14px;
		color: #aaa;
	}
	.uni-input{
		border-bottom: 1px solid #ccc;
		margin: 10px 0;
		padding: 10px 0;
	}
	.uni-btn-v{
		position: absolute;
		bottom: -20px;
		width: 180px;
		margin-left: calc(45% - 90px);
	}
</style>