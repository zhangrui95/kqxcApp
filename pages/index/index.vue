<template>
	<view class="box">
		<view class="warnTop">
			提示：<text>有{{errorNum}}个矿区巡检逾期</text><text>，{{warnNum}}个矿区需要2日内巡检</text>。 
		</view>
		<view class="listBox">
			<uni-list v-for="(item,index) in list">
			    <uni-list-item :show-arrow="false" @click="goDetail(item)">
					<view class="listTitle"><text>{{item.mc}}</text>
					<uni-tag v-if="item.zt" :text="item.zt === 'error' ? '巡检逾期' : item.zt === 'warning' ? '2日内巡检' : ''" :type="item.zt"></uni-tag>
				</view>
					<view class="msgBox"> 
						<text class="leftBox">上次巡查：{{item && item.dk_sj ? item.dk_sj : ''}}</text>
						<text class="rightBox">巡查人：{{item && item.xm ? item.xm : ''}}</text>
					</view>
					<view class="msgBox"> 
						<text class="leftBox">巡查结果：<text :style="{color:item&&item.kczt_dm === '02' ? '#747474' : '#2de17e'}">{{item && item.kczt_dm ? item.kczt_dm === '02' ? '未开采' : '开采中' : ''}}</text></text>
						<text class="rightBox">矿山状态：
							<text :style="{color:item&&item.yczt_dm === '02' ? '#747474' : '#ee4c26'}">{{item && item.yczt_dm ? item.yczt_dm === '02' ? '无异常' : '有异常' : ''}}</text>
							<text style="margin-left: 5px;"> {{item && item.yj_zp &&item.jj_zp  ?
							(item.yj_zp.split('#') && item.yj_zp.split('#').length > 0 ? item.yj_zp.split('#').length : 0) + 
							(item.jj_zp.split('#')&&item.jj_zp.split('#').length > 0 ? item.jj_zp.split('#').length : 0) : 0}}照片</text>
						</text>
					</view>
					<view class="msgBox"> 
						<text class="bzBox">备注：{{item && item.bz ? item.bz : ''}}</text>
					</view>
				</uni-list-item>
				<!-- <uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>巫山矿山</text><uni-tag text="2日内巡检" type='warning'></uni-tag></view>
					<view class="msgBox">
						<text class="leftBox">上次巡查：2019年12月10日 11:56</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text style="color: #ee4c26;">有异常</text><text style="margin-left: 5px;">8照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="false" @click="goDetail('卢山矿山')">
					<view class="listTitle"><text>卢山矿山</text><uni-tag text="2日内巡检" type='warning'></uni-tag></view>
					<view class="msgBox">
						<text class="leftBox">上次巡查：2019年12月10日 11:56</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text style="color: #2de17e;">开采中</text></text>
						<text class="rightBox">矿山状态：<text>无异常</text><text style="margin-left: 5px;">5照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注，需场人填写备注，需场人填写备注，需场人填写备注，需场人填写备注。</text>
					</view>
				</uni-list-item> -->
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
	import {getKsData,setKsData,getConfig,getXjData,setXjData,getWtData,setWtData,getUsersData,setUsersData,setKsAllData} from '../common/env.js'
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
				errorNum:0,
				warnNum:0,
				today:moment().format('YYYY-MM-DD'),
			}
		},
		onLoad(){
			getConfig('select * from config',(data)=>{
				if(data && data[0] && data[0].xj_jzrq){
					let startTime = data[0].xj_jzrq;
					let today = moment().format('YYYY-MM-DD');
					let daysNum = Math.ceil((moment(today).diff(startTime, 'days') + 1) / (data[0].xj_zq ? data[0].xj_zq : 7)) - 1; 
					console.log('daysNum',daysNum)
					let start =  moment(startTime).add(daysNum*(data[0].xj_zq ? data[0].xj_zq : 7),'day').format('YYYY-MM-DD');
					let end =  moment(start).add(data[0].xj_zq-1,'day').format('YYYY-MM-DD');
					let oldStart = moment(startTime).add((daysNum - 1)*(data[0].xj_zq ? data[0].xj_zq : 7),'day').format('YYYY-MM-DD');
					let oldEnd =  moment(oldStart).add(data[0].xj_zq ? data[0].xj_zq - 1 : 6,'day').format('YYYY-MM-DD');
					this.start = start;
					this.end = end;
					this.oldStart = oldStart;
					this.oldEnd = oldEnd;
					
				}
			});
			let that = this;
			uni.getNetworkType({
			    success: function (res) {
			        console.log(res.networkType);
					if(res.networkType !== 'none'){
						that.network = true;
						that.getKs();
						that.getKsAll();
						that.getXj();
						that.getWt();
						that.getYh();
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
		onReady() {
			uni.setNavigationBarTitle({
			    title: '矿山 ' + moment().format('YYYY.MM.DD') 
			});
		},
		methods: {
			goDetail: function(e) {
				console.log('e',e);
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
							uni.hideLoading();
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
							uni.hideLoading();
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
 C.xm,
 B.dk_sj,
 B.kczt_dm,
 B.yczt_dm,
 B.jj_zp,
 B.yj_zp,
 B.bz
FROM
 ksData A 
 LEFT JOIN (SELECT * FROM xjData WHERE users_id = '${getApp().globalData.uid}' AND dk_sj >= '${this.start} 00:00:00' ORDER BY dk_sj DESC) B ON A.id = B.ks_id
 LEFT JOIN usersData C ON B.users_id = C.id
ORDER BY A.id,B.dk_sj desc`,(data)=>{
					let hash = {}; 
					const data2 = data.reduce((preVal, curVal) => {
					    hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal); 
					    return preVal 
					}, [])
					console.log('data2',data2);
					this.errorNum=0;
					this.warnNum=0;
					data2.map((event)=>{
						console.log('this.end',this.end)
						let day = moment(this.end).diff(moment(event.dk_sj),'day');
						if(day < 3){
							event.zt = 'error';
							this.errorNum = this.errorNum + 1;
						}else if(day < 5){
							event.zt = 'warning';
							this.warnNum = this.warnNum + 1;
						}else{
							event.zt = '';
						}
					})
					this.list = data2;
					console.log('list??????',list);
					this.list = list;
					uni.hideLoading(); 
				});
			},
			// getListXj:function(){
			// 	let list = this.list;
			// 	console.log('!!!!!!!!!!!执行!!!!!!!!!!!',this.list);
			// 	let xjList = {};
			// 	list.map((item)=>{
			// 		getXjData(`SELECT A.*, B.xm, C.mc FROM xjData A LEFT JOIN usersData B ON A.users_id = B.id LEFT JOIN ksData C ON A.ks_id = C.id WHERE A.ks_id = '${item.id}' ORDER BY dk_sj DESC`,(data)=>{
			// 			console.log('巡检记录======================callback====================>',data)
			// 			item = data[0];
			// 		});
			// 		console.log('xjList~~~~~~~~~~~~~~~~~',xjList)
			// 		this.xjList = xjList;
			// 	});
			// },
			getListYh:function(){
				getUsersData('select * from usersData',(data)=>{
					this.yhList = data;
					uni.hideLoading();
				});
			},	
			getListWt:function(){
				getWtData('select * from wtData',(data)=>{
					this.wtList = data;
					uni.hideLoading();
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
								// this.getListXj();
							});
							uni.hideLoading();
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
						  uni.hideLoading();
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
						 uni.hideLoading();
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
