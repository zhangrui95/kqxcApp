<template>
    <view>
		<view class="pageBody" v-if="!isNet || isLx">
			<uni-notice-bar single="true" :text="isLx ? '您当前处于离线模式，请切换到在线模式访问工作督察模块。' : '无网络，请检查您的网络连接'"></uni-notice-bar>
			<map :style="{height:height + 25+ 'px'}" scale="12" style="width: 100%; position: relative;top: -10px;" :latitude="latitude" :longitude="longitude"></map>
		</view>
		<view class="pageBody" v-if="isNet">
			 <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#172f87"></uni-segmented-control>
			    <view class="page-section page-section-gap" v-if="current === 0">
			    	 <map :style="{height:height+ 'px'}" scale="12" style="width: 100%; position: relative;top: 56px;" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap='listShow' @labeltap='listShow'>
			    		 <cover-view class="kdNumberBoxAll" v-if="current === 0"></cover-view>
			    		 <cover-view class="kdNumberBox" v-if="current === 0"> 风险点：{{kdNum}}个</cover-view>
			    		 <cover-view class="kdNumberBox1" v-if="current === 0">已巡检：{{kdNum - warnNum}}个</cover-view>
			    		 <cover-view class="kdNumberBox2" v-if="week == 0 && current === 0">未巡检：{{warnNum}}个</cover-view>
			    		 <cover-view class="kdNumberBox3" v-if="week !== 0 && current === 0">未巡检：{{warnNum}}个</cover-view>
						 <cover-image src="../../static/beijing.png" class="buttonChartBg"></cover-image>
						 <cover-view class="buttonChart" v-if="current === 0" @click="goChart">统计分析</cover-view>
			    	 </map>
			     </view>
				<view v-if="current === 1" class="listBox">
					<uni-search-bar  @input="input"></uni-search-bar>
					<view v-if="jzList && jzList.length>0 &&!searchValue" class="titleTop">
						<text @click="getBack(item)" v-for="(item,index) in jzList" :style="index+1 === jzList.length ? {color:'#172f87'} : {}">{{item.name}} {{index+1 === jzList.length ? '' : ' > '}} </text>
					</view>
					<uni-list v-if="listZzJg&&listZzJg.length > 0&&!searchValue">
						<uni-list-item v-for="(item) in listZzJg" class="nohover">
							<view class="msgBox" @click="getZzjg(item)">{{item.name}}</view> 
						</uni-list-item>
					</uni-list>
					<view v-if="usersList && usersList.length > 0 && listZzJg.length > 0 &&!searchValue" class="titleTop">成员</view>
					<uni-list v-if="usersList&&usersList.length > 0 &&!searchValue">
						<uni-list-item v-for="(item) in usersList" class="nohover" @click="getList(item.id)">
							<view class="msgBox">{{item.xm}}</view>
						</uni-list-item>
					</uni-list>
					<uni-list v-if="searchValue&&usersListSearch&&usersListSearch.length > 0">
						<uni-list-item v-for="(item) in usersListSearch" class="nohover" @click="getList(item.id)">
							<view class="msgBox">{{item.xm ? item.xm : ''}}({{item.org_name ? item.org_name : ''}})</view>
						</uni-list-item>
					</uni-list>
					 <view class="noList" v-if="(usersList.length == 0 && listZzJg.length == 0 &&!searchValue) || (searchValue && usersListSearch.length==0)"><image src="../../static/noList.png" style="width: 200px;height: 123px;"></image>
				<view>暂无数据</view></view> 
				</view>
				 <view v-if="current === 2" class="listBox">
					<view class="searchTime">
						<view class="time"> 
							<picker :range="searchList" mode="selector" :value="value" @change="bindDateChange" class="timePicker">
									<view class="uni-input">{{searchList[value]}}</view>
									<uni-icons type="arrowdown" size="16" color="#000" class="icon"></uni-icons>
							</picker>  
						</view>
						<view :class="disabled ? 'timeDisabled' : 'time'">
							<picker :disabled="disabled" :range="areaList" mode="selector" :value="value1" @change="bindDateChange1" class="timePicker">
									<view class="uni-input">{{areaList[value1]}}</view>
									<uni-icons type="arrowdown" size="16" :color="disabled ? '#999' : '#000'" class="icon"></uni-icons>
							</picker>  
						</view>
						<view class="pageAll">共{{ksList.length}}条记录</view>
					</view>
				 	<uni-list v-if="ksList&&ksList.length > 0" style="margin-top: 100px;"> 
				 		<uni-list-item v-for="(item) in ksList" class="nohover" @click="getDetail(item)">
				 			<view class="msgBox"><view class="listTitle">{{item.mc}}({{item.dz}})</view> <uni-tag :text="item.zt == 'warning' ? '未巡检' : '已巡检'" :type="item.zt"></uni-tag></view> 
				 		</uni-list-item>
				 	</uni-list>
				 	 <view class="noList" v-if="ksList.length == 0"><image src="../../static/noList.png" style="width: 200px;height: 123px;"></image>
							<view>暂无数据</view></view> 
					 </view>
			 </uni-segmented-control>
		  </view>
		<tabBar :pagePath="'/pages/work/work'" :num="num"></tabBar>
    </view>
