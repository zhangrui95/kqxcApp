<template>
    <view>
		  <view class="pageBody">
			 <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#172f87"></uni-segmented-control>
			    <view v-if="current === 0" class="listBox">
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
					<uni-list v-if="usersListSearch&&usersListSearch.length > 0">
						<uni-list-item v-for="(item) in usersListSearch" class="nohover" @click="getList(item.id)">
							<view class="msgBox">{{item.xm}}({{item.org_name}})</view>
						</uni-list-item>
					</uni-list>
					 <view class="noList" v-if="(usersList.length == 0 && listZzJg.length == 0 &&!searchValue) || (searchValue && usersListSearch.length==0)">暂无数据</view> 
				</view>
				<view class="page-section page-section-gap" v-if="current === 1">
					 <map :style="{height:height+ 'px'}" scale="12" style="width: 100%; position: relative;" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap='listShow' @labeltap='listShow'>
						 <cover-view class="kdNumberBoxAll" v-if="current === 1"></cover-view>
						 <cover-view class="kdNumberBox" v-if="current === 1"> 当前矿点：{{kdNum}}个</cover-view>
						 <cover-view class="kdNumberBox1" v-if="current === 1">正常矿点：{{kdNum - errorNum - warnNum}}个</cover-view>
						 <cover-view class="kdNumberBox2" v-if="week == 0 && current === 1">告警矿点：{{errorNum}}个</cover-view>
						 <cover-view class="kdNumberBox3" v-if="week !== 0 && current === 1">预警矿点：{{warnNum}}个</cover-view>
					 </map>
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
				xj_pc:'2',//打卡次数
				xj_zq:'7',//周期
				PI:3.14159265358979324,
				items: ['组织架构','矿山督查'],
				current: 0,
				listZzJg:[],
				usersList:[],
				jzList:[],
				usersListSearch:[],
				track_code:'',
				searchValue:'',
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
					that.height = res.windowHeight - 86 
				}
			});
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
					this.xj_pc = data[0].xj_pc;
					this.xj_zq = data[0].xj_zq;
					this.yj_xq_num = data[0].yj_xq_num;
					getKsAllData(`SELECT
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
					 ksAllData A 
					 LEFT JOIN (SELECT * FROM xjAllData WHERE users_id = '${getApp().globalData.uid}' AND dk_sj >= '${start} 00:00:00' ORDER BY dk_sj DESC) B ON A.id = B.ks_id
					 LEFT JOIN usersAllData C ON B.users_id = C.id
					 LEFT JOIN usersAllData D ON A.fzr_id = D.id
					ORDER BY A.id,B.dk_sj desc`,(data)=>{
						 let data1 = data;
						let hash = {}; 
						const data2 = data.reduce((preVal, curVal) => {
						    hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal); 
						    return preVal 
						}, []);
						this.kdNum = data2.length;
						let yjList = [];
						let latitude = 0;
						let longitude = 0;
						let covers = [];
						data2.map((event)=>{
							let nowList = data1.filter(item=>(item.id === event.id) && (moment(item.dk_sj) >= moment(this.start + ' 00:00:00')));
							let day = moment(this.end).diff(moment(event.dk_sj),'day');
							let week = moment().day();
							if(nowList && (nowList.length < parseInt(this.xj_pc))){
								if(week === 0){
									event.zt = nowList.length === 0 ? 'errors' : 'error';
									this.errorNum = this.errorNum + 1;
									yjList.push({xm:nowList.length > 0 ? [nowList.length - 1].xm : '',text:nowList.length === 0 ? '还需巡检两次次' : '还需巡检一次'});
								}else if(week >= this.yj_xq_num){
									event.zt = nowList.length === 0 ? 'warnings' :'warning';
									this.warnNum = this.warnNum + 1;
									yjList.push({xm:nowList.length > 0 ? [nowList.length - 1].xm : '',text:nowList.length === 0 ? '还需巡检两次次' : '还需巡检一次'});
								}else{
									event.zt = nowList.length === 0 ? 'primarys' : 'primary';
								}
							}else{
								let days = moment(nowList[nowList.length - 1].dk_sj.substring(0,10)).diff(nowList[0].dk_sj.substring(0,10),'day');
								if(days === 0 && week === 0){
									event.zt = 'error';
									this.errorNum = this.errorNum + 1;
									yjList.push({xm:nowList.length > 0 ? [nowList.length - 1].xm : '',text:'还需巡检一次'});
								}else if(days === 0 && week >= this.yj_xq_num){
									event.zt = 'warning';
									this.warnNum = this.warnNum + 1;
									yjList.push({xm:nowList.length > 0 ? [nowList.length - 1].xm : '',text:'还需巡检一次'});
								}else{
									if(days === 0){
										event.zt = 'primary'; 
									}else{
										event.zt = 'success'; 
									}
								}
							}
							let gps = this.gcj_encrypt(parseFloat(event.wd), parseFloat(event.jd));
							// latitude = latitude + parseFloat(gps.lat);
							// longitude = longitude + parseFloat(gps.lon);
							// console.log('latitude',latitude,longitude);
							this.ycId.map((res)=>{
								if(res === event.id){
									res.zt_dm = '02';
								}
							});
							covers.push({
								latitude: parseFloat(gps.lat),
								longitude: parseFloat(gps.lon),
								iconPath: event.zt == 'error' || event.zt == 'errors' ? '/static/map3.png' : event.zt == 'warnings' || event.zt == 'warning' ? '/static/map2.png' : '/static/map1.png',
								label:{content:event.mc},
								id:event.id,
							});
							this.yjList = yjList;
						})
						
						// this.latitude = latitude / data.length;
						// this.longitude = longitude / data.length; 
						this.covers = covers;
					});
				}
			});
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
			input:function(e){
				console.log('e====>',e.value,this.track_code);
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
							 console.log('搜索',res.data);
							 if(res.data && res.data.data){
								 this.usersListSearch = res.data.data;
							 }
						 }
					});
				}else{
					this.usersListSearch = [];
				}
				
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
						 console.log('组织架构',res.data);
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
				// console.log('e:',e,e.detail.markerId);
				let index = this.covers.findIndex((item)=>{
					return item.id === e.detail.markerId
				})
				uni.navigateTo({
				    url: '../workList/workList?cover='+JSON.stringify(this.covers[index]) + '&kdNum=' + this.kdNum + '&errorNum=' + this.errorNum+ '&warnNum=' + this.warnNum + '&start=' +  this.start+ '&end=' +  this.end
				});
			}
		}
	}
</script>

<style>
	.segmented-control__item--button{
		border-radius: 0!important;
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
	}
	.kdNumberBoxAll{
		background: rgba(255,255,255,0.85);
		position: fixed!important;
		top: 50px!important;
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
		top: 57px!important;
		right: 10px!important;
		border-radius: 10px 0 0 10px;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
	}
	.kdNumberBox1{
		position: fixed!important;
		top:77px!important;
		right: 10px!important;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #4A9FF7;
	}
	.kdNumberBox2{
		position: fixed!important;
		top: 97px!important;
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
		top: 97px!important;
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
		height: 50px;
		line-height: 50px;
	}
</style>
