<template>
	<view>
		<view class="searchTime">
			<view class="time" @click="show"> 
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" fields='month' class="timePicker">
									<view class="uni-input">{{date}}</view>
								</picker>  
			    <uni-icons type="arrowdown" size="16" color="#000" class="icon"></uni-icons>
			</view>
			<view class="pageAll">共{{list.length}}条记录</view>
		</view>
		<view class="boxList">
			<view class="noList" v-if="list.length == 0"><image src="../../static/noList.png" style="width: 200px;height: 123px;"></image>
				<view>暂无数据</view></view>
			<uni-list v-if="list.length > 0">
					<uni-list-item :show-arrow="false" v-for="(item,index) in list">
						<view class="listTitle"><text>{{item.mc}}</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：{{item.dz}}</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">委托人：{{item.wtr_xm}}</text>
							<text class="rightBox" v-if="item.wtzt_dm != '01'">委托状态：<text :style="{color: item.wtzt_dm == '01' ? '#F9A936' : item.wtzt_dm == '02' ? '#29B6FF': item.wtzt_dm == '03' ? '#999999': item.wtzt_dm == '04' ? '#3CE84C' : '#bbb'}">{{item.wtzt_mc}}</text></text> 
						</view>
						<view class="msgBox">
							<text class="bzBox">委托时间：{{item.wt_sj}}</text>
							<view class="btnBox" v-if="item.wtzt_dm == '01'">
								<button size='mini' type="warn"@click="getNo(item)">拒绝</button>
								<button size='mini' type="primary" style="background: #0EF023;" @click="getOk(item)">接受</button>
							</view>
							<view class="btnBox" v-if="item.wtzt_dm == '02'">
								<button size='mini' type="primary" style="background: #29B6FF;" @click="goList(item)">去巡查</button>
							</view>
						</view>
						<template v-slot:right="">
						    <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone(item.wtr_lxdh)"></image>
						</template>
					</uni-list-item>
				</uni-list>
		</view> 
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" :title="'确定要接受'+(item.wtr_xm? item.wtr_xm : '')+'的委托'+text+'？'" okText="确定" :duration="2000" :before-close="true" @close="close" @confirm="confirm('02')"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup1" type="dialog">
		    <uni-popup-dialog type="input" :title="'确定要拒绝'+(item.wtr_xm? item.wtr_xm : '')+'的委托？'" okText="确定" :duration="2000" :before-close="true" @close="close1" @confirm="confirm('03')"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import moment from 'moment';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {getWtData,setWtData} from '../common/env.js'
	export default {
		data() {
			const currentDate = this.getDate({
			            format: true
			        })
			return {
				name:'',
				time: moment().format('YYYY.MM.DD'),
				 date: currentDate,
				 list:[],
				 item:{},
				 text:'',
			}
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
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
			this.getList();
		}, 
		methods: {
			getList:function(){
				let that = this;
				uni.getNetworkType({
				    success: function (res) {
						if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
							that.getWt();
						}
					},
				});
				getWtData(` SELECT A.*, B.dz, B.mc, B.jd, B.wd, B.fzr_id, C.xm as wtr_xm, C.lxdh as wtr_lxdh FROM wtData A
				LEFT JOIN ksAllData B ON A.ks_id = B.id
				LEFT JOIN usersAllData C ON A.fqr_id = C.id
				WHERE A.bwtr_id = '${getApp().globalData.uid}' ORDER BY A.wt_sj DESC, A.id`,(data)=>{
											// console.log('委托',data);
											 this.list = data;
										});
			},
			getWt:function(){
				uni.request({
				    url: getApp().globalData.ip + '/getWtData', //获取委托记录
				    data: {"uid": getApp().globalData.uid},
					method:'POST',
				    success: (res) => {
						if(res.data.data && !res.data.error){
						  setWtData(res.data.data,(res)=>{});
						} 
				    }
				});
			},
			goList:function(item){
				// console.log('item=====>',item);
				item.typeXj = true;
				uni.navigateTo({
				    url: '../inspection/inspection?record=' + JSON.stringify(item),
				});
			},
			onNavigationBarButtonTap:function(e){
				// console.log('导航按钮',e)
				uni.navigateTo({
				    url: '../commissionReceivedSearch/commissionReceivedSearch'
				});
			},
			makePhone:function(phone){
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例 
				});
			},
			getOk:function(item){
				 this.item = item;
				 this.list.map((event)=>{
				 	if(event.wtzt_dm == '01' && event.id !== item.id && item.ks_id === event.ks_id){
				 		this.text = ',接受'+item.wtr_xm +'的委托将自动拒绝相同矿点的其他人委托请求'
				 	}
				 });
				 this.$refs.popup.open();
			},
			close:function(){
				this.text = '';
				 this.$refs.popup.close();
			},
			confirm:function(dm){
				this.text = '';
				if(dm === '02'){
					 this.$refs.popup.close();
				}else{
					this.$refs.popup1.close()
				}
				this.list.map((event)=>{
					if(event.wtzt_dm == '01' && event.id !== this.item.id && this.item.ks_id === event.ks_id){
						uni.request({
						    url: getApp().globalData.ip + '/updateWtData',
						    data: {"wt_id":event.id,"wtzt_dm":'03'},
							method:'POST',
						    success: (res) => {
								// console.log('修改委托记录状态',res.data);
								if(res.data.data && !res.data.error){
													let dataItem = {"id":event.id,"ks_id":event.ks_id,"wt_sj":event.wt_sj,"fqr_id":event.fqr_id,"bwtr_id":event.bwtr_id,"wtzt_dm":'03',"wtzt_mc":'已拒绝'};
										setWtData([dataItem],(res)=>{//存巡查记录
											this.getList();
										});
								} 
						    }
						});
					}
				});
				 uni.request({
				     url: getApp().globalData.ip + '/updateWtData',
				     data: {"wt_id":this.item.id,"wtzt_dm":dm},
				 	method:'POST',
				     success: (res) => {
				 		// console.log('修改委托记录状态',res.data);
				 		if(res.data.data && !res.data.error){
							let dataItem = {"id":this.item.id,"ks_id":this.item.ks_id,"wt_sj":this.item.wt_sj,"fqr_id":this.item.fqr_id,"bwtr_id":this.item.bwtr_id,"wtzt_dm":dm,"wtzt_mc":dm == '02' ? "已接受" : '已拒绝'};
				 				setWtData([dataItem],(res)=>{//存巡查记录
				 					this.getList();
				 				});
				 		} 
				     }
				 });
			},
			getNo:function(item){
				 this.item = item;
				 this.$refs.popup1.open();
			},
			close1:function(){
				 this.$refs.popup1.close();
			},
			bindDateChange: function(e) {
			    this.date = e.target.value
				let list = this.data.filter(item => item.wt_sj.indexOf(e.target.value) > -1);
				this.list = list;
			},
			 bindChange: function (e) {
						const val = e.detail.value
						this.year = this.years[val[0]]
						this.month = this.months[val[1]]
			},
			show: function(){
				this.visible= !this.visible;
			},
			getDate(type) {
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
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		padding:30px 0;
		background: #F5F5F5;
	}
	.icon{
		position: absolute;
		top: 0;
		right: 15px;
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
	/deep/ .uni-list-item__extra{
		top: -15px;
	    position: relative;
	}
	.uni-page-head .uni-page-head-ft {
			margin-right: 30upx;
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
		bottom: 65px;
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
	.btnBox{
		position: absolute;
		bottom:8px;
		right: 15px; 
	}
	.btnBox button{
		    line-height: 1.8;
		    padding: 0 0.8em;
			margin-left: 10px;
			font-size: 12px;
			border-radius: 2px;
			
	}
	.btnBox button:after{
		border: 0!important;
	}
</style>