</template>

<script>
	import moment from 'moment';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import {getKsAllData,getConfig,getWtData} from '../common/env.js'
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	export default {
		data() {
			 return {
			    id:0, // 使用 marker点击事件 需要填写id
				height:0,
				title: 'map',
				// scale:18,
				latitude: 45.353887,
				longitude: 130.999930,
				covers: [],
				kdNum:0,
				errorNum:0,
				warnNum:0,
				start:'',
				end:'',
				ycId:[],
				num:0,
				yj_xq_num:5,//预警星期
				week:moment().day(),
				yjList:[],
				xj_jg:'2',//时间间隔
				xj_pc:'1',//打卡次数
				xj_zq:'7',//周期
				PI:3.14159265358979324,
				items: ['地图展示','组织架构','矿山列表'],
				current: 0,
				listZzJg:[],
				usersList:[],
				jzList:[],
				usersListSearch:[],
				track_code:'',
				searchValue:'',
				ksList:[],
				searchList:['全部', '未巡检', '已巡检'],
				areaList:['鸡西市','鸡冠区', '恒山区','城子河区','麻山区','滴道区','梨树区','虎林市','密山市','鸡东县'],
				areaCodeList:['2303','230302','230303','230306','230307','230304','230305','230381','230382','230321'],
				value:0,
				value1:0,
				ksListAll:[],
				disabled:false,
				isNet:getApp().isLx ? !getApp().isLx : true,
				isLx:getApp().isLx,
			}
		},
		 components: {
		        uniPopup, 
				uniSearchBar,
		},
		onBackPress:function(event){
			if(this.jzList.length > 1){
				this.jzList.pop();
				this.getZzjg(this.jzList[this.jzList.length - 1],true);
				return true;
			}else{
				return false;
			}
		},
		onLoad() {
			let that = this;
			uni.getSystemInfo({
				success:function(res) {
					if(uni.getSystemInfoSync() && uni.getSystemInfoSync().windowHeight && uni.getSystemInfoSync().windowHeight !== res.windowHeight){
						that.height = uni.getSystemInfoSync().windowHeight - 106;
					}else{
						that.height = uni.getStorageSync('workHeight') ? uni.getStorageSync('workHeight') : res.windowHeight - 106;
					}
					uni.setStorageSync('workHeight', that.height);
				}
			});
			this.value1 = getApp().globalData.qh_dm ? this.areaCodeList.indexOf(getApp().globalData.qh_dm) : 0;
			this.disabled = this.value1 > 0 ? true : false;
			uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
					that.latitude = res.latitude;
					that.longitude = res.longitude;
			    }
			});
			this.getKsMap();
			// getConfig('select * from config',(data)=>{
			// 	if(data && data[0] && data[0].xj_jzrq){
			// 		let startTime = data[0].xj_jzrq;
			// 		let today = moment().format('YYYY-MM-DD');
			// 		let daysNum = Math.ceil((moment(today).diff(startTime, 'days') + 1) / (data[0].xj_zq ? data[0].xj_zq : 7)) - 1; 
			// 		let start =  moment(startTime).add(daysNum*(data[0].xj_zq ? data[0].xj_zq : 7),'day').format('YYYY-MM-DD');
			// 		let end =  moment(start).add(data[0].xj_zq-1,'day').format('YYYY-MM-DD');
			// 		this.start = start;
			// 		this.end = end; 
			// 		this.xj_jg = data[0].xj_jg;
			// 		this.xj_pc = 1;
			// 		this.xj_zq = data[0].xj_zq;
			// 		this.yj_xq_num = data[0].yj_xq_num;
			// 		getKsAllData(`SELECT
			// 		 A.id,
			// 		 A.dz,
			// 		 A.jd,
			// 		 A.wd,
			// 		 A.mc,
			// 		 A.dz_dm,
			// 		 A.visible,
			// 		 D.xm as fzr_xm,
			// 		 C.xm,
			// 		 B.dk_sj,
			// 		 B.kczt_dm,
			// 		 B.yczt_dm,
			// 		 B.jj_zp,
			// 		 B.dsp,
			// 		 B.yj_zp,
			// 		 B.bz
			// 		FROM
			// 		 ksAllData A  
			// 		 LEFT JOIN (SELECT * FROM xjAllData WHERE dk_sj >= '${start} 00:00:00' ORDER BY dk_sj DESC) B ON A.id = B.ks_id
			// 		 LEFT JOIN usersAllData C ON B.users_id = C.id
			// 		 LEFT JOIN usersAllData D ON A.fzr_id = D.id
			// 		 WHERE A.dz_dm LIKE '${getApp().globalData.qh_dm}%' AND A.visible = '0'
			// 		ORDER BY A.id,B.dk_sj desc`,(data)=>{
			// 			 let data1 = data;
			// 			let hash = {}; 
			// 			const data2 = data.reduce((preVal, curVal) => {
			// 			    hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal); 
			// 			    return preVal 
			// 			}, []);
			// 			this.kdNum = data2.length;
			// 			let yjList = [];
			// 			let latitude = 0;
			// 			let longitude = 0;
			// 			let covers = [];
			// 			data2.map((event)=>{
			// 				event.pxName = event.mc.split('号')[0];
			// 				let nowList = data1.filter(item=>(item.id === event.id) && (moment(item.dk_sj) >= moment(this.start + ' 00:00:00')));
			// 				let day = moment(this.end).diff(moment(event.dk_sj),'day');
			// 				let week = moment().day();
			// 				if(nowList&&nowList.length > 0){
			// 					event.zt = 'success'; 
			// 				}else{
			// 					event.zt = 'warning'; 
			// 					this.warnNum = this.warnNum + 1;
			// 				}
			// 				let gps = this.gcj_encrypt(parseFloat(event.wd), parseFloat(event.jd));
			// 				this.ycId.map((res)=>{
			// 					if(res === event.id){
			// 						res.zt_dm = '02';
			// 					}
			// 				});
			// 				covers.push({
			// 					latitude: parseFloat(gps.lat),
			// 					longitude: parseFloat(gps.lon),
			// 					iconPath: event.zt == 'error' || event.zt == 'errors' ? '/static/map3.png' : event.zt == 'warnings' || event.zt == 'warning' ? '/static/map3.png' : '/static/map1.png',
			// 					label:{content:event.mc},
			// 					id:event.id,
			// 				});
			// 				this.yjList = yjList;
			// 			})
			// 			this.ksList = data2.sort((a, b) => a.pxName- b.pxName);
			// 			this.ksListAll = data2.sort((a, b) => a.pxName- b.pxName);
			// 			this.covers = covers;
			// 		});
			// 	}
			// });
			uni.getStorage({
			    key: 'userData',
			    success: function (res) {
					if(res.data){
						if(JSON.parse(res.data).org_id){
							that.getZzjg({id:JSON.parse(res.data).org_id,name:JSON.parse(res.data).org_name || '组织架构'},false);
						}
					}
				},
			});
		},
		onShow() {
			let that = this;
			uni.getNetworkType({
				success: function (res) {
					if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g' && !that.isLx){
						that.isNet = true;
					}else{
						that.isNet = false;
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
		onReady() {
			uni.setNavigationBarTitle({
			    title: !this.isNet || this.isLx ? '工作督查(离线)' : '工作督查'
			});
		},
		methods: {
			getKsMap(){
				let that = this;
				getConfig('select * from config',(data)=>{
					if(data && data[0] && data[0].xj_jzrq){
						let startTime = data[0].xj_jzrq;
						let today = moment().format('YYYY-MM-DD');
						let daysNum = Math.ceil((moment(today).diff(startTime, 'days') + 1) / (data[0].xj_zq ? data[0].xj_zq : 7)) - 1; 
						let start =  moment(startTime).add(daysNum*(data[0].xj_zq ? data[0].xj_zq : 7),'day').format('YYYY-MM-DD');
						let end =  moment(start).add(data[0].xj_zq-1,'day').format('YYYY-MM-DD');
						this.start = start;
						this.end = end; 
						this.xj_jg = data[0].xj_jg;
						this.xj_pc = 1;
						this.xj_zq = data[0].xj_zq;
						this.yj_xq_num = data[0].yj_xq_num;
						uni.getNetworkType({
							success: function (res) {
								if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g' && !that.isLx){
									uni.request({
									    url: getApp().globalData.ip + '/tj/getKsMapData',
									    data: {
										   "dz_dm": getApp().globalData.qh_dm,
										    "kssj": start + " 00:00:00",
										    "jssj": today + " 23:59:59"
										},
										method:'POST',
									    success: (record) => {
											if(record.data&&record.data.data){
												let data2 = record.data.data;
												that.kdNum = record.data.data.length;
												let yjList = [];
												let latitude = 0;
												let longitude = 0;
												let covers = [];
												data2.map((event)=>{
													event.pxName = event.mc.split('号')[0];
													let day = moment(that.end).diff(moment(event.dk_sj),'day');
													let week = moment().day();
													if(event.xj_cnt > 0){
														event.zt = 'success'; 
													}else{
														event.zt = 'warning'; 
														that.warnNum = that.warnNum + 1;
													}
													let gps = that.gcj_encrypt(parseFloat(event.wd), parseFloat(event.jd));
													that.ycId.map((res)=>{
														if(res === event.id){
															res.zt_dm = '02'; 
														}
													});
													covers.push({
														latitude: parseFloat(gps.lat),
														longitude: parseFloat(gps.lon),
														iconPath: event.zt == 'error' || event.zt == 'errors' ? '/static/map3.png' : event.zt == 'warnings' || event.zt == 'warning' ? '/static/map3.png' : '/static/map1.png',
														label:{content:event.mc},
														id:event.id,
													});
													that.yjList = yjList;
												})
												that.ksList = data2.sort((a, b) => a.pxName- b.pxName);
												that.ksListAll = data2.sort((a, b) => a.pxName- b.pxName);
												that.covers = covers;
											}
										},
									});
									that.isNet = true;
								}else{
									that.isNet = false;
								}
							},
						});
					}
				});
			},
			bindDateChange: function(e) {
			   this.value = e.target.value;
			   let zt = e.target.value === 1 ? 'warning' :  e.target.value === 2 ? 'success' : '';
			   let list = this.ksListAll.filter(item => item.zt.indexOf(zt) > -1);
			   this.ksList = list.filter(item => item.dz_dm.indexOf(this.areaCodeList[this.value1]) > -1);
			},
			bindDateChange1: function(e) {
			 this.value1 = e.target.value;
			 let zt = this.value === 1 ? 'warning' :  this.value === 2 ? 'success' : '';
			 let list = this.ksListAll.filter(item => item.dz_dm.indexOf(this.areaCodeList[e.target.value]) > -1);
			 this.ksList = list.filter(item => item.zt.indexOf(zt) > -1);
			},
			input:function(e){
				this.searchValue = e.value;
				if(e.value){
					uni.request({
						 url: getApp().globalData.ip + '/searchUserInOrgTree',
						 data: {
							track_code: this.track_code,
							query_string: e.value
						},
						 method:'POST',
						 success: (res) => {
							 if(res.data && res.data.data){
								 this.usersListSearch = res.data.data;
							 }
						 }
					});
				}else{
					this.usersListSearch = [];
				}
				
			},
			goChart:function(){
				uni.navigateTo({
					url:'../chartsPage/chartsPage',
				})
			},
			getList:function(uid){
				uni.navigateTo({ 
					url:'../inspectionList/inspectionList?uid='+uid,
				}) 
			},
			getBack:function(item){
				let index = this.jzList.findIndex(event=>event.id == item.id);
				if(index > -1){
					this.jzList.splice(index+1,this.jzList.length);
				}
				this.getZzjg(item,true);
			},
			getZzjg:function(item,isUnPush){
				uni.request({
					 url: getApp().globalData.ip + '/getOrgData',
					 data: {
						id:item.id
					},
					 method:'POST',
					 success: (res) => {
						 if(res&&res.data&&res.data.data){
							 this.listZzJg = res.data.data.org ? res.data.data.org : [];
							 this.usersList = res.data.data.users ? res.data.data.users : [];
							 if(!isUnPush){
								 this.jzList.push(item);
							 }
							 let parent = res.data.data.parent ? res.data.data.parent : {};
							 if(parent && parent.track_code){
							 		this.track_code = parent.track_code;
							 }
						 }
					 }
				});
			},
			onClickItem:function(e) {
			           if (this.current !== e.currentIndex) {
			               this.current = e.currentIndex;
						   if(e.currentIndex == 0 || e.currentIndex == 2){
							   this.kdNum=0;
							   this.errorNum=0;
							   this.warnNum=0;
							   this.getKsMap();
						   }
			           }
			       },
			transformLon : function (x, y) {
					var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
					ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
					ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
					ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
					return ret;
				},
				 transformLat : function (x, y) {
						var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
						ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
						ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
						ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
						return ret;
					},
			delta : function (lat, lon) {
				var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
				var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
				var dLat = this.transformLat(lon - 105.0, lat - 35.0);
				var dLon = this.transformLon(lon - 105.0, lat - 35.0);
				var radLat = lat / 180.0 * this.PI;
				var magic = Math.sin(radLat);
				magic = 1 - ee * magic * magic;
				var sqrtMagic = Math.sqrt(magic);
				dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
				dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
				return {'lat': dLat, 'lon': dLon};
			},
			//WGS-84 to GCJ-02
			    gcj_encrypt : function (wgsLat, wgsLon) {
			        if (this.outOfChina(wgsLat, wgsLon))
			            return {'lat': wgsLat, 'lon': wgsLon};
			
			        var d = this.delta(wgsLat, wgsLon);
			        return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
			    },
				 outOfChina : function (lat, lon) {
				        if (lon < 72.004 || lon > 137.8347)
				            return true;
				        if (lat < 0.8293 || lat > 55.8271)
				            return true;
				        return false;
				    },
			listShow:function(e){
				let index = this.covers.findIndex((item)=>{
					return item.id === e.detail.markerId
				})
				uni.navigateTo({
				    url: '../workList/workList?cover='+JSON.stringify(this.covers[index]) + '&kdNum=' + this.kdNum + '&errorNum=' + this.errorNum+ '&warnNum=' + this.warnNum + '&start=' +  this.start+ '&end=' +  this.end
				});
			},
			getDetail:function(event){
				let gps = this.gcj_encrypt(parseFloat(event.wd), parseFloat(event.jd));
				let covers ={latitude: parseFloat(gps.lat),
							longitude: parseFloat(gps.lon),
							iconPath: event.zt == 'error' || event.zt == 'errors' ? '/static/map3.png' : event.zt == 'warnings' || event.zt == 'warning' ? '/static/map3.png' : '/static/map1.png',
							label:{content:event.mc},
							id:event.id}
				uni.navigateTo({
				    url: '../workList/workList?cover='+JSON.stringify(covers) + '&kdNum=' + this.kdNum + '&errorNum=' + this.errorNum+ '&warnNum=' + this.warnNum + '&start=' +  this.start+ '&end=' +  this.end
				});
			}
		}
	}
</script>

<style>
	.searchTime{
		width: 94%;
		background: #f5f5f5;
		overflow: hidden;
		padding: 0 3%;
		position: fixed;
		top: 50px!important;
		left: 0;
		z-index: 99;
		height: 46px;
	}
	.icon{
		position: absolute;
		top: 0;
		right: 15px;
	}
	.pageAll{
		/* float: right; */
		position: absolute;
		right: 12px;
		font-size: 12px; 
		color: #aaa;
		line-height: 46px;
	}
	.timePicker{
		text-align: left;
		padding: 0 15px;
	}
	.timeDisabled{
		height: 30px;
		background: #eee;
		border-radius: 50px;
		font-size: 12px;
		line-height: 30px;
		text-align: center;
		width: 100px;
		margin: 8px 5px;
		float: left;
		position: relative;
		color: #999;
	}
	.time{
		height: 30px;
		background: #fff;
		border-radius: 50px;
		font-size: 12px;
		line-height: 30px;
		text-align: center;
		width: 100px;
		margin: 8px 5px;
		float: left;
		position: relative;
	}
	.segmented-control{
		width:100%;
		padding:10px 5%;
		height: 56px!important;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background: #f5f5f5;
	}
	.segmented-control__item--button{
		/* border-radius: 0!important; */
		position: absolute;
		top: 0;
	}
	.nohover.uni-list-item--hover{
		background: #fff!important;
	}
	.pageBody,.page-section{
		height: 100%;
		width: 100%;
	}
	.listBox{
		background: #fff;
		margin-bottom: 60px;
		margin-top: 56px;
	}
	.buttonChartBg{
		position: fixed!important;
		top: 170px!important;
		right: 0px!important;
		z-index: 998;
		width: 125px;
		height: 42px;
		right: -5px!important;
	}
	.buttonChart{
		position: fixed!important;
		top: 170px!important;
		right: -10px!important;
		z-index: 999;
		font-size: 15px;
		color: #fff;
		width: 130px;
		height: 42px;
		text-align: center;
		line-height: 38px;
		box-shadow:0px 0px 38px 0px rgba(194, 194, 194, 0.35);
		border-radius: 10px;
		padding-left: 5px;
	}
	.kdNumberBoxAll{
		background: rgba(255,255,255,0.85);
		position: fixed!important;
		top: 70px!important;
		right: -10px!important;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 130px;
		height: 80px;
		box-shadow:0px 0px 38px 0px rgba(194, 194, 194, 0.35);
		border-radius: 10px;
	}
	.kdNumberBox{
		position: fixed!important;
		top: 77px!important;
		right: 10px!important;
		border-radius: 10px 0 0 10px;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
	}
	.kdNumberBox1{
		position: fixed!important;
		top:97px!important;
		right: 10px!important;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #4A9FF7;
	}
	.kdNumberBox2{
		position: fixed!important;
		top: 117px!important;
		right: 10px!important;
		border-radius: 0 0 0 10px;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #F45151;
	}
	.kdNumberBox3{
		position: fixed!important;
		top: 117px!important;
		right: 10px!important;
		border-radius: 0 0 0 10px;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #F9A936;
	}
	.titleTop{
		font-size: 16px;
		height: 26px;
		line-height: 26px;
		padding: 0 10px;
		background: #f5f5f5;
	}
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		padding:30px 0;
		background: #F5F5F5;
	}
	.uni-tag--warning{
		float: left;
		margin-top: 2px;
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
		margin-top: 2px;
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
		margin-top: 2px;
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
	.listTitle{
		float: left;
	}
</style>
