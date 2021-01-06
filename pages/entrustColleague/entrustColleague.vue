<template>
	<view>
		<view class="noList" v-if="list.length == 0"><image src="../../static/noList.png" style="width: 200px;height: 123px;"></image>
				<view>暂无数据</view></view>
		<uni-list v-for="(item,index) in list">
			<view class="listItem" v-if="item.id !== uid">
				<uni-list-item :disabled="is_zz=='1'" :title="item.xm" thumb="/static/leftHeader.png" :showArrow="false" @click="getOk(item)">
					 <!-- <template v-slot:right="">
					            <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone(item.lxdh)"></image>
					        </template> -->
				</uni-list-item>
				<image class="rightImg" src="/static/phone.png" mode="widthFix" @click="makePhone(item.lxdh)"></image>
			</view>
		</uni-list>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" :title='text+"确定将"+record.mc+"巡查委托给"+item.xm+"？"' okText="确定" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {getUsersData,setWtData,getWtData,getConfig} from '../common/env.js'
	import moment from 'moment';
	export default {
		data() {
			return {
				list:[],
				record:'',
				item:'',
				uid:getApp().globalData.uid,
				wtList:[],
				start:'',
				end:'',
				oldStart:'',
				oldEnd:'',
				text:'',
				is_zz:getApp().globalData.is_zz,
			}
		},
		onLoad: function (option) {
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
				}
			});
			// getUsersData('select * from usersData',(data)=>{
			// 	this.list = data;
			// 	console.log('人员',data);
			// });
			uni.request({
			    url: getApp().globalData.ip + '/getWtUsersData ',
			   data: {
					uid:getApp().globalData.uid
				},
				method:'POST',
			    success: (res) => {
					if(res.data.data && !res.data.error){
						this.list = res.data.data;
					}
				}
			})
			// console.log('option.record',option.record)
			if(option.record){
				// console.log(option.record); //打印出上个页面传递的参数。
				this.record = JSON.parse(option.record);
			}
			getWtData(`SELECT A.*, B.dz,B.mc, C.xm as bwtr_xm, C.lxdh as bwtr_lxdh FROM wtData A
			LEFT JOIN ksData B ON A.ks_id = B.id
			LEFT JOIN usersData C ON A.bwtr_id = C.id
			WHERE A.fqr_id = '${getApp().globalData.uid}' AND A.ks_id='${this.record.id}'  ORDER BY A.wt_sj DESC`,(data)=>{
							// console.log('委托',data);
							let wtList = [];
							data.map((item)=>{
								// console.log('-----item.wtzt_dm-----',item.wt_sj,this.start,this.end,item.wtzt_dm);
								// console.log('===判断==',(moment(item.wt_sj) >= moment(this.start)),(moment(item.wt_sj) <= moment(this.end)) ,(item.wtzt_dm === '01' || item.wtzt_dm === '02'))
								if((moment(item.wt_sj) >= moment(this.start)) && (moment(item.wt_sj) <= moment(this.end)) && (item.wtzt_dm === '01' || item.wtzt_dm === '02')){
									wtList.push(item);
									// console.log('item',item)
								}
								this.wtList = wtList;
								if(wtList.length > 0){
									this.text = '当前矿山已被委托给'+wtList[0].bwtr_xm+'确定撤销上次委托，并'
								}
								// console.log('委托wtList',wtList);
							})
						});
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		methods: {
			makePhone:function(lxdh){
				uni.makePhoneCall({
				    phoneNumber: lxdh //仅为示例
				});
			},
			getOk:function(item){
				// console.log('this.is_zz',this.is_zz);
				if(this.is_zz!='1' && item.is_zz!='1'){
					// console.log('item========>',item);
					 this.item = item;
					 let that = this;
					 uni.getNetworkType({
					     success: function (res) {
					         // console.log('网络状态',res.networkType);
					 		if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
								// console.log('--------------this.record--------------',that.record)
								if(that.record){
									that.$refs.popup.open();
								}else{
									// console.log('JSON.stringify(item)======?',JSON.stringify(item))
									uni.navigateTo({
									    url: '../choiceKs/choiceKs?record='+JSON.stringify(item)
									});
								}
					 		}else{
								uni.showToast({
									title:'请连接互联网发起委托',
									icon:'none',
								});
					 		}
					     }
					 });
				}
			},
			close:function(){
				 this.$refs.popup.close();
			},
			// getWt:function(){
			// 	uni.request({
			// 	    url: getApp().globalData.ip + '/getWtData', //获取委托记录
			// 	    data: {"uid": getApp().globalData.uid},
			// 		method:'POST',
			// 	    success: (res) => {
			// 			if(res.data.data && !res.data.error){
			// 			  setWtData(res.data.data,(res)=>{});
			// 			} 
			// 	    }
			// 	});
			// },
			//生成id
			makeId:function(thelen){
			  let text = '';
			  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			  for (var i = 0; i < thelen; i++)
			  text += possible.charAt(Math.floor(Math.random() * possible.length));
			  return text;
			},
			confirm:function(){
				// console.log('this.wtList',this.wtList);
				 this.$refs.popup.close();
				 // console.log(this.item,this.record)
				 let id = this.makeId(32);
				 let data = {id:id,ks_id:this.record.id,wt_sj:moment().format('YYYY-MM-DD HH:mm:ss'),fqr_id: getApp().globalData.uid,bwtr_id:this.item.id};
				 uni.request({
				     url: getApp().globalData.ip + '/getUserWtStatus',
				    data: {
						 bwtr_id: this.item.id,
						 kssj: this.start + " 00:00:00",
						 jssj: this.end + " 23:59:59"
					},
				 	method:'POST',
				     success: (res) => {
						 // console.log('res.data.data',res.data.data)
						if(res.data.data.includes(this.record.id)){
							uni.showToast({
								icon:'none',
							    title: this.record.mc + this.item.xm +'已接受他人巡检委托，暂无法接受你的委托',
							    duration: 2000
							}); 
						}else{
							uni.request({
							    url: getApp().globalData.ip + '/saveWtData',
							   data: data,
								method:'POST',
							    success: (res) => {
									console.log('委托成功',res.data); 
									if(res.data.data && !res.data.error){
														uni.showToast({
														    title: '委托成功',
														    duration: 800
														}); 
															data.wtzt_dm='01';
															data.wtzt_mc='待接受';
														 setWtData([data],(res)=>{});
														 if(this.wtList.length > 0){
															 uni.request({
																 url: getApp().globalData.ip + '/updateWtData',
																 data: {"wt_id":this.wtList[0].id,"wtzt_dm":'05'},
																method:'POST',
																 success: (res) => {
																	// console.log('修改委托记录状态',res.data);
																	if(res.data.data && !res.data.error){
																			let dataItem = {"id":this.wtList[0].id,"ks_id":this.wtList[0].ks_id,"wt_sj":this.wtList[0].wt_sj,"fqr_id":this.wtList[0].fqr_id,"bwtr_id":this.wtList[0].bwtr_id,"wtzt_dm":'05',"wtzt_mc":'已撤销'};
																			setWtData([dataItem],(res)=>{});
																	} 
																 }
															 });
														 }
														// this.getWt();
									} else{
														uni.showToast({
														    title: '操作失败,请重试',
														    icon: 'none'
														}); 	
													}
							    }
							});
						}
				     }
				 });
			},
		}
	}
</script>

<style>
/deep/ .uni-list-item__icon-img{
	width: 40px!important;
	height: 40px!important;
}
/deep/ .uni-dialog-title-text{
	    width: 80%;
	    text-align: center;
}
.listItem{
	position: relative;
}
.listItemZz{
	position: relative;
}
.listItemZz /deep/.uni-list-item{
	color: #ddd!important;
}
.rightImg{
	position: absolute;
	right: 15px;
	top: 18px;
	z-index: 99;
	width: 30px;
	height: 30px;
}
.noList{
	text-align: center;
	font-size: 14px;
	color: #999;
	padding:30px 0;
	background: #F5F5F5;
	}
</style>
