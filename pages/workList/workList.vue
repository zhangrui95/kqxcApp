<template>
    <view>
        <view class="pageBody">
			<view>
			     <map :style="{height:height+ 'px'}" style="width: 100%; position: relative;" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap='listShow' @labeltap='listShow'>
					 <cover-view class="mock"></cover-view>
					 <cover-view class="kdNumberBoxAll"></cover-view>
					 <cover-view class="kdNumberBox"> 风险点：{{kdNum}}个</cover-view>
					 <cover-view class="kdNumberBox1">已巡检：{{kdNum - errorNum - warnNum}}个</cover-view>
					 <cover-view class="kdNumberBox2" v-if="week == 0">未巡检：{{errorNum}}个</cover-view>
					 <cover-view class="kdNumberBox3" v-if="week !== 0">未巡检：{{warnNum}}个</cover-view>
					 <cover-view class="box">矿山名称：{{kdDetail.mc && kdDetail.mc.length > 16 ? kdDetail.mc.substring(0,16) + '…' : kdDetail.mc}}</cover-view>
					 <cover-image src="~@/static/topJt.png" class="imageTopJt"></cover-image>
					 <cover-view class="zrrBox" :style="{height: xjrHeight + 40 + 'px'}"></cover-view>
					 <cover-image src="~@/static/zrr.png" class="imageFzr"></cover-image>
					 <cover-image src="~@/static/xjr.png" class="imageXjr"></cover-image>
					 <cover-view class="fzrText">责任人：{{kdDetail.fzr_xm ? kdDetail.fzr_xm : '暂无'}}</cover-view>
					 <cover-view class="xjrText" :style="{height: xjrHeight + 'px'}">巡检人：{{yhName}}</cover-view>
			     </map>
			 </view>
			 <view class="listBox" :style="{height: listHeight + 'px'}">
				 <uni-list>
				     <uni-list-item :show-arrow="false" class="nohover">
						 <!-- <view class="msgBox"> -->
						 	<!-- <text class="leftBox">负责人：{{kdDetail.fzr_xm ? kdDetail.fzr_xm : '暂无'}}</text> -->
						 	<!-- <text class="rightBox">巡查人：王二</text> -->
						 <!-- </view> -->
					 </uni-list-item>
					  <view>
					         <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#172f87"></uni-segmented-control>
					         <view class="content">
					             <view v-if="current === 0">
					                 <uni-list-item @click="getDetail(item)" v-for="(item) in list">
					                 	<view class="msgBox">
					                 						<view style="float: left;">{{item.dk_sj}} <text style="margin: 0 10px;">{{item.is_ycdk == '1' ? '定位异常':item.is_ycdk == '2' ? '无定位' : '正常'}}打卡</text> 巡查人：{{item.xm}}</view>
					                 						<uni-tag v-if="item.yczt_dm === '01'" text="发现异常" type="error"></uni-tag></view>
					                 </uni-list-item>
									 <view class="noList" v-if="list.length == 0">
										 <image src="../../static/noList.png" style="width: 200px;height: 123px;"></image>
										 <view>暂无历史巡查记录</view>
									 </view> 
					             </view>
								 <view v-if="current === 1">
									 <view class="listItem" v-for="(item) in yhList">
										<uni-list-item :title="item.xm + '（'+ (item.is_zz=='1' ? '组长':'组员') +'）'" thumb="/static/leftHeader.png" :showArrow="false">
										</uni-list-item>
										<image v-if="item.users_id !== uid" class="rightImg" src="/static/message.png" mode="widthFix" @click="sendMsg(item)"></image>
									</view>
									<view class="noList" v-if="yhList.length == 0">暂无人员</view>
								 </view>
					             <view v-if="current === 2" class="gjjl"> 
					                 <uni-list-item :show-arrow="false" v-for="(item) in yjList" v-if="errorNum>0 || warnNum > 0">
					                 	<view class="msgBox" v-if="week==0">
					                 							<text style="float: left;">{{item.xm}} （{{item.is_zz === '1' ? '组长' : '组员'}}）</text><uni-tag :text="item.text" type="error"></uni-tag>
					                 						</view>
					                 						<view class="msgBox" v-if="week!=0">
					                 							<text style="float: left;">{{item.xm}} （{{item.is_zz === '1' ? '组长' : '组员'}}）</text><uni-tag :text="item.text" type="warning"></uni-tag>
					                 						</view>
					                 </uni-list-item>
									  <view class="noList" v-if="(yjList.length == 0 || errorNum == 0) && week==0">暂无巡检告警记录</view>
									  <view class="noList" v-if="(yjList.length == 0 || warnNum == 0) && week!=0">暂无巡检预警记录</view>
					             </view>
					         </view>
					     </view>
				 </uni-list>
			 </view>
        </view>
    </view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import moment from 'moment';
	import {getKsAllData,getXjData,getUsersAllData} from '../common/env.js'
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	export default {
		components: {uniSegmentedControl},
		data() {
			 return {
			      id:0, // 使用 marker点击事件 需要填写id
						height:400,
			            title: 'map',
						scale:18,
			            latitude: 45.21071,
			            longitude: 130.90693, 
			            covers: [],
						listHeight:0,
						kdNum:0,
						errorNum:0,
						warnNum:0,
						kdDetail:{},
						list:[],
						yjList:[],
						yhList:[],
						yhName:'',
						xjrHeight:60,
						week:moment().day(),
						text:'',
						 items: moment().day() == 0 ? ['历史巡查记录','人员列表','告警记录'] : ['历史巡查记录','人员列表','预警记录'],
						 current: 0,
						 uid:getApp().globalData.uid,
			        }
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
					// console.log(option.name); //打印出上个页面传递的参数。
					let cover = JSON.parse(option.cover);
					this.kdNum = option.kdNum;
					this.errorNum = option.errorNum;
					this.warnNum = option.warnNum;
					// this.yjList = JSON.parse(option.yjList);
					this.latitude= cover.latitude + 0.0027;
					this.longitude = cover.longitude;
					this.covers = [cover];
					let that = this;
					uni.getSystemInfo({
						success:function(res) {
							that.listHeight = res.windowHeight - 400
						}
					})
					getKsAllData(`select A.*, B.xm as fzr_xm from ksAllData A LEFT JOIN usersAllData B ON A.fzr_id = B.id where A.id = '${cover.id}'`,(data)=>{
						// console.log('data[0]',data)
						this.kdDetail = data && data[0] ? data[0]: {}
					});
					console.log('cover.id',cover.id)
					// getXjData(`SELECT A.*, B.xm, C.mc FROM xjAllData A LEFT JOIN usersAllData B ON A.users_id = B.id LEFT JOIN ksAllData C ON A.ks_id = C.id WHERE A.ks_id = '${cover.id}' ORDER BY dk_sj DESC`,(data)=>{
					// 	console.log('data====>',data)
					// 	this.list = data;
					// })
					uni.request({
					    url: getApp().globalData.ip + '/getXjData', //获取下载巡查记录
					    data: {
							ks_id:cover.id
						},
						method:'POST',
					    success: (res) => {
							if(res.data.data && !res.data.error){
								this.list = res.data.data;
							} 
					    }
					});
					let start =  moment().startOf('week').format("YYYY-MM-DD");
					let end =  moment().endOf('week').format("YYYY-MM-DD");
					let start_zz =  moment().startOf('month').format("YYYY-MM-DD");
					let end_zz =  moment().endOf('month').format("YYYY-MM-DD");
					uni.request({
					    url: getApp().globalData.ip + '/getKsXjYjData', //获取矿山列表
					    data: {
						 "ks_id": cover.id, 
						 "kssj":start +  " 00:00:00",
						 "jssj": end +  " 23:59:59",
						 "kssj_zz":start_zz +  " 00:00:00",
						 "jssj_zz": end_zz +  " 23:59:59"
						},
						method:'POST',
					    success: (res) => {
							if(res.data.data && !res.data.error){
								// console.log('res.data.data=====>',res.data.data);
								let hash = {};
								const data2 = res.data.data.reduce((preVal, curVal) => {
								    hash[curVal.users_id] ? '' : hash[curVal.users_id] = true && preVal.push(curVal); 
								    return preVal 
								}, []);
								this.yhList = data2;
								let yhName = [];
								data2.map((item)=>{
									yhName.push(item.xm);
								});
								this.yhName = yhName.toString();
								console.log('Math.ceil(yhName.length / 7)',this.yhName.length); 
								this.xjrHeight = Math.ceil((this.yhName.length+4) / 8) * 20; 
								let list = [];
								let successList = [];
								res.data.data.map((item)=>{
									if(!item.dk_sj){
										list.push({...item,text:'还需巡检2次'});
									}else{
										if(!successList.includes(item.users_id)){
											let index = list.findIndex((event)=> event.users_id === item.users_id);
											// console.log('移除===>',item.xm,index)
											if(index > -1){
												let days = moment(item.dk_sj) > moment(list[index].dk_sj) ? moment(item.dk_sj).diff(list[index].dk_sj,'day') :  moment(list[index].dk_sj).diff(item.dk_sj,'day');
												// console.log('移除111===>',item.dk_sj,list[index].dk_sj,days)
												if(days > 0){
													list.splice(index, 1); 
													successList.push(item.users_id);
												}
											}else{
												list.push({...item,text:'还需巡检1次'});
											}
										}
									}
									this.yjList = list;
								});
							} 
					    }
					});
		}, 
		 components: {
		        uniPopup, 
		},
		methods: {
			 onClickItem:function(e) {
			            if (this.current !== e.currentIndex) {
			                this.current = e.currentIndex;
			            }
			        },
			listShow:function(e){
				let latitude = this.covers[e.detail.markerId].latitude;
				let longitude = this.covers[e.detail.markerId].longitude;
				this.longitude = longitude;
				this.latitude = latitude;
				this.height = 400;
			},
			getDetail:function(item){
				uni.navigateTo({
					url:'../inspectionDetail/inspectionDetail?detail='+JSON.stringify(item)+ '&record=' + JSON.stringify(this.kdDetail),
				})
			},
			sendMsg:function(item){
				// console.log('执行？？？',item)
				uni.navigateTo({
					url:'../sendMsg/sendMsg?record='+JSON.stringify(item),
				})
			}
		}
	}
