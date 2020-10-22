<template>
	<view class="box">
		<view class="box1" @click="getIndex()">
			<image src='/static/ks.png' class="img1"></image>
			矿山巡查
		</view>
		<view  class="box2" @click="getNotice()">
			<image src='/static/tz.png' class="img1"></image>
			通知通告
			<uni-badge v-if="numTz > 0" :text="numTz" type="error" class="badge"></uni-badge>
		</view>
		<tabBar :pagePath="'/pages/home/home'" :num="num"></tabBar>
	</view>
</template>

<script>
	import moment from 'moment';
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import {deleteUpLoad,getXjDataUpLoad,getKsData,setKsData,getConfig,getXjData,setXjData,getWtData,setWtData,getUsersData,setUsersData,setKsAllData,setXjAllData} from '../common/env.js'
	export default {
		components: {uniNoticeBar},
		data() {
			return {
				time: moment().format('YYYY.MM.DD'),
				newTime: moment().format('HH:mm:ss'),
				list:[],
				network:false, 
				start:'',
				end:'',
				oldStart:'',
				oldEnd:'',
				wtList:[],
				yhList:[],
				xjList:[],
				errorNum:0,
				warnNum:0,
				today:moment().format('YYYY-MM-DD'),
				xj_jg:'2',//时间间隔
				xj_pc:'2',//打卡次数
				xj_zq:'7',//周期
				xj_jg_zz:'2',//时间间隔(组长)
				xj_pc_zz:'2',//打卡次数(组长)
				xj_zq_zz:'30',//周期(组长)
				yj_xq_num:5,//预警星期
				tqyjtt_zz:7,
				tqgjtt_zz:3,
				num:0,
				text:'',
				speed: 30,
				is_zz:getApp().globalData.is_zz,
				textZz:'',
				isOk:false,
				days:2,
				is_notice:'0',
				numTz:0,
			}
		},
		onLoad(){
			getConfig('select * from config',(data)=>{
				if(data && data[0] && data[0].xj_jzrq){
					let startTime = data[0].xj_jzrq;
					let today = moment().format('YYYY-MM-DD');
					let daysNum = Math.ceil((moment(today).diff(startTime, 'days') + 1) / (data[0].xj_zq ? data[0].xj_zq : 7)) - 1; 
					let start =  this.is_zz == '1' ? moment().startOf('month').format("YYYY-MM-DD") : moment(startTime).add(daysNum*(data[0].xj_zq ? data[0].xj_zq : 7),'day').format('YYYY-MM-DD');
					let end =  this.is_zz == '1' ? moment().endOf('month').format("YYYY-MM-DD") : moment(start).add(data[0].xj_zq-1,'day').format('YYYY-MM-DD');
					let oldStart = moment(startTime).add((daysNum - 1)*(data[0].xj_zq ? data[0].xj_zq : 7),'day').format('YYYY-MM-DD');
					let oldEnd =  moment(oldStart).add(data[0].xj_zq ? data[0].xj_zq - 1 : 6,'day').format('YYYY-MM-DD');
					this.start = start;
					this.end = end;
					this.oldStart = oldStart;
					this.oldEnd = oldEnd;
					this.xj_jg = data[0].xj_jg;
					this.xj_pc = data[0].xj_pc;
					this.xj_zq = data[0].xj_zq;
					this.xj_jg_zz = data[0].xj_jg_zz;
					this.xj_pc_zz = data[0].xj_pc_zz;
					this.xj_zq_zz = data[0].xj_zq_zz;
					this.yj_xq_num = data[0].yj_xq_num;
					this.tqyjtt_zz = data[0].tqyjtt_zz;
					this.tqgjtt_zz = data[0].tqgjtt_zz;
					this.days = moment(end).diff(today,'day') + 1;
				}
			});
			if(!getApp().globalData.isLogin){
				getApp().globalData.isLogin = true;
				let that = this;
				uni.getNetworkType({
				    success: function (res) {
						if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
							that.network = true;
							that.getUpload(()=>{
								that.getListYh();
								that.getXj();
								that.getAllXj();
								that.getWt();
								that.getKs();
								that.getKsAll();
							});
						}else{
							that.network = false; 
							that.getListKs();
							that.getListXj();
						}
				    }
				});
				uni.onNetworkStatusChange(function (res) {
					uni.setStorage({
					    key: 'network', 
					    data: res.isConnected,
					    success: function () {}
					});
				});
			}else{
				this.getListKs();
				this.getListXj();
			}
		},
		onShow() {
			this.getListKs();
			this.getListXj();
			let that = this;
			uni.request({
				 url: getApp().globalData.ip + '/getNoticeReceiveList',
				 data: {
					user_id: getApp().globalData.uid,
				},
				 method:'POST',
				 success: (res) => {
					if(res.data&&res.data.totalUnreadCnt){
						that.numTz = res.data.totalUnreadCnt;
					}
				 }
			});
			uni.getStorage({
			    key: 'userData',
			    success: function (res) {
					if(res.data){
						if(JSON.parse(res.data).is_notice){
							that.is_notice = JSON.parse(res.data).is_notice;
						}
					}
				},
			});
			getWtData(` SELECT A.*, B.dz, B.mc, C.xm as wtr_xm, C.lxdh as wtr_lxdh FROM wtData A
			LEFT JOIN ksData B ON A.ks_id = B.id
			LEFT JOIN usersData C ON A.fqr_id = C.id
			WHERE A.bwtr_id = '${getApp().globalData.uid}' ORDER BY A.wt_sj DESC`,(data)=>{
					  this.num = 0;
						data.map((item)=>{
							if(item.wtzt_dm == '01'){
								this.num = this.num + 1;
							}
						})
					});
		},
		methods: {
			getIndex:function(){
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
																				 uni.request({
																					 url: getApp().globalData.ip + '/saveXjData',
																					 data: dataItem,
																					method:'POST',
																					 success: (res) => {
																						 if(res.data.data && !res.data.error){
																							 setTimeout(()=>{
																								uni.hideLoading();
																							 },500)
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
																			},500)
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
							setTimeout(()=>{
								uni.hideLoading();
							},500);
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
							setKsAllData(res.data.data,(res)=>{});
							setTimeout(()=>{
								uni.hideLoading();
							},500);
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
					},500);
				});
			},
			getListYh:function(){
				getUsersData('select * from usersData',(data)=>{
					this.yhList = data;
					setTimeout(()=>{
						uni.hideLoading();
					},500);
				});
			},	
			getListXj:function(){
				if(this.is_zz === '1'){
					getXjData(`SELECT A.*, B.xm, C.mc FROM xjData A LEFT JOIN usersData B ON A.users_id = B.id LEFT JOIN ksData C ON A.ks_id = C.id WHERE A.users_id = '${getApp().globalData.uid}' ORDER BY dk_sj DESC`,(data)=>{
						if(data.length >= this.xj_pc_zz){
							this.isOk=true;
						}
						
						let that = this;
						setTimeout(()=>{
							let text = this.isOk ? '本周期巡检任务您已完成。' : '';
							that.textZz = '当前周期：'+that.start+'~'+that.end+'。' + '当前周期内已巡检'+data.length + '次。'+text;
						},500)
					});
				}
			},	
			getListWt:function(){
				getWtData('select * from wtData',(data)=>{
					this.wtList = data;
					setTimeout(()=>{
						uni.hideLoading();
					},500);
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
							setTimeout(()=>{
								uni.hideLoading();
							},500);
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
							setTimeout(()=>{
								uni.hideLoading();
							},500);
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
						  setTimeout(()=>{
						  	uni.hideLoading();
						  },500);
						} 
				    }
				});
			},
		}
	}
</script>

<style>
	.badge{
		position: absolute;
		top: -8px;
		right: 5px;
	}
	.box1{
		width: 80%;
		height: 120px;
		background: linear-gradient(45deg, #5875ff 0%,#00b7f0 100%);
		color: #fff;
		margin: 100px 10% 50px;
		line-height: 120px;
		border-radius: 10px;
		text-align: center;
		font-size: 28px;
		box-shadow: 0 0 10px #aaa;
	}
	.box2{
		width: 80%;
		height: 120px;
		background: linear-gradient(45deg, #ff5400 0%,#f19049 100%);
		color: #fff;
		margin: 30px 10%;
		line-height: 120px;
		border-radius: 10px;
		text-align: center;
		font-size: 28px;
		box-shadow: 0 0 10px #aaa;
		position: relative;
	}
	.img1{
		width: 70px;
		height: 70px;
		float: left;
		margin: 25px -50px 0 40px;
	}
</style>
