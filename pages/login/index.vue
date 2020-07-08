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
				<form @submit="formSubmit">
					<view class="uni-form-item uni-column">
						<view class="title">用户名</view>
						<input class="uni-input" name="username" placeholder="请输入用户名" />
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
			<!-- <view class="forgotBtn">
				<text>忘记密码</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	import {openComDB,dropSQL,setConfig,getConfig} from '../common/env.js'
	export default {
		data() {
			return {
				network:false,
			}
		},
		onShow(){
			console.log('========================================================')
			let that = this;
			uni.getNetworkType({
			    success: function (res) {
			        console.log('网络状态',res.networkType);
					that.isOpenDB(res.networkType);  
					if(res.networkType !== 'none'){
						that.network = true
						uni.request({
						    url: getApp().globalData.ip + '/getConfig', 
						    data: {},
							method:'POST',
						    success: (res) => {
								console.log('getConfig===========>',res.data);
								if(res.data.data && !res.data.error){
									setConfig(res.data.data);
									getApp().globalData.weedIp = res.data.data.zp_base;
									getApp().globalData.httpImg = res.data.data.zp_pub;
								}
						    } 
						});
					}else{
						that.network = false
					}
			    }
			});
			uni.onNetworkStatusChange(function (res) {
				that.network = res.isConnected;
			});
		},
		methods: {
			 isOpenDB(network) {  
					console.log('是否打开数据库');  
					var isOpen = plus.sqlite.isOpenDatabase({  
						name: 'kqxj', //数据库的名字  
						path: '_doc/kqxjList.db' //地址  
					});  
					console.log(!isOpen);  
	
					if (!isOpen) {  
						console.log('Unoepned:' + isOpen);  
						// plus.nativeUI.alert('Unopened!');  
						this.openDB(); //打開DB  
					} else {  
						// plus.nativeUI.alert('Opened!');  
						this.isNet(network);  
						// this.getLocalType();  
					}  
			},  
			openDB() {  
				//SQLite      
				openComDB('kqxj', '_doc/kqxjList.db', res => {   
					console.log('打开数据库');  
					this.isNet();  
				});  
			},  
			isNet(network){  
				if (network == 'wifi' || network == '4g') {  
					console.log('-------------网络正常------------')
				} else {  
					  console.log('-------------无网------------')
				}
			},  		
			formSubmit: function(e) {
				console.log('e.detail.value',e.detail.value);
				let value = e.detail.value;
				if(value.username && value.password){
					if(this.network){
						uni.request({
						    url: getApp().globalData.ip + '/userLogin', 
						    data: {"user":value.username,"password":value.password},
							method:'POST',
						    success: (res) => {
								console.log('res.data',res.data);
								if(res.data.data && !res.data.error){
									getApp().globalData.is_admin = res.data.data.is_admin;
									getApp().globalData.uid = res.data.data.id;
									let id = res.data.data.id || '';
									let name = res.data.data.xm || '';
									let password = res.data.data.mm || '';
									let is_admin = res.data.data.is_admin || '';
									uni.setStorage({
									    key: 'user',
									    data: JSON.stringify(res.data.data),
									    success: function () {
									       uni.redirectTo({
									           url: '../index/index'
									       });
									    }
									});
								}else{
									uni.showToast({
										title:'用户名或密码错误',
										icon:'none',
									});
								}
								
						    }
						});
					}else{
						uni.getStorage({
						    key: 'user',
						    success: function (res) {
						        console.log(res.data);
								if(res.data){
									console.log(value.username === res.data.lxdh  && value.password === res.data.mm);
									console.log(value.username,res.data.lxdh,value.password,res.data.mm);
									if(value.username === JSON.parse(res.data).lxdh  && value.password === JSON.parse(res.data).mm){
										getApp().globalData.is_admin = JSON.parse(res.data).is_admin;
										getApp().globalData.uid = JSON.parse(res.data).id;
										uni.redirectTo({
										    url: '../index/index'
										});
									}else{
										uni.showToast({
											title:'用户名或密码错误',
											icon:'none',
										});
									}
								}else{
									uni.showToast({
										title:'首次登陆请连接互联网',
										icon:'none',
									});
								}
						    }
						});
					}
					
				}else{
					uni.showToast({
						title:'用户名及密码不能为空',
						icon:'none',
					});
				}
				
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
		height: 40px;
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
		width: 60%;
		margin-left: 15%;
	}
</style>