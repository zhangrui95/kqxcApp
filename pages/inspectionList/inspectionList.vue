<template>
	<view>
		<view class="title" v-if="uid !== userid && !isDate">联系方式</view>
		<view class="btnBox" v-if="uid !== userid && !isDate">
			<view class="lxfs" @click="sendMsg"><uni-icons type="chat" class="iconLxfs" size="18" color="#00B7F0"></uni-icons> 发送消息</view>
			<view class="lxfs" @click="getPhone" style="color: #f19049;"><uni-icons type="phone" class="iconLxfs" size="18" color="#f19049"></uni-icons> 拨打电话</view>
		</view>
		<view class="title" v-if="uid !== userid && !isDate">巡检历史</view>
		<view class="searchTime" v-if="isDate">
			<view class="time" @click="show"> 
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" fields='month' class="timePicker">
									<view class="uni-input">{{date}}</view>
								</picker>  
			    <uni-icons type="arrowdown" size="16" color="#000" class="icon"></uni-icons>
			</view>
			<view class="pageAll">共{{list.length}}条记录</view>
		</view>
		<view class="boxList" :style="{'margin-top':isDate ? '44px' : '0'}">
			 <uni-list>
				<uni-list-item @click="getDetail(item)" v-for="(item) in list">
					<view class="msgBox">
							<view style="float: left;width: 100%;">
									<text style="margin: 0 3px;float: left;">{{item.dk_sj.substring(0,10)}}</text>
									<text style="margin: 0 3px;" class="ksmc" v-if="item.mc">{{item.mc}}</text>
							</view>
							<view style="float: left;width: 100%;">
								<text style="margin: 0 3px;">{{item.is_ycdk == '1' ? '定位异常':item.is_ycdk == '2' ? '无定位' : '正常'}}打卡</text>
								<text style="margin: 0 3px;">{{item.xm}}</text>
								<text style="margin: 0 3px;color: #F06060;">{{item.yczt_dm === '01' ? "【发现异常】" : ""}}</text>
							</view>
					</view>
				</uni-list-item>
			 </uni-list>
			<view class="noList" v-if="list.length == 0">
				<image src="../../static/noList.png" style="width: 200px;height: 123px;"></image>
				<view>暂无历史巡查记录</view>
			</view> 
		</view>
	</view>
</template>

