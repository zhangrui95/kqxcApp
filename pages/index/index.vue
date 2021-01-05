<template>
	<view class="box">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#172f87"></uni-segmented-control>
		<view v-if="list&&list.length > 0&&current==0">
			<view class="warnTop">
				<uni-notice-bar @getmore="getMore" showIcon="true" single="true" :text="'当前周期:'+start+'~'+end" backgroundColor="#e6f7ff" color="#2998fe" :showGetMore="true" moreText="查看更多"></uni-notice-bar>
				<!-- <uni-notice-bar v-if="textZz && is_zz=='1'" :speed="speed" scrollable="true" single="true" :text="textZz" backgroundColor="#e6f7ff" color="#2998fe"></uni-notice-bar> -->
			</view>
			<view class="listBox" :style="{marginTop:'80px'}">  
				<uni-list v-for="(item,index) in list">
				    <uni-list-item :show-arrow="false" @click="goDetail(item)">
						<view class="listTitle"><text :style="{color: item.zt === 'error' || item.zt === 'errors' ? '#f45619' : item.zt === 'warning' || item.zt === 'warnings' ? 'rgb(222, 140, 23)' : ' #000'}">{{item.mc}}</text>
						<uni-tag v-if="item.zt && is_zz!='1'" :text="item.zt === 'error' || item.zt === 'warning' || item.zt === 'primary' ? '还需巡检一次': item.zt === 'errors' || item.zt === 'warnings' || item.zt === 'primarys' ? '还需巡检两次' : item.zt === 'success' ? '巡检已完成' : ''" :type="item.zt == 'primarys' ? 'primary' :item.zt == 'warnings' ? 'warning':item.zt == 'errors' ? 'error'  : item.zt"></uni-tag>
						<uni-tag v-if="item.zt && is_zz=='1'" :text="item.num == 0 ? '待巡检': '已巡检'+item.num+'次'" :type="item.zt"></uni-tag>
					</view>
					<view class="msgBox">需要对周边进行地毯式巡查</view>
						<view class="msgBox">
							<text class="leftBox">最近巡查：{{item && item.dk_sj ? item.dk_sj : '暂无'}}</text>
							<text class="rightBox">巡查人：{{item && item.xm ? item.xm : '暂无'}}</text>
						</view>
						<view class="msgBox"> 
							<!-- <text class="leftBox">巡查结果：<text :style="{color:item&&item.kczt_dm === '01' ? '#747474' : '#747474'}">{{item && item.kczt_dm ? item.kczt_dm === '02' ? '未开采' : '开采中' : '暂无'}}</text></text> -->
							<text class="bzBox">巡查结果：
								<text :style="{color:item&&item.yczt_dm === '01' ? '#ee4c26' : '#747474'}">{{item && item.yczt_dm ? item.yczt_dm === '02' ? '未发现异常' : '发现异常' : '暂无'}}</text>
								<text style="margin-left: 5px;"> {{item &&item.jj_zp  ?
								(item.jj_zp.split('#')&&item.jj_zp.split('#').length > 0 ? item.jj_zp.split('#').length : 0) : 0}}张照片</text>
							</text>
						</view>
						<view class="msgBox" v-if="item && item.bz"> 
							<text class="bzBox">备注：{{item && item.bz ? item.bz : ''}}</text>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
		</view>
		<view v-if="noList&&current==0">
			<view class="ksxjBox" @click="goXc()">
				<view class="ksxjName">马上巡查</view>
				<!-- <view>{{newTime}}</view> -->
			</view>
			<view class="ckBtn" @click="getList()" >查看巡查记录 <text class="jtRight">>></text></view>
			<view class="ycBtn" @click="goXc('01')" >异常反馈 <text class="jtRight">>></text></view>
		</view>
		<map class="" v-if="current==1" class="mapStyle" :style="{height:height+ 'px'}" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap='detailShow' @labeltap='detailShow'></map>
		<!-- <tabBar :pagePath="'/pages/index/index'" :num="num"></tabBar> -->
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
				noList:false,
				items: ['列表展示','地图展示'],
				current: 0,
				height:0,
				latitude: '',
				longitude: '',
				covers: []
			}
		},
		onLoad: function () { //isLxLogin
			uni.showLoading({
				title: '加载中…',
				mask:true
			});
			setInterval(()=>{
				this.newTime = moment().format('HH:mm:ss')
			},500);
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
			 this.getLatlng();
		},
		onHide() {
			clearInterval(this.time);
		},
		onShow() {
			this.time = setInterval(()=>{
				this.getLatlng();
			}, 3000);
			this.getListKs();
			this.getListXj();
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
		onReady() {
			uni.setNavigationBarTitle({
			    title: '矿山 ' + moment().format('YYYY.MM.DD') 
			});
		},
		methods: {
			detailShow:function(e){
				let index = this.covers.findIndex((item)=>{
					return item.id === e.detail.markerId
				})
				this.goDetail();
			},
			onClickItem:function(e) {
			   if (this.current !== e.currentIndex) {
				   this.current = e.currentIndex;
			   }
			   let that = this;
			   if(e.currentIndex == 1){
				   uni.getSystemInfo({
						success:function(res) {
							that.height = res.windowHeight - 50;
						}
				   });
			   }
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
				 A.ms,
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
						event.pxName = event.mc.split('号')[0];
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
					this.list = data2.sort((a, b) => a.pxName- b.pxName);
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
					this.noList = !(this.list&&this.list.length > 0);
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
			async getLatlng() {
				let that = this;
				let covers = [];
				let getLatlngOnline = ()=>{
					return new Promise((resolve, reject)=>{
						uni.getLocation({
							type: 'gcj02',
							success: (res)=> {
								resolve({lat: res.latitude, lng: res.longitude,isline:true})
							},
							fail: (error)=> {
								uni.showToast({
									title: '当前位置获取失败,请检查GPS是否打开',
									duration: 2000,
									icon: 'none'
								});
								reject();
							}
						});
					});
				}
				let getLatlngOffline = ()=>{
					return new Promise((resolve, reject)=>{
						plus.geolocation.getCurrentPosition((res)=>{
							resolve({lat: res.coords.latitude, lng: res.coords.longitude,isline:false});
						}, (error)=>{
							uni.showToast({
								title: error.message,
								duration: 2000,
								icon: 'none'
							});
							reject();
						},{provider:'system'});
					});
				}
				return new Promise((resolve, reject)=>{
					uni.getNetworkType({
						success: async ({networkType})=>{
							try{
								let coord = networkType === 'none'?await getLatlngOffline():await getLatlngOnline();
								if(coord.isline){
									let coord84 = this.gcj02towgs84(coord.lng,coord.lat);
									that.longitude = coord.lng;
									that.latitude = coord.lat;
									covers.push({
										latitude: coord.lat,
										longitude: coord.lng,
										iconPath: '/static/gps1.png'
									});
									that.list.map((item)=>{
										 let gps = that.transform(Number(item.jd),Number(item.wd));
										 covers.push({
											latitude: gps[1],
											longitude: gps[0],
											iconPath: item.zt == 'error' || item.zt == 'errors' ? '/static/map3.png' : item.zt == 'warnings' || item.zt == 'warning' ? '/static/map3.png' : '/static/map1.png',
											label:{content:item.mc},
											id:item.id,
										 });
									});
									that.covers = covers;
								}else{
									let coord02 = this.transform(coord.lng,coord.lat);
									that.longitude = coord02[0];
									that.latitude = coord02[1];
									covers.push({
										latitude: coord02[1],
										longitude: coord02[0],
										iconPath: '/static/gps1.png'
									});
									that.list.map((item)=>{
										 let gps = that.transform(Number(item.jd),Number(item.wd));
										 covers.push({
											latitude: gps[1],
											longitude:gps[0],
											iconPath: item.zt == 'error' || item.zt == 'errors' ? '/static/map3.png' : item.zt == 'warnings' || item.zt == 'warning' ? '/static/map3.png' : '/static/map1.png',
											label:{content:item.mc},
											id:item.id,
										 });
									});
									that.covers = covers;
								}
								resolve(coord);
							}catch(_){
								reject();
							}
						}
					})
				});
			},
			transform(lon, lat){
			        const pi = 3.1415926535897932384626;
			        const a = 6378245.0;
			        const ee = 0.00669342162296594323;
			
			        let dLat = this.transformLat(lon - 105.0, lat - 35.0);
			        let dLon = this.transformLon(lon - 105.0, lat - 35.0);
			
			        const radLat = (lat / 180.0) * pi;
			        let magic = Math.sin(radLat);
			        magic = 1 - ee * magic * magic;
			        const sqrtMagic = Math.sqrt(magic);
			
			        dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi);
			        dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);
			
			        const mgLat = lat + dLat;
			        const mgLon = lon + dLon;
			
			        return [mgLon, mgLat];
			},
			transformLat(x, y) {
					const pi = 3.1415926535897932384626;
					let ret =
						-100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
					ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
					ret += ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0;
					ret +=
						((160.0 * Math.sin((y / 12.0) * pi) + 320.0 * Math.sin((y * pi) / 30.0)) * 2.0) / 3.0;
					return ret;
			},
			transformLon(x, y){
					const pi = 3.1415926535897932384626;
					let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
					ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
					ret += ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0;
					ret +=
						((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x * pi) / 30.0)) * 2.0) / 3.0;
					return ret;
			},
			gcj02towgs84(lng, lat){
				        const PI = 3.1415926535897932384626;
				        const a = 6378245.0;
				        const ee = 0.00669342162296594323;
				        let dlat = this.transformLat(lng - 105.0, lat - 35.0);
				        let dlng = this.transformLon(lng - 105.0, lat - 35.0);
				        let radlat = (lat / 180.0) * PI;
				        let magic = Math.sin(radlat);
				        magic = 1 - ee * magic * magic;
				        const sqrtmagic = Math.sqrt(magic);
				        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
				        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
				        let mglat = lat + dlat;
				        let mglng = lng + dlng;
				        return [lng * 2 - mglng, lat * 2 - mglat];
			}
		}
	}
