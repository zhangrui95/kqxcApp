<template>
    <view>
        <view class="pageBody">
			<view class="page-section page-section-gap">
			     <map :style="{height:height+ 'px'}" scale="10" style="width: 100%; position: relative;" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap='listShow' @labeltap='listShow'>
					 <cover-view class="kdNumberBoxAll"></cover-view>
					 <cover-view class="kdNumberBox"> 当前矿点：{{kdNum}}个</cover-view>
					 <cover-view class="kdNumberBox1">正常矿点：{{kdNum - ycNum}}个</cover-view>
					 <cover-view class="kdNumberBox2">异常矿点：{{ycNum}}个</cover-view>
					 <!-- <cover-view class="kdNumberBox3">未采集矿点：{{zwsjNum}}个</cover-view> -->
			     </map>
			 </view>
        </view>
		<tabBar :pagePath="'/pages/work/work'"></tabBar>
    </view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {getKsAllData,getConfig} from '../common/env.js'
	export default {
		data() {
			 return {
			    id:0, // 使用 marker点击事件 需要填写id
				height:0,
				title: 'map',
				// scale:18,
				latitude: 0,
				longitude: 0,
				covers: [],
				kdNum:0,
				ycNum:0,
				zwsjNum:0,
				start:'',
				end:'',
				oldStart:'',
				oldEnd:'',
				ycId:[],
			}
		},
		 components: {
		        uniPopup, 
		},
		onLoad() {
			let that = this;
			uni.getSystemInfo({
				success:function(res) {
					that.height = res.windowHeight - 48 
				}
			});
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
				}
			});
			getKsAllData(`SELECT id, '00' as zt_dm FROM ksData UNION ALL SELECT id, '02' as zt_dm FROM ( SELECT A.id, A.dz, A.jd, A.mc, A.ms, A.wd, B.dk_sj FROM ksData A LEFT JOIN ( SELECT * FROM xjData WHERE dk_sj > '${this.start} 00:00:00' AND yczt_dm = '02' ) B ON A.id = B.ks_id ) WHERE dk_sj IS NOT NULL GROUP BY id UNION ALL SELECT id, '03' as zt_dm FROM ( SELECT A.id, A.dz, A.jd, A.mc, A.ms, A.wd, B.dk_sj FROM ksData A LEFT JOIN ( SELECT * FROM xjData WHERE dk_sj > '${this.start} 00:00:00' AND yczt_dm = '02' ) B ON A.id = B.ks_id ) WHERE dk_sj IS NULL GROUP BY id`,(data)=>{
				// console.log('data 数量汇总是总数',data);
				this.kdNum = 0;
				this.ycNum = 0;
				this.zwsjNum = 0;
				data.map((item)=>{
					if(item.zt_dm === '00'){
						this.kdNum = this.kdNum + 1;
					}
					if(item.zt_dm === '02'){
						this.ycNum = this.ycNum + 1;
						this.ycId.push(item.id);
					}
					if(item.zt_dm === '03'){
						this.zwsjNum = this.zwsjNum + 1;
					}
				})
			});
			getKsAllData('select A.*, B.xm as fzr_xm from ksAllData A LEFT JOIN usersData B ON A.fzr_id = B.id',(data)=>{
				// console.log('ksAllData=====>',data,this.ycId);
				let latitude = 0;
				let longitude = 0;
				let covers = [];
				data.map((item,index)=>{
					latitude = latitude + parseFloat(item.wd);
					longitude = longitude + parseFloat(item.jd);
					// console.log('latitude',latitude,longitude);
					this.ycId.map((event)=>{
						if(event === item.id){
							item.zt_dm = '02';
						}
					});
					covers.push({
						latitude: parseFloat(item.wd),
						longitude: parseFloat(item.jd),
						iconPath: item.zt_dm&&item.zt_dm === '02' ? '/static/map3.png' : '/static/map1.png',
						label:{content:item.mc},
						id:item.id,
					});
				});
				this.latitude = latitude / data.length;
				this.longitude = longitude / data.length; 
				this.covers = covers;
			});
		},
		methods: {
			listShow:function(e){
				// console.log('e:',e,e.detail.markerId);
				let index = this.covers.findIndex((item)=>{
					return item.id === e.detail.markerId
				})
				uni.navigateTo({
				    url: '../workList/workList?cover='+JSON.stringify(this.covers[index]) + '&kdNum=' + this.kdNum + '&ycNum=' + this.ycNum
				});
			}
		}
	}
</script>

<style>
	.pageBody,.page-section{
		height: 100%;
		width: 100%;
	}
	.kdNumberBoxAll{
		background: rgba(255,255,255,0.85);
		position: fixed!important;
		top: 20px!important;
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
		top: 27px!important;
		right: 10px!important;
		border-radius: 10px 0 0 10px;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
	}
	.kdNumberBox1{
		position: fixed!important;
		top:47px!important;
		right: 10px!important;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #4A9FF7;
	}
	.kdNumberBox2{
		position: fixed!important;
		top: 67px!important;
		right: 10px!important;
		border-radius: 0 0 0 10px;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #F45151;
	}
</style>
