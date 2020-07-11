<template>
	<view class="box">
		<view class="warnTop" v-if="errorNum > 0 || warnNum > 0">
			提示：<text v-if="errorNum > 0">有{{errorNum}}个矿区巡检逾期</text>
			<text v-if="errorNum > 0 && warnNum > 0">，</text>
			<text v-if="warnNum > 0">{{warnNum}}个矿区需要2日内巡检</text>。 
		</view>
		<view class="listBox" :style="{marginTop:errorNum > 0 || warnNum > 0 ? '30' : '0' + 'px'}">
			<uni-list v-for="(item,index) in list">
			    <uni-list-item :show-arrow="false" @click="goDetail(item)">
					<view class="listTitle"><text>{{item.mc}}</text>
					<uni-tag v-if="item.zt" :text="item.zt === 'error' ? '巡检逾期' : item.zt === 'warning' ? '2日内巡检' : ''" :type="item.zt"></uni-tag>
				</view>
					<view class="msgBox"> 
						<text class="leftBox">上次巡查：{{item && item.dk_sj ? item.dk_sj : '暂无'}}</text>
						<text class="rightBox">巡查人：{{item && item.xm ? item.xm : '暂无'}}</text>
					</view>
					<view class="msgBox"> 
						<text class="leftBox">巡查结果：<text :style="{color:item&&item.kczt_dm === '01' ? '#2de17e' : '#747474'}">{{item && item.kczt_dm ? item.kczt_dm === '02' ? '未开采' : '开采中' : '暂无'}}</text></text>
						<text class="rightBox">矿山状态：
							<text :style="{color:item&&item.yczt_dm === '01' ? '#ee4c26' : '#747474'}">{{item && item.yczt_dm ? item.yczt_dm === '02' ? '无异常' : '有异常' : '暂无'}}</text>
							<text style="margin-left: 5px;"> {{item && item.yj_zp &&item.jj_zp  ?
							(item.yj_zp.split('#') && item.yj_zp.split('#').length > 0 ? item.yj_zp.split('#').length : 0) + 
							(item.jj_zp.split('#')&&item.jj_zp.split('#').length > 0 ? item.jj_zp.split('#').length : 0) : 0}}照片</text>
						</text>
					</view>
					<view class="msgBox"> 
						<text class="bzBox">备注：{{item && item.bz ? item.bz : ''}}</text>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<tabBar :pagePath="'/pages/index/index'"></tabBar>
	</view>
</template>

