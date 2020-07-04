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
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onShow() {
			uni.request({
			    url: getApp().globalData.ip + '/getConfig', //仅为示例，并非真实接口地址。
			    data: {},
				method:'POST',
			    success: (res) => {
					console.log('res.data',res.data);
					if(res.data.data && !res.data.error){
						// uni.setStorage({
						//     key: 'config',
						//     data: JSON.stringify(res.data.data),
						//     success: function () {
						//         console.log('success');
						//     }
						// });
						// 请求本地文件系统对象
						plus.io.requestFileSystem(
						    plus.io.PUBLIC_DOCUMENTS,  // 文件系统中的根目录
						    fs => {
						        // 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
						        fs.root.getFile('data.json', {
						            create: true  // 文件不存在则创建
						        }, fileEntry => {
						           // 文件在手机中的路径
						           console.log(fileEntry.fullPath)
						           fileEntry.createWriter(writer => {
									   console.log('writer=======>',JSON.stringify(writer))
						               // 写入文件成功完成的回调函数
						               writer.onwrite = e => {
						                    console.log("写入数据成功");  
						               };
						               // 写入数据
						               writer.write(JSON.stringify({data:['1','2']}));
						           })
						        }, e => {
						             console.log("getFile failed: " + e.message);
						        });
						     },
						     e => {
						         console.log(e.message);
						     }
						);
					}
			    }
			});
		},
		methods: {
			formSubmit: function(e) {
				console.log('e.detail.value',e.detail.value);
				let value = e.detail.value;
				if(value.username && value.password){
					uni.request({
					    url: getApp().globalData.ip + '/userLogin', //仅为示例，并非真实接口地址。
					    data: {"user":value.username,"password":value.password},
						method:'POST',
					    success: (res) => {
							console.log('res.data',res.data);
							if(res.data.data && !res.data.error){
								getApp().globalData.is_admin = res.data.data.is_admin;
								uni.redirectTo({
								    url: '../index/index'
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