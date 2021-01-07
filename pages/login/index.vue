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
	import {openComDB,dropSQL,setConfig,setUsersData,getUsersData,setUsersAllData,getUsersAllData,deleteUpLoad,getXjDataUpLoad,getKsData,setKsData,getConfig,getXjData,setXjData,getWtData,setWtData,setKsAllData,setXjAllData} from '../common/env.js'
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
									// console.log('==执行==')
									uni.request({
									    url: getApp().globalData.ip + '/getConfig', 
									    data: {},
										method:'POST',
									    success: (res) => {
											// console.log('dataRes',dataRes);
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
								// console.log('getConfig===========>',res.data); 
								if(res.data.data && !res.data.error){
									setConfig(res.data.data);
									getApp().globalData.weedIp = res.data.data.zp_base;
									getApp().globalData.httpImg = res.data.data.zp_pub;
									// console.log('getApp().globalData.version < res.data.data.last_version',that.toNum(getApp().globalData.version) < that.toNum(res.data.data.last_version),that.toNum(getApp().globalData.version) , that.toNum(res.data.data.last_version))
									if(res.data.data.must_update === '1' && (that.toNum(getApp().globalData.version) < that.toNum(res.data.data.last_version))){
										uni.showModal({
										    title: '检测到新版本v'+res.data.data.last_version+'，与旧版本v'+getApp().globalData.version+'不兼容，请更新后使用。',
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
																uni.removeStorageSync('workHeight');
																uni.removeStorageSync('homeHeight');
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
						// console.log('删除成功回调')
					}, function ( e ) {
						alert( e.message );
					} );
				});
				let dirPath1 = '_doc'+getApp().globalData.version+'/kqxjList.db-journal';
				plus.io.resolveLocalFileSystemURL(dirPath1, function(entry) { 
					entry.remove( function ( entry ) {
						// console.log('删除成功回调')
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
						// console.log('res=====>用户',res)
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
			getLoginLx: function(isLogin){
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
									getApp().isLx = isLogin && isLogin == 'isLogin' ?  false : true;
									uni.redirectTo({
									    url: JSON.parse(res.data).is_admin=='1'?'../work/work':'../home/home'
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
					    },
						fail:function (res) { 
							uni.showToast({
								title:'首次登陆请连接互联网',
								icon:'none',
							});
						}
				});
			},
			formSubmit: function(e) {
				// console.log('e.detail.value',e.detail.value);
				let value = e.detail.value;
				let that = this;
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
									getApp().globalData.qh_dm = res.data.data.qh_dm || '';
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
									that.getUpload(()=>{
										that.getAllXj();
										that.getXj();
										that.getWt();
										that.getKs();
										that.getKsAll();
									});
									uni.setStorage({
									    key: 'user',
									    data: JSON.stringify(res.data.data),
									    success: function () {
											getApp().isLx = false;
									       uni.redirectTo({
									           url: res.data.data.is_admin == 1 ?'../work/work' : '../home/home'
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
						this.getLoginLx('isLogin');
					}
				}else{
					uni.showToast({
						title:'用户名及密码不能为空',
						icon:'none',
					});
				}
				
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
			},
			getDsc:function(){
				uni.navigateTo({
					url:'../upload/upload',
				}) 
			},
			getWtPage:function(){
				uni.navigateTo({
					url:'../entrust/entrust',
				}) 
			},
			getIndex:function(isLx){
				getApp().isLx = isLx;
				uni.navigateTo({
					url:'../index/index',
				}) 
			},
			getNotice:function(){
				let that = this;
				uni.navigateTo({
					url:that.is_notice==='1' ? '../notice/notice' : '../receivedNotice/receivedNotice',
				}) 
			},
			getList:function(){
				uni.navigateTo({
					url:'../inspectionList/inspectionList',
				}) 
			},
			myMessage:function(){
				uni.navigateTo({
				    url: '../myMessage/myMessage'
				});
			},
			getMore:function(){
				uni.showModal({
				    content: this.is_zz === '1' ? this.textZz : this.text,
					showCancel:false,
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			goXc:function(is_yczt){
				uni.navigateTo({
				    url: is_yczt ? '../inspectionXc/inspectionXc?is_yczt=' + is_yczt : '../inspectionXc/inspectionXc' ,
				});
			},
			getUpload:function(callback){
				let that = this;
				getXjDataUpLoad(`SELECT
				 A.*,
				 B.xm,
				 C.mc,
				 D.xm as fzr_xm
				FROM
				 xjDataUpLoad A
				 LEFT JOIN usersData B ON A.users_id = B.id
				 LEFT JOIN ksData C ON A.ks_id = C.id
				 LEFT JOIN usersData D ON C.fzr_id = D.id
				ORDER BY
				 dk_sj DESC`,(data)=>{
					// console.log('待上传======================callback====================>',data)
					if(data.length > 0){
						uni.showLoading({
						    title: '数据上传中…',
							mask:true 
						});
						 data.map((item)=>{
							 let imgsJNet = []; 
							 let imgsNet = [];
							  let videoNet = [];
							 // console.log('------------图【item.yj_zp】------------',item.yj_zp,item.yj_zp.split('#'));
							 // console.log('------------图【item.jj_zp】------------',item.jj_zp,item.jj_zp.split('#'));
							 item.yj_zp.split('#').map((e)=>{
							 	uni.uploadFile({
							 		url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
							 		filePath: e,
							 		name: 'file',
							 		formData: {
							 		    'user': 'test'
							 		},
							 		success: (uploadFileRes) => {
							 			// console.log('uploadFileRes.data',uploadFileRes.data,JSON.parse(uploadFileRes.data).fileUrl);
										// console.log('======图一转行【JSON.parse(uploadFileRes.data).fileUrl】======',JSON.parse(uploadFileRes.data).fileUrl)
							 			imgsNet.push(JSON.parse(uploadFileRes.data).fileUrl);
										if(imgsNet.length === item.yj_zp.split('#').length){
											item.jj_zp.split('#').map((e)=>{
											 	uni.uploadFile({
											 		url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
											 		filePath: e,
											 		name: 'file',
											 		formData: {
											 		    'user': 'test'
											 		},
											 		success: (uploadFileRes) => {
														// console.log('======图二转行【JSON.parse(uploadFileRes.data).fileUrl】======',JSON.parse(uploadFileRes.data).fileUrl)
											 			imgsJNet.push(JSON.parse(uploadFileRes.data).fileUrl);
														if(imgsJNet.length === item.jj_zp.split('#').length){
															item.dsp.split('#').map((e)=>{
																uni.uploadFile({
																	url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
																	filePath: e,
																	name: 'file',
																	formData: {
																		'user': 'test'
																	},
																	success: (uploadFileRes) => {
																		// console.log('======图二转行【JSON.parse(uploadFileRes.data).fileUrl】======',JSON.parse(uploadFileRes.data).fileUrl)
																		videoNet.push(JSON.parse(uploadFileRes.data).fileUrl);
																		if(videoNet.length === item.dsp.split('#').length){
																			setTimeout(()=>{
																				 item.jj_zp_net = imgsJNet.join('#');
																				 item.yj_zp_net = imgsNet.join('#');
																				 item.dsp_net = item.dsp&&videoNet&&videoNet.length > 0 ? videoNet.join('#') : '';
																				 // console.log('item.jj_zp_net,item.yj_zp_net',item.jj_zp_net,item.yj_zp_net);
																				 // console.log('item==========>',item);
																				 let uidId = item.users_id;
																				 let {users_id, ...dataItem} = item;
																				 dataItem.uid = uidId;
																				 dataItem.sc_sj = moment().format('YYYY-MM-DD HH:mm:ss');
																				 uni.request({
																					 url: getApp().globalData.ip + '/saveXjData',
																					 data: dataItem,
																					method:'POST',
																					 success: (res) => {
																						 if(res.data.data && !res.data.error){
																							 setXjAllData([dataItem],(res)=>{});
																							 setXjData([dataItem],(res)=>{});
																							 deleteUpLoad(`DELETE FROM xjDataUpLoad WHERE id = '${item.id}'`,(res)=>{
																								// console.log('删除待上传成功',res.error);
																							 });
																							 let idx = that.wtList.findIndex((event)=>{
																								return event.ks_id === item.ks_id;
																							 });
																							 if(idx > -1 && that.wtList[idx].wtzt_dm === '02'){
																								 uni.request({
																									 url: getApp().globalData.ip + '/updateWtData',
																									 data: {"wt_id":that.wtList[idx].id,"wtzt_dm":'04'},
																									method:'POST',
																									 success: (res) => {
																										// console.log('修改委托记录状态',res.data);
																										if(res.data.data && !res.data.error){
																												let dataItem = {"id":that.wtList[idx].id,"ks_id":that.wtList[idx].ks_id,"wt_sj":moment().format('YYYY-MM-DD HH:mm:ss'),"fqr_id":that.wtList[idx].fqr_id,"bwtr_id":that.wtList[idx].bwtr_id,"wtzt_dm":'04',"wtzt_mc":'已巡检'};
																												setWtData([dataItem],(res)=>{});
																										} 
																									 }
																								 });
																							 }
																							 // console.log('巡查成功',res.data);
																						}else{
																								uni.hideLoading();
																						}
																						callback({error:null});
																					}
																				 }); 
																			},1200)
																		}
																	},
																});
															});
														}
											 		}
											 	});
											 }); 
										}
							 		}
							 	});
							 });
						 });
					}else{
						callback({error:null});
					}
				});
			},
			goDetail: function(e) {
				uni.navigateTo({
				    url: '../detailKs/detailKs?record=' + JSON.stringify(e)
				});
			},
			getKs: function() {
				uni.showLoading({
				    title: '矿山数据同步中…',
					mask:true
				});
				uni.request({
				    url: getApp().globalData.ip + '/getKsData', //获取矿山列表
				    data: {uid: getApp().globalData.uid},
					method:'POST',
				    success: (res) => {
						if(res.data.data && !res.data.error){
							getKsData(`DELETE FROM ksData`,(res)=>{});
							setKsData(res.data.data,(res)=>{//存矿山
								this.getListKs();
							});
						} 
				    }
				});
			},
			getKsAll: function(){
				uni.showLoading({
				    title: '矿山数据同步中…',
					mask:true
				});
				uni.request({
				    url: getApp().globalData.ip + '/getKsData', //获取矿山列表
				    data: {uid: ""},
					method:'POST',
				    success: (res) => {
						if(res.data.data && !res.data.error){
							setKsAllData(res.data.data,(res)=>{
								uni.hideLoading();
							});
						} 
				    }
				});
			},
			getListKs:function(){
				getKsData(`SELECT
				 A.id,
				 A.dz,
				 A.jd,
				 A.wd,
				 A.mc,
				 D.xm as fzr_xm,
				 C.xm,
				 B.dk_sj,
				 B.kczt_dm,
				 B.yczt_dm,
				 B.jj_zp,
				 B.dsp,
				 B.yj_zp,
				 B.bz
				FROM
				 ksData A 
				 LEFT JOIN (SELECT * FROM xjData WHERE users_id = '${getApp().globalData.uid}' AND dk_sj >= '${this.start} 00:00:00' ORDER BY dk_sj DESC) B ON A.id = B.ks_id
				 LEFT JOIN usersData C ON B.users_id = C.id
				 LEFT JOIN usersData D ON A.fzr_id = D.id
				ORDER BY A.id,B.dk_sj desc`,(data)=>{
			        let data1 = data;
					let hash = {}; 
					const data2 = data.reduce((preVal, curVal) => {
					    hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal); 
					    return preVal 
					}, [])
					this.errorNum=0;
					this.warnNum=0;
					data2.map((event)=>{
						let nowList = data1.filter(item=>(item.id === event.id) && (moment(item.dk_sj) >= moment(this.start + ' 00:00:00')));
						let day = moment(this.end).diff(moment(event.dk_sj),'day');
						let week = moment().day();
						// let days = moment(nowList[0].dk_sj).diff(nowList[nowList.length - 1].dk_sj,'day');this.xj_pc_zz
						if(this.is_zz == '1'){
							let xjList = data1.filter(event => event.dk_sj);
							let day_zz = moment(this.end).diff(moment(this.today),'day');
							if(xjList && (xjList.length < parseInt(this.xj_pc_zz))){
								if(day_zz <= this.tqgjtt_zz){
									event.zt = 'error';
								}else if(day_zz <= this.tqyjtt_zz){
									event.zt = 'warning';
								}else{
									event.zt = nowList.length === 0 ? 'primary' : 'success';
								}
							}else{
								let days = moment(xjList[xjList.length - 1].dk_sj.substring(0,10)).diff(xjList[0].dk_sj.substring(0,10),'day');
								if(days === 0 && day_zz <= this.tqgjtt_zz){
									event.zt = 'error';
								}else if(days === 0 && day_zz <= this.tqyjtt_zz){ 
									event.zt = 'warning';
								}else{
									event.zt = nowList.length === 0 ? 'primary' : 'success';
								}
							}
							event.num = nowList && nowList.length > 0 ? nowList.length : 0;
						}else{
							if(nowList && (nowList.length < parseInt(this.xj_pc))){
								if(week === 0){
									event.zt = nowList.length === 0 ? 'errors' : 'error';
									this.errorNum = this.errorNum + 1;
								}else if(week >= this.yj_xq_num){
									event.zt = nowList.length === 0 ? 'warnings' :'warning';
									this.warnNum = this.warnNum + 1;
								}else{
									event.zt = nowList.length === 0 ? 'primarys' : 'primary';
								}
							}else{
								let days = moment(nowList[nowList.length - 1].dk_sj.substring(0, 10)).diff(nowList[0].dk_sj.substring(0,10),'day');
								if(days === 0 && week === 0){
									event.zt = 'error';
									this.errorNum = this.errorNum + 1;
								}else if(days === 0 && week >= this.yj_xq_num){
									event.zt = 'warning';
									this.warnNum = this.warnNum + 1;
								}else{
									// console.log('days',days)
									if(days === 0){
										event.zt = 'primary';
									}else{
										event.zt = 'success';
									}
								}
							}
						}
					})
					this.list = data2;
					let isXj = false;
					data2.map((event)=>{
						if(event.dk_sj){
							isXj = true;
						}
					})
					setTimeout(()=>{
						if(this.is_zz != '1'){
							let yqText = this.errorNum > 0 ? `有${this.errorNum}个矿区即将巡检逾期`:``;
							let dh = this.errorNum > 0 && this.warnNum > 0 ? `，`:``;
							let warnText = this.warnNum > 0 ? `${this.warnNum}个矿区需要${this.days}日内巡检` : ``;
							let dh1 = this.errorNum > 0 || this.warnNum > 0 ? `，`:``;
							let isWc = this.errorNum == 0 && this.warnNum == 0 ? isXj ? '暂无巡检告警及巡检预警记录。':'暂无巡查记录，请在当前周期内巡检以免逾期。' : '';
							this.text = `当前周期${this.start}~${this.end}${dh1}${yqText}${dh}${warnText}。${isWc}`;	
						}	
						uni.hideLoading();
					},800);
				});
			},
			// getListYh:function(){
			// 	getUsersData('select * from usersData',(data)=>{
			// 		this.yhList = data;
			// 		setTimeout(()=>{
			// 			uni.hideLoading();
			// 		},1200);
			// 	});
			// },	
			getListWt:function(){
				getWtData('select * from wtData',(data)=>{
					this.wtList = data;
				});
			},
			getXj:function(){
				uni.showLoading({
				    title: '巡检数据同步中…',
					mask:true
				});
				uni.request({
				    url: getApp().globalData.ip + '/getXjData', //获取下载巡查记录
				    data: {"uid": getApp().globalData.uid},
					method:'POST',
				    success: (res) => {
						if(res.data.data && !res.data.error){
							setXjData(res.data.data,(res)=>{});
							if(this.is_zz === '1'){
								if(res.data.data.length >= this.xj_pc_zz){
									this.isOk=true;
								}
								let text = this.isOk ? '本周期巡检任务您已完成。' : '';
								this.textZz = '当前周期：'+this.start+'~'+this.end+'。' + '当前周期内已巡检'+res.data.data.length + '次。' + text;
							}
						} 
				    }
				});
			},
			getAllXj:function(){
				uni.showLoading({
				    title: '巡检数据同步中…',
					mask:true
				});
				uni.request({
				    url: getApp().globalData.ip + '/getXjData', //获取下载巡查记录
				    data: {},
					method:'POST',
				    success: (res) => {
						if(res.data.data && !res.data.error){
							setXjAllData(res.data.data,(res)=>{//存巡查记录
							});
						} 
				    }
				});
			},
			getWt:function(){
				uni.showLoading({
				    title: '委托数据同步中…',
					mask:true
				});
				uni.request({
				    url: getApp().globalData.ip + '/getWtData', //获取委托记录
				    data: {"uid": getApp().globalData.uid},
					method:'POST',
				    success: (res) => {
						if(res.data.data && !res.data.error){
						  setWtData(res.data.data,(res)=>{//存委托
						  	this.getListWt();
						  });
						} 
				    }
				});
			},
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