<script>
	import moment from 'moment';
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import {deleteUpLoad,getXjDataUpLoad,getKsData,setKsData,getConfig,getXjData,setXjData,getWtData,setWtData,getUsersData,setUsersData,setKsAllData,setXjAllData} from '../common/env.js'
	export default {
		data() {
			return {
				time: moment().format('YYYY.MM.DD'),
				list:[],
				network:false, 
				start:'',
				end:'',
				oldStart:'',
				oldEnd:'',
				wtList:[],
				yhList:[],
				xjList:[],
				imgsNet:[],
				imgsJNet:[],
				errorNum:0,
				warnNum:0,
				today:moment().format('YYYY-MM-DD'),
				xj_jg:'2',//时间间隔
				xj_pc:'2',//打卡次数
				xj_zq:'7',//周期
			}
		},
		onLoad(){
			getConfig('select * from config',(data)=>{
				if(data && data[0] && data[0].xj_jzrq){
					let startTime = data[0].xj_jzrq;
					let today = moment().format('YYYY-MM-DD');
					let daysNum = Math.ceil((moment(today).diff(startTime, 'days') + 1) / (data[0].xj_zq ? data[0].xj_zq : 7)) - 1; 
					let start =  moment(startTime).add(daysNum*(data[0].xj_zq ? data[0].xj_zq : 7),'day').format('YYYY-MM-DD');
					let end =  moment(start).add(data[0].xj_zq-1,'day').format('YYYY-MM-DD');
					let oldStart = moment(startTime).add((daysNum - 1)*(data[0].xj_zq ? data[0].xj_zq : 7),'day').format('YYYY-MM-DD');
					let oldEnd =  moment(oldStart).add(data[0].xj_zq ? data[0].xj_zq - 1 : 6,'day').format('YYYY-MM-DD');
					this.start = start;
					this.end = end;
					this.oldStart = oldStart;
					this.oldEnd = oldEnd;
					this.xj_jg = data[0].xj_jg;
					this.xj_pc = data[0].xj_pc;
					this.xj_zq = data[0].xj_zq;
				}
			});
			let that = this;
			uni.getNetworkType({
			    success: function (res) {
					if(res.networkType !== 'none'){
						that.network = true;
						that.getUpload(()=>{
							that.getXj();
							that.getAllXj();
							that.getWt();
							that.getYh();
							that.getKs();
							that.getKsAll();
						});
					}else{
						that.network = false; 
						that.getListKs();
						// that.getListXj();
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
		},
		onShow() {
			this.getListKs();
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: '矿山 ' + moment().format('YYYY.MM.DD') 
			});
		},
		methods: {
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
							 			that.imgsNet = imgsNet;
							 		}
							 	});
							 });
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
							 			that.imgsJNet = imgsJNet;
							 		}
							 	});
							 }); 
							 setTimeout(()=>{
								 item.jj_zp_net = that.imgsNet.join('#');
								 item.yj_zp_net = that.imgsJNet.join('#');
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
										 console.log('待上传上传',res.data);
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
							 },1000)
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
				 B.yj_zp,
				 B.bz
				FROM
				 ksData A 
				 LEFT JOIN (SELECT * FROM xjData WHERE users_id = '${getApp().globalData.uid}' AND dk_sj >= '${this.oldStart} 00:00:00' ORDER BY dk_sj DESC) B ON A.id = B.ks_id
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
						let oldList = data1.filter(item=> (item.id === event.id) && (item.dk_sj < this.oldEnd + '23:59:59'));
						let nowList = data1.filter(item=> (item.id === event.id) && (item.dk_sj > this.start + '00:00:00'));
						let day = moment(this.end).diff(moment(event.dk_sj),'day');
						// console.log('nowList',nowList);
						if(nowList&&nowList.length > 0){
							if(day < (parseInt(this.xj_jg) + 1)){
								event.zt = 'error';
								this.errorNum = this.errorNum + 1;
							}else if(day < (parseInt(this.xj_zq) - parseInt(this.xj_jg)*parseInt(this.xj_pc))){
								event.zt = 'warning';
								this.warnNum = this.warnNum + 1;
							}else{
								event.zt = '';
							}
						}else{
							if(oldList.length >= this.xj_pc){
								event.zt = '';
							}else if(day < (parseInt(this.xj_zq) - parseInt(this.xj_jg)) ){
								event.zt = 'warning';
								this.warnNum = this.warnNum + 1;
							}else{
								event.zt = 'error';
								this.errorNum = this.errorNum + 1;
							}
						}
					})
					this.list = data2;
					setTimeout(()=>{
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
				    url: getApp().globalData.ip + '/getXjData', //获取下载巡检记录
				    data: {"uid": getApp().globalData.uid},
					method:'POST',
				    success: (res) => {
						if(res.data.data && !res.data.error){
							setXjData(res.data.data,(res)=>{//存巡检记录
							});
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
				    url: getApp().globalData.ip + '/getXjData', //获取下载巡检记录
				    data: {},
					method:'POST',
				    success: (res) => {
						if(res.data.data && !res.data.error){
							setXjAllData(res.data.data,(res)=>{//存巡检记录
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
			getYh:function(){
				uni.showLoading({
				    title: '用户数据同步中…',
					mask:true
				});
				uni.request({
				    url: getApp().globalData.ip + '/getUsersData', //下载用户列表
				    data: {"uid": getApp().globalData.uid},
					method:'POST',
				    success: (res) => {	
						if(res.data.data && !res.data.error){
						 setUsersData(res.data.data,(res)=>{//存用户
						 	this.getListYh();
						 });
						 setTimeout(()=>{
						 	uni.hideLoading();
						 },500);
						} 
				    }
				});
			}
		}
	}
</script>

<style>
	/deep/ .uni-list-item__container:after{
		height: 0!important;
	}
	.uni-list-item__container{
		border: 0!important;
	}
	.uni-list{
		background: #f5f5f5!important;
	}
	.uni-list-item{
		background: #fff;
		margin-bottom: 7px;
	}
	.uni-tag--error{
		float: left;
		background: #f7e8e5!important;
		border: 1px solid #f25b4a!important;
		padding: 0 5px!important;
		height:20px!important;
		line-height: 19px!important;
		/* margin-left: 5px; */
		transform: scale(0.70);
	}
	/deep/ .uni-tag--error .uni-tag-text{
		color: #f25b4a!important;
		font-size: 12px;
	}
	.uni-tag--warning{
		float: left;
		background: #fdf5de!important;
		border: 1px solid #f4bb52!important;
		padding: 0 5px!important;
		height:20px!important;
		line-height: 19px!important;
		/* margin-left: 5px; */
		transform: scale(0.70);
	}
	/deep/ .uni-tag--warning .uni-tag-text{
		color: #f4bb52!important;
		font-size: 12px;
	}
	.leftBox{
		width: 60%;
		float: left;
	}
	.rightBox{
		width: 40%;
		float: left;
	}
	.listTitle{
		color: #000;
		margin-bottom: 4px;
	}
	.listTitle text{
		float: left;
	}
	.msgBox{
		color: #747474;
		font-size: 12px;
		line-height: 20px;
	}
	.bzBox{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		display: block;
		width: 100%;
	}
	.listBox{
		margin-top: 30px;
		margin-bottom: 50px;
		width: 100%;
	}
	.warnTop{
		background: #ffcfc0;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		text-align: center;
		color: #f45619;
		width: 100%;
		position: fixed;
		top: 0px;
		left: 0;
		z-index: 99;
	}
	.header{
		    position: fixed;
		    left: 0;
		    top: 0;
		    width: 100%;
		    height: 44px;
		    height: calc(44px + constant(safe-area-inset-top));
		    height: calc(44px + env(safe-area-inset-top));
		    padding: 7px 10px;
		    padding-top: calc(7px + constant(safe-area-inset-top));
		    padding-top: calc(7px + env(safe-area-inset-top));
		    display: -webkit-box;
		    display: -webkit-flex;
		    display: flex;
		    overflow: hidden;
		    -webkit-box-pack: justify;
		    -webkit-justify-content: space-between;
		    justify-content: space-between;
		    box-sizing: border-box;
		    z-index: 998;
		    color: #fff;
		    background-color: rgb(23, 47, 135);
		    -webkit-transition-property: all;
		    transition-property: all;
	}
	.titleName{
		font-size: 16px;	
        font-weight: 700;
		line-height: 30px;
	}
	.time{
		font-size: 14px;
		margin: 0 7px;
		font-weight: 100;
	}
</style>
