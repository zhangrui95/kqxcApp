<template>
	<view>
		<view class="boxTop">
			<view class="name">{{record.mc}}</view>
			<view class="address">矿山地址：{{record.dz}}</view>
			<view class='address'>矿山说明：{{record.ms}}</view>
		</view>
		<view class="boxList">
			<view class="timeSearch">
				<text>历史巡查列表（当前日期：{{time}}）</text>
				<view class="timeBtn" @click="timeSearch">时间筛选 <uni-icons type="search" size="16" color="#2f67d5"></uni-icons></view>
			</view>
			<detailList :list="list"></detailList>
		</view>
		<view class="buttonBox">
			 <button type="primary" style="background: #00b7f0;" @click="entrustColleague()">委托同事</button>
			 <button type="primary" style="background: #f19049;" @click="goXc()">马上巡查</button>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import detailList from "@/components/detail-list/detail-list.vue"
	import {getXjData} from '../common/env.js'
	export default {
		data() {
			return {
				record:{},
				time: moment().format('YYYY.MM.DD'),
				list:[],
			}
		},
		components: {
			detailList,
		},
	    onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.record); //打印出上个页面传递的参数。
			this.record = JSON.parse(option.record);
			let id = JSON.parse(option.record).id;
			console.log('id',id)
			getXjData(`SELECT A.*, B.xm, C.mc FROM xjData A LEFT JOIN usersData B ON A.users_id = B.id LEFT JOIN ksData C ON A.ks_id = C.id WHERE A.ks_id = '${id}' ORDER BY dk_sj DESC`,(data)=>{
				console.log('巡检记录======================callback====================>',data)
				this.list = data;
			});
		}, 
		methods: {
			timeSearch:function(){
				uni.navigateTo({
				    url: '../detailKsTimeSearch/detailKsTimeSearch?record='+JSON.stringify(this.record)
				});
			},
			goXc:function(e){
				console.log('e', e);
				uni.navigateTo({
				    url: '../inspection/inspection?record=' + JSON.stringify(this.record),
				});
			},
			entrustColleague:function(){
				uni.navigateTo({
				    url: '../entrustColleague/entrustColleague?record=' + JSON.stringify(this.record),
				});
			}
		}
	}
</script>

<style>
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
		margin-bottom: 80px;
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
		border: 1px!important;
	}
	.leftBox{
		width: 50%;
		float: left;
	}
	.rightBox{
		width: 50%;
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
	.buttonBox{
		position: fixed;
		bottom: 15px;
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