</script>

<style>
	.mapStyle{
		width: 100%;
		margin-top: 50px;
	}
	.ckBtn{
		color: #0087ff;
		font-size: 18px;
		text-align: center;
		width: 100%;
		height: 30px;
		line-height: 30px;
		position: relative;
		top: 200px;
	}
	.ycBtn{
		color: #F45151;
		font-size: 18px;
		text-align: center;
		width: 100%;
		height: 40px;
		line-height:40px;
		position: relative;
		top: 200px;
	}
	.jtRight{
		font-family: '宋体';
		margin-left: 5px;
	}
	.ksxjBox{
		width: 180px; 
		height: 180px;
		border-radius: 200px;
		background:linear-gradient(to bottom, #04a4fa 0%,#0089ff 100%);
		color: #fff;
		position: relative;
		top: 150px;
		margin-left: 50%;
		left: -90px;
		text-align: center;
		box-shadow: 0 0 10px #999;
		line-height: 180px;
	}
	.ksxjName{
		/* padding-top: 60px; */
		font-size: 28px;
	}
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
		/* background: linear-gradient(left,#f6ffed,#fff,#fff); */
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
	.uni-tag--primary{
		float: left;
		background: #e6f7ff!important;
		border: 1px solid #2db7f5!important;
		padding: 0 5px!important;
		height:20px!important;
		line-height: 19px!important;
		/* margin-left: 5px; */
		transform: scale(0.70);
	}
	/deep/ .uni-tag--primary .uni-tag-text{
		color: #2db7f5!important;
		font-size: 12px;
	}
	.uni-tag--success{
		float: left;
		background: #effce3!important;
		border: 1px solid #52c41a!important;
		padding: 0 5px!important;
		height:20px!important;
		line-height: 19px!important;
		/* margin-left: 5px; */
		transform: scale(0.70);
	}
	/deep/ .uni-tag--success .uni-tag-text{
		color: #52c41a!important;
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
		background: #fff;
		height: 30px;
		line-height: 20px;
		overflow: hidden;
		font-size: 12px;
		text-align:left;
		color: #333;
		width: 100%;
		position: fixed;
		top: 50px;
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
	.segmented-control--button{
		height: 50px!important;
	}
	.segmented-control__item--button{
			border-radius: 0!important;
			position: absolute;
			top: 0;
			background: #fff;
			border: none!important;
			height: 50px!important;
			border-bottom: 2px solid #fff!important;
		}
		.segmented-control__item--button--active{
			background: #fff!important;
			border-bottom: 2px solid #1b2f85!important;
		}
		.segmented-control__item--button .segmented-control__text{
			color: #999!important;
			}
		.segmented-control__item--button--active .segmented-control__text{
			color: #1b2f85!important;
			}
		.segmented-control{
			width:100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;
		}
</style>
