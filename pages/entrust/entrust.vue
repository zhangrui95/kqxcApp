<template>
	<view>
		<view class="boxList">
			<view class="noList" v-if="list.length == 0"><image src="../../static/noList.png" style="width: 200px;height: 123px;"></image>
				<view>暂无数据</view></view>
			<uni-list  v-if="list.length > 0">
					<uni-list-item :show-arrow="false" v-for="(item,index) in list">
						<view class="listTitle"><text>{{item.mc}}</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：{{item.dz}}</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">被委托人：{{item.bwtr_xm}}</text>
							<text class="rightBox">委托状态：<text :style="{color: item.wtzt_dm == '01' ? '#F9A936' : item.wtzt_dm == '02' ? '#29B6FF': item.wtzt_dm == '03' ? '#999999': item.wtzt_dm == '04' ? '#3CE84C' : '#bbb'}">{{item.wtzt_mc}}</text></text> 
						</view>
						<view class="msgBox">
							<text class="bzBox">委托时间：{{item.wt_sj}}</text>
						</view>
						<template v-slot:right="">
						           <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone(item.bwtr_lxdh)"></image>
						       </template>
					</uni-list-item>
				</uni-list>
		</view>
		<view class="buttonBox">
			<button type="primary" style="background: #00b7f0;" @click="entrustColleague()">发起委托</button>
			<button type="primary" style="background: #f19049;" @click="goWt()">收到委托</button>
			<uni-badge v-if="num > 0" :text="num" type="error" class="badge" size='small'></uni-badge>
		</view>
		<!-- <tabBar :pagePath="'/pages/entrust/entrust'" :num="num"></tabBar> -->
	</view>
</template>

<script>
	import moment from 'moment';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import detailList from "@/components/detail-list/detail-list.vue"
	import {getWtData} from '../common/env.js'
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
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
		},
	  onShow: function () { //option为object类型，会序列化上个页面传递的参数
	  getWtData(` SELECT A.*, B.dz, B.mc, C.xm as wtr_xm, C.lxdh as wtr_lxdh FROM wtData A
	  LEFT JOIN ksData B ON A.ks_id = B.id
	  LEFT JOIN usersAllData C ON A.fqr_id = C.id 
	  WHERE A.bwtr_id = '${getApp().globalData.uid}' ORDER BY A.wt_sj DESC`,(data)=>{
		  this.num = 0;
			data.map((item)=>{
				if(item.wtzt_dm == '01'){
					this.num = this.num + 1;
				}
			})
		});
	        // console.log('--------------执行------------')
			getWtData(`SELECT A.*, B.dz,B.mc, C.xm as bwtr_xm, C.lxdh as bwtr_lxdh FROM wtData A
 LEFT JOIN ksData B ON A.ks_id = B.id
 LEFT JOIN usersAllData C ON A.bwtr_id = C.id
 WHERE A.fqr_id = '${getApp().globalData.uid}' ORDER BY A.wt_sj DESC`,(data)=>{
				// console.log('委托',data);
				 this.list = data;
			});
		}, 
		methods: {
			timeSearch:function(){
				uni.navigateTo({
				    url: '../detailKsTimeSearch/detailKsTimeSearch'
				});
			},
			goWt:function(){
				uni.navigateTo({
				    url: '../commissionReceived/commissionReceived'
				});
			},
			entrustColleague:function(item){
				uni.navigateTo({
				    url: '../entrustColleague/entrustColleague'
				});
			},
			makePhone:function(phone){
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例
				});
			}
		}
	}
</script>

<style>
	.badge{
		position: absolute;
		top: -5px;
		right: 2%;
	}
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		padding:30px 0;
		background: #F5F5F5;
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
