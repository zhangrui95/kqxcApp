<template>
	<view>
		<view class="boxList">
			<view class="noList" v-if="list.length == 0">暂无数据</view>
			<uni-list  v-if="list.length > 0">
					<uni-list-item v-for="(item,index) in list" @click="getDetail(item)"> 
						<view class="listTitle"><text>{{item.mc}}</text></view>
						<view class="msgBox">
							<text class="ztTitle">{{item.title}}</text> <uni-icons v-if="item.img_url" type="image" size="16" color="#666" style="margin-left: 5px;"></uni-icons>
						</view>
						<view class="msgBox">
							<text class="tzBox">通知内容：{{item.text}}</text>
						</view>
						<view class="msgBox">
							<text class="bzBox">通知人数：{{item.receiver_total}}人，已读人数：{{item.receiver_total - item.receiver_unread}}人</text>
							<text class="ztTime">{{item.cjsj.substring(0,10)}}</text>
						</view>
					</uni-list-item>
				</uni-list>
		</view>
		<view class="buttonBox">
			<button type="primary" style="background: #00b7f0;" @click="getXf()">下发通知</button>
			<button type="primary" style="background: #f19049;" @click="goTz()">收到通知</button>
			<uni-badge v-if="num > 0" :text="num" type="error" class="badge" size='small'></uni-badge>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import detailList from "@/components/detail-list/detail-list.vue"
	import {getWtData} from '../common/env.js'
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	import uniCard from '@/components/uni-card/uni-card.vue'
	export default {
		data() {
			return {
				time: moment().format('YYYY.MM.DD'),
				list:[],
				num:0,
			}
		},
		components: {
			detailList,
			uniCard,
			uniIcons
		},
		onShow: function () { //option为object类型，会序列化上个页面传递的参数
			this.getList();
		}, 
		methods: {
			getList:function(){
				uni.request({
					 url: getApp().globalData.ip + '/getNoticeSendList',
					 data: {
						poster_user_id: getApp().globalData.uid,
					},
					 method:'POST',
					 success: (res) => {
						console.log('res=====>',res.data);
						if(res.data&&res.data.data){
							this.list = res.data.data;
						}
					 }
				});
			},
			goTz:function(){
				uni.navigateTo({
				    url: '../receivedNotice/receivedNotice' 
				});
			},
			getXf:function(item){
				uni.navigateTo({
				    url: '../sendNotice/sendNotice'
				});
			},
			getDetail:function(item){
				uni.navigateTo({
				    url: '../noticeDetail/noticeDetail?record='+JSON.stringify(item)
				});
			}
		}
	}
</script>

<style>
	.tzBox{
		display: -webkit-box; 
		-webkit-box-orient: vertical;
		 -webkit-line-clamp: 2; 
		 overflow: hidden;
	}
	.ztTitle{
		color: #333;
		font-size: 16px;
	}
	.ztTime{
		float: right;
	}
	.badge{
		position: absolute;
		top: -5px;
		right: 2%;
	}
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		height: 50px;
		line-height: 50px;
	}
	.uni-list-item--hover{
		background: #fff!important;
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
		margin-bottom: 130px;
	}
	.boxTop{
		background: #fff;
		width: 92%;
		height: auto;
		overflow: hidden;
		padding: 10px 4%;
		margin-bottom: 7px;
	}
	.name{
		border-bottom: 1px solid #f4f4f4;
		height: 36px;
		line-height: 30px;
		margin-bottom: 10px;
	}
	.address{
		font-size: 14px;
		color: #666;
		line-height: 22px;
	}
	/deep/ .uni-list-item__container:after{
		height: 1px!important;
	}
	.uni-list-item__container{
		border: 0px!important;
	}
	.leftBox{
		width: 40%;
		float: left;
	}
	.rightBox{
		width: 60%;
		float: left;
	}
	.listTitle{
		color: #000;
		margin-bottom: 4px;
	}
	.msgBox{
		color: #747474;
		font-size: 12px;
		line-height: 20px;
	}
	.buttonBox{
		position: fixed;
		bottom: 25px;
		width: 96%;
		left: 0;
		padding: 0 2%;
	}
	.buttonBox button{
		width: 46%;
		float: left;
		margin: 0 2%;
		border-radius: 50px;
		box-shadow:0px 5px 15px 0px rgba(0, 0, 0, 0.2);
	}
</style>