</script>

<style>
	.uni-tag--error{
		float: right;
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
		float:right;
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
	.segmented-control__item--button{
		border-radius: 0!important;
	}
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		padding:30px 0;
		background: #fff;
	}
	.mock{
		position: absolute;
		top: 0;
		left: 0;
		height: 250px;
		width: 100%;
	}
	.nohover.uni-list-item--hover{
		background: #fff!important;
	}
	.listItem{
		position: relative;
	}
	.rightImg{
		position: absolute;
		right: 15px;
		top: 12px;
		z-index: 99;
		width: 28px;
		height:28px;
	}
	.msgBox{
		color: #747474;
		font-size: 12px;
		line-height: 20px;
	}
	.leftBox{
		width: 50%;
		float: left;
	}
	.rightBox{
		width: 50%;
		float: left;
	}
	.box{
		width: 100%;
		height: 50px;
		background: #fff;
		position: absolute;
		left: -15px;
		bottom: -10px;
		font-size: 16px;
		line-height: 50px;
		padding: 0 15px;
		border-radius: 10px;
		z-index: 99;
	}
	.imageTopJt{
		width: 30px;
		height: 30px;
		position: absolute;
		margin-left: 50%;
		left: -15px;
		bottom: 30px;
		z-index: 99;
	}
	.listBox{
		background: #fff;
		margin-top: -10px;
	}
	.pageBody,.page-section{
		height: 100%;
		width: 100%;
	}
	.kdNumberBoxAll{
		background: rgba(255,255,255,0.85);
		position: absolute!important;
		top: 20px!important;
		right: -10px!important;
		z-index: 99;
		font-size: 14px;
		line-height: 22px;
		width: 130px;
		height: 80px;
		box-shadow:0px 0px 38px 0px rgba(194, 194, 194, 0.35);
		border-radius: 10px;
	}
	.zrrBox{
		background: rgba(0,0,0,0.6);
		position: absolute!important;
		top: 200px!important;
		right: 10px!important;
		z-index: 99;
		font-size: 14px;
		line-height: 22px;
		width: 150px;
		height: 80px;
		box-shadow:0px 0px 38px 0px rgba(194, 194, 194, 0.35);
		border-radius: 10px;
	}
	.fzrText,.xjrText{
		color: #fff;
		position: absolute!important;
		top: 210px!important;
		right: 20px!important;
		z-index: 100;
		font-size: 14px;
		width: 100px;
		height: 60px;
	}
	.xjrText{
		top: 230px!important;
		white-space: normal;
		word-break: break-all;
		word-wrap:break-word;
		/* white-space:pre-line; */
	}
	.imageFzr,.imageXjr{
		position: absolute!important;
		top: 210px!important;
		right: 125px!important;
		z-index: 100;
		width: 18px;
		height: 18px;
	}
	.imageXjr{
		width: 20px;
		height: 18px;
		top: 230px!important;
	}
	.kdNumberBox{
		position: absolute!important;
		top: 27px!important;
		right: 10px!important;
		border-radius: 10px 0 0 10px;
		z-index: 99;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
	}
	.kdNumberBox1{
		position: absolute!important;
		top:47px!important;
		right: 10px!important;
		z-index: 99;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #4A9FF7;
	}
	.kdNumberBox2{
		position: absolute!important;
		top: 67px!important;
		right: 10px!important;
		border-radius: 0 0 0 10px;
		z-index: 99;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #F45151;
	}
	.kdNumberBox3{
		position: absolute!important;
		top: 67px!important;
		right: 10px!important;
		border-radius: 0 0 0 10px;
		z-index: 99;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #F9A936;
	}
	.uni-list-item--hover{
		background: #fff!important;
	}
</style>