<script>
	import {getKsAllData,getXjData,getUsersAllData} from '../common/env.js'
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import moment from 'moment';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		data() {
			const currentDate = this.getDate({
			            format: true
			        })
			return { 
					list:[],
					date: currentDate,
					data:[],
					isDate:false,
					uid:'',
					userid: getApp().globalData.uid,
			}
		},
		computed: {
		       startDate() {
		           return this.getDate('start');
		       },
		       endDate() {
		           return this.getDate('end');
		       }
		   },
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
				let that = this;
				let uid = option.uid ? option.uid : getApp().globalData.uid;
				this.uid = uid;
				getXjData(`SELECT A.*, B.xm, C.mc FROM xjAllData A LEFT JOIN usersAllData B ON A.users_id = B.id LEFT JOIN ksAllData C ON A.ks_id = C.id  WHERE A.users_id = '${uid}'  ORDER BY dk_sj DESC`,(data)=>{
					console.log('data？？？？',data)
					this.list = data;
					this.data = data;
				});
		}, 
		onBackPress:function(event){
			if(this.isDate){
				this.isDate = !this.isDate;
				this.list = this.data;
				const currentDate = this.getDate({
				            format: true
				        });
				this.date = currentDate;
				// #ifdef APP-PLUS
				const currentWebview = this.$mp.page.$getAppWebview(); 
				currentWebview.setTitleNViewButtonStyle(0, {  //h5端会报错
					text: '时间筛选'
				}); 
				// #endif
				return true;
			}else{
				return false;
			}
		},
		methods: {
			show: function(){
				this.visible= !this.visible;
			},
			getDetail:function(item){
				console.log('item',item);
				uni.navigateTo({
					url:'../inspectionDetail/inspectionDetail?detail='+JSON.stringify(item),
				}) 
			},
			sendMsg:function(item){
				getUsersAllData(`select * from usersAllData WHERE id='${this.uid}'`,(res)=>{
					uni.navigateTo({
						url:'../sendMsg/sendMsg?record='+JSON.stringify(res[0]),
					})
				});
			},
			getPhone:function(){
				getUsersAllData(`select * from usersAllData WHERE id='${this.uid}'`,(res)=>{
					uni.makePhoneCall({
						phoneNumber: res[0].lxdh //仅为示例  
					});
				});
			},
			onNavigationBarButtonTap:function(e){
				    this.isDate = !this.isDate;
					if(e.index==0){
						// #ifdef APP-PLUS  
						const currentWebview = this.$mp.page.$getAppWebview(); 
						currentWebview.setTitleNViewButtonStyle(e.index, {  //h5端会报错
							text: this.isDate ? "取消筛选" : '时间筛选'
						}); 
						// #endif
								 
					}
					if(this.isDate){
						this.list = this.data.filter(item => item.dk_sj.indexOf(this.date) > -1);
					}else{
						this.list = this.data;
						const currentDate = this.getDate({
						            format: true
						        });
						this.date = currentDate;
					}
				
			},
			bindDateChange: function(e) {
			    this.date = e.target.value;
				console.log('this.list',this.list)
				let list = this.data.filter(item => item.dk_sj.indexOf(e.target.value) > -1);
				this.list = list;
			},
			getDate:function(type) {
			            const date = new Date();
			            let year = date.getFullYear();
			            let month = date.getMonth() + 1;
			            let day = date.getDate();
			
			            if (type === 'start') {
			                year = year - 60;
			            } else if (type === 'end') {
			                year = year + 2;
			            }
			            month = month > 9 ? month : '0' + month;;
			            return `${year}-${month}`;
			}
		}
	}
</script>

<style>
	.ksmc{
		/* overflow: hidden; */
		/* text-overflow:ellipsis; */
		/* white-space: nowrap; */
		/* width: 30%; */
		display: block;
		float: left;
	}
	.iconLxfs{
		margin-right: 5px;
	}
	.lxfs{
		width: 50%;
		float: left;
		height: 50px;
		text-align: center;
		line-height: 50px;
		font-size: 16px;
		color:#00B7F0;
	}
	.btnBox{
		background: #fff;
		width: 100%;
		overflow: hidden;
	}
	.title{
		font-size: 14px;
		height: 28px;
		line-height: 28px;
		color: #666;
		padding: 0 16px;
	}
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
		background: #F5F5F5;
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
	.timePicker{
		text-align: left;
		padding: 0 15px;
	}
	.pickerBox{
		height: 100px;
		position:fixed;
		top: 30px;
		left: 3%;
		width: 120px;
		z-index: 999;
		background: #fff;
		box-shadow: 0 4px 4px #ccc;
		border-radius: 0 0 10px 10px;
		overflow: hidden;
	}
	.pageAll{
		float: right;
		font-size: 14px;
		color: #aaa;
		line-height: 46px;
	}
	.searchTime{
		width: 94%;
		background: #f5f5f5;
		overflow: hidden;
		padding: 0 3%;
		position: fixed;
		/* top: 44px!important; */
		top:0;
		left: 0;
		z-index: 99;
	}
	.time{
		height: 30px;
		background: #fff;
		border-radius: 50px;
		font-size: 14px;
		line-height: 30px;
		text-align: center;
		width: 120px;
		margin: 8px 0px;
		float: left;
		position: relative;
	}
	.timeBtn{
		color: #2f67d5;
		position: absolute;
		top: 0px;
		right: 15px;
	}
	.timeSearch{
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		color: #666;
		margin-left: 15px;
		position: relative;
	}
	.boxList{
		background: #fff;
		width: 100%;
		margin-top: 44px;
	}
	.boxTop{
		background: #fff;
		width: 92%;
		height: auto;
		overflow: hidden;
		padding: 10px 4%;
		margin-bottom: 7px;
	}
	.icon{
		position: absolute;
		top: 0;
		right: 15px;
	}
</style>
