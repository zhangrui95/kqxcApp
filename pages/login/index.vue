// An highlighted block
<template>
	<view class="content">
		<view class="avatorWrapper">
			<view class="avator">
				<image class="img" src="../../static/logo.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="titleTop">矿区巡检</view>
		<view class="form" v-if="showLogin">
			<view class="loginBox">
				<form @submit="formSubmit">
					<view class="uni-form-item uni-column">
						<view class="title">用户名</view>
						<input :value="name" class="uni-input" name="username" placeholder="请输入用户名" />
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">密码</view>
						<input :value="password" class="uni-input" name="password" password='true'  placeholder="请输入密码" />
					</view>
					<view class="uni-btn-v">
						<button form-type="submit" class="loginBtn">登录</button> 
						<button @click="getLoginLx" class="loginBtnXj">离线巡检</button> 
					</view>
				</form>
			</view>
			<view class="loading" v-if="load">
				<view class="loadBox">
					<view class="loadName">下载中({{this.progress}}%)</view>
					<view class="loadItem">
						<view class="load" :style="{width:this.progress+'%'}"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {openComDB,dropSQL,setConfig,getConfig,setUsersData,getUsersData,setUsersAllData,getUsersAllData} from '../common/env.js'
	export default {
		data() {
			return {
				network:false,
				progress:0,
				load:false,
				showLogin:false,
				name:'',
				password:'',
			}
		},
		onLoad() {
			let that = this;
			uni.getStorage({
			    key: 'userData',
			    success: function (res) {
					if(res.data){
						that.showLogin = true;
						getApp().globalData.is_admin = JSON.parse(res.data).is_admin;
						getApp().globalData.uid = JSON.parse(res.data).id;
						getApp().globalData.is_zz = JSON.parse(res.data).is_zz;
						let dataRes = JSON.parse(res.data);
						that.name = dataRes.lxdh;
						that.password = dataRes.mm;
						uni.hideLoading();
						uni.getNetworkType({
						    success: function (res) {
								if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
									console.log('==执行==')
									uni.request({
									    url: getApp().globalData.ip + '/getConfig', 
									    data: {},
										method:'POST',
									    success: (res) => {
											console.log('dataRes',dataRes);
											if(res.data.data && !res.data.error){
												if(dataRes.version && dataRes.version === getApp().globalData.version && !(res.data.data.must_update === '1' &&  (that.toNum(getApp().globalData.version) < that.toNum(res.data.data.last_version)))){
													that.getYh(dataRes.id,dataRes.is_admin);
													// uni.redirectTo({
													// 	url: '../home/home'
													// });
												}else{
													that.showLogin = true;
												}
											}
									    } 
									});
								}else{
									that.getYh(dataRes.id,dataRes.is_admin);
									// uni.redirectTo({
									// 	url: '../home/home'
									// });
								}
							},
						});
					}else{
						that.showLogin = true;
					}
			    },
				fail:function(){
					that.showLogin = true;
				}
			});
		},
		onShow(){
			// console.log('========================================================')
			let that = this;
			uni.getNetworkType({
			    success: function (res) {
			        // console.log('网络状态',res.networkType);
					that.isOpenDB(res.networkType);  
					if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
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
									console.log('getApp().globalData.version < res.data.data.last_version',that.toNum(getApp().globalData.version) < that.toNum(res.data.data.last_version),that.toNum(getApp().globalData.version) , that.toNum(res.data.data.last_version))
									if(res.data.data.must_update === '1' && (that.toNum(getApp().globalData.version) < that.toNum(res.data.data.last_version))){
										uni.showModal({
										    title: '检测到新版本，与旧版本不兼容，请更新后使用。',
											showCancel:false,
										    success: function (resDate) {
										         if (resDate.confirm) {
													that.load = true;
													const downloadTask = uni.downloadFile({
														url: res.data.data.app_down,
														success: (res) => {
															if (res.statusCode === 200) {
																that.delDb();
																that.load = false; 
																uni.removeStorage({
																    key: 'userData',
																    success: function (res) {}
																});
																plus.runtime.install(res.tempFilePath);
																console.log('下载成功');
															}
														}
													});
													downloadTask.onProgressUpdate((res) => {
														that.progress = res.progress;
													});
										         } else if (resDate.cancel) {
										             // console.log('用户点击取消');
										         }
											}
										});
									}
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
			toNum(a){
			  var a=a.toString();
			  var c=a.split('.');
			  var num_place=["","0","00","000","0000"],r=num_place.reverse();
			  for (var i=0;i<c.length;i++){ 
			     var len=c[i].length;       
			     c[i]=r[len]+c[i];  
			  } 
			  var res= c.join(''); 
			  return res; 
			},
			delDb(){
				let dirPath = '_doc'+getApp().globalData.version+'/kqxjList.db';
				plus.io.resolveLocalFileSystemURL(dirPath, function(entry) {
					entry.remove( function ( entry ) {
						console.log('删除成功回调')
					}, function ( e ) {
						alert( e.message );
					} );
				});
				let dirPath1 = '_doc'+getApp().globalData.version+'/kqxjList.db-journal';
				plus.io.resolveLocalFileSystemURL(dirPath1, function(entry) { 
					entry.remove( function ( entry ) {
						console.log('删除成功回调')
					}, function ( e ) {
						alert( e.message );
					} );
				});
			},
			 isOpenDB(network) {  
					// console.log('是否打开数据库');  
					var isOpen = plus.sqlite.isOpenDatabase({  
						name: 'kqxj', //数据库的名字  
						path: '_doc'+getApp().globalData.version+'/kqxjList.db' //地址  
					});  
					// console.log(!isOpen);  
	
					if (!isOpen) {  
						// console.log('Unoepned:' + isOpen);  
						// plus.nativeUI.alert('Unopened!');  
						this.openDB(); //打開DB  
					} else {  
						// plus.nativeUI.alert('Opened!');  
						this.isNet(network);  
					}  
			},  
			openDB() {  
				let path = '_doc'+getApp().globalData.version+'/kqxjList.db';
				//SQLite      
				openComDB('kqxj', path, res => {   
					// console.log('打开数据库');  
					this.isNet();  
				});  
			},  
			isNet(network){  
				if (network == 'wifi' || network == '4g') {  
					// console.log('-------------网络正常------------')
				} else {  
					  // console.log('-------------无网------------')
				}
			},  
			getYh:function(uid,is_admin){
				uni.request({
					url: getApp().globalData.ip + '/getUsersData', //下载用户列表
					data: {"uid": uid},
					method:'POST',
					success: (res) => {	
						console.log('res=====>用户',res)
						if(res.data.data && !res.data.error){
						 getUsersData(`DELETE FROM usersData`,(res)=>{});
						 setUsersData(res.data.data,(res)=>{});
						} 
					}
				});
				// if(is_admin === '1'){
				uni.request({
					url: getApp().globalData.ip + '/getUsersData', //下载用户列表
					data: {},
					method:'POST',
					success: (res) => {	
						if(res.data.data && !res.data.error){
						 setUsersAllData(res.data.data,(res)=>{});
						} 
					}
				});
				// }
			},
			getLoginLx: function(){
				let that = this;
				uni.getStorage({
					    key: 'user',
					    success: function (res) { 
							if(res.data){
								if(that.name === JSON.parse(res.data).lxdh  && that.password === JSON.parse(res.data).mm){
									getApp().globalData.is_admin = JSON.parse(res.data).is_admin;
									getApp().globalData.uid = JSON.parse(res.data).id;
									getApp().globalData.is_zz = JSON.parse(res.data).is_zz;
									getApp().noNetwork = true;
									uni.redirectTo({
									    url: '../home/home'
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
			},
			formSubmit: function(e) {
				// console.log('e.detail.value',e.detail.value);
				let value = e.detail.value;
				if(value.username && value.password){
					if(this.network){
						uni.request({
						    url: getApp().globalData.ip + '/userLogin', 
						    data: {"user":value.username,"password":value.password},
							method:'POST',
						    success: (res) => {
								// console.log('res.data',res.data);
								if(res.data.data && !res.data.error){
									res.data.data.version = getApp().globalData.version;
									getApp().globalData.is_admin = res.data.data.is_admin;
									getApp().globalData.uid = res.data.data.id;
									getApp().globalData.is_zz = res.data.data.is_zz;
									getApp().noNetwork = false;
									let id = res.data.data.id || '';
									let name = res.data.data.xm || '';
									let password = res.data.data.mm || '';
									let is_admin = res.data.data.is_admin || '';
									this.getYh(res.data.data.id,res.data.data.is_admin);
									uni.setStorage({
									    key: 'userData',
									    data: JSON.stringify(res.data.data),
									    success: function () {}
									});
									uni.setStorage({
									    key: 'user',
									    data: JSON.stringify(res.data.data),
									    success: function () {
									       uni.redirectTo({
									           url: '../home/home'
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
						this.getLoginLx();
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
		height: 50px;
		background: linear-gradient(45deg, #0055ff, #00eaff);
		border-radius: 50upx;
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
	}
	.loginBtnXj{
		width: 100%;
		height: 50px;
		background: linear-gradient(45deg, rgba(23, 54, 211, 0.5), rgba(45, 80, 193, 0.5));
		border-radius: 50upx;
		margin-top: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #00DEFF;
        border: 1px solid rgba(26, 225, 255, 0.5);
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
		bottom: -100px;
		width: 60%;
		margin-left: 15%;
	}
	.loading{
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0,0,0,0.2);
		width: 100%;
		height: 100%;
		z-index: 999;
	}
	.loadBox{
		width: 90%;
		height: 100px;
		background: #fff;
		border-radius: 10px;
		position: absolute;
		top: 35%;
		left: 5%;
	}
	.loadName{
		color: #333;
		text-align: center;
		font-size: 16px;
		margin: 20px 0;
	}
	.loadItem{
		width: 80%;
		margin: 10px 10%;
		height: 10px;
		background: #eee;
		border-radius: 50px;
		overflow: hidden;
	}
	.load{
		width: 0%;
		height: 10px;
		background: #172f87;
		border-radius: 50px;
	}
</style>