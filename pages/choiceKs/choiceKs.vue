<template>
	<view class="box">
			<uni-list>
				 <checkbox-group @change="checkboxChange">
						<label v-for="(item,index) in list" :key="item.id">
							<uni-list-item :show-arrow="false" :disabled="userWt.includes(item.id)">
									<view class="listTitle"><text :style="{color: item.zt === 'error' || item.zt === 'errors' ? '#f45619' : item.zt === 'warning' || item.zt === 'warnings' ? 'rgb(222, 140, 23)' : ' #000'}">{{item.mc}}</text>
									<uni-tag v-if="item.zt && is_zz!='1'" :text="item.zt === 'error' || item.zt === 'warning' || item.zt === 'primary' ? '还需巡检一次': item.zt === 'errors' || item.zt === 'warnings' || item.zt === 'primarys' ? '还需巡检两次' : item.zt === 'success' ? '巡检已完成' : ''" :type="item.zt == 'primarys' ? 'primary' :item.zt == 'warnings' ? 'warning':item.zt == 'errors' ? 'error'  : item.zt"></uni-tag>
									<uni-tag v-if="item.zt && is_zz=='1'" :text="item.zt === 'primary' ? '待巡检': item.zt === 'success' ? '已巡检'+item.num+'次' : ''" :type="item.zt"></uni-tag>
								</view>
									<view class="msgBox"> 
										<text class="leftBox">上次巡查：{{item && item.dk_sj ? item.dk_sj : '暂无'}}</text>
										<text class="rightBox">巡查人：{{item && item.xm ? item.xm : '暂无'}}</text>
									</view>
								 <template v-slot:right="">
								            <checkbox :value="item.id" :checked="item.checked" :disabled="userWt.includes(item.id)"/>
								</template>
							</uni-list-item>
						</label>
				 </checkbox-group>
			</uni-list>
			<view class="btnBox">
				   <button type="primary" :disabled="!(values.length > 0)" @click="goDetail">确定</button>
			</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import {getKsAllData,getConfig,setWtData,getWtData} from '../common/env.js'
	export default {
		data() {
			return {
				time: moment().format('YYYY.MM.DD'),
				values:[],
				person:{},
				list:[],
				wtList:[],
				start:'',
				end:'',
				oldStart:'',
				oldEnd:'',
				xj_jg:'2',//时间间隔
				xj_pc:'2',//打卡次数
				xj_zq:'7',//周期
				xj_jg_zz:'2',//时间间隔(组长)
				xj_pc_zz:'2',//打卡次数(组长)
				xj_zq_zz:'30',//周期(组长)
				yj_xq_num:5,//预警星期
				is_zz:getApp().globalData.is_zz,
				userWt:[],
				days:2,
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
		    this.person = JSON.parse(option.record);
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
					this.xj_jg = data[0].xj_jg;
					this.xj_pc = data[0].xj_pc;
					this.xj_zq = data[0].xj_zq;
					this.xj_jg_zz = data[0].xj_jg_zz;
					this.xj_pc_zz = data[0].xj_pc_zz;
					this.xj_zq_zz = data[0].xj_zq_zz;
					this.yj_xq_num = data[0].yj_xq_num;
					this.days = moment(end).diff(today,'day') + 1;
					let datas = {
								 bwtr_id: this.person.id,
								 kssj: start + " 00:00:00",
								 jssj: end + " 23:59:59"
						};
					uni.request({
					   url: getApp().globalData.ip + '/getUserWtStatus',
					   data: datas,
						method:'POST',
					    success: (res) => {
							// console.log('this.userWt ===== >',res,datas)
							this.userWt = res.data.data;
						},
					});
				}
			});
			// console.log('record',option.record);
			getWtData(`SELECT A.*, B.dz,B.mc, C.xm as bwtr_xm, C.lxdh as bwtr_lxdh FROM wtData A
			LEFT JOIN ksData B ON A.ks_id = B.id
			LEFT JOIN usersData C ON A.bwtr_id = C.id
			WHERE A.fqr_id = '${getApp().globalData.uid}' ORDER BY A.wt_sj DESC`,(data)=>{
							// console.log('委托',data);
							let wtList = [];
							data.map((item)=>{
								if((moment(item.wt_sj) >= moment(this.start)) && (moment(item.wt_sj) <= moment(this.end)) && (item.wtzt_dm === '01' || item.wtzt_dm === '02')){
									wtList.push(item);
								}
								this.wtList = wtList;
							})
						});
						this.getListKs(JSON.parse(option.record).id);
		}, 
		methods: {
			getListKs:function(uid){
				let res = [];
				// console.log('uid',uid)
				// getKsAllData(`SELECT
				//  A.id,
				//  A.dz,
				//  A.jd,
				//  A.wd,
				//  A.mc,
				//  C.xm,
				//  B.dk_sj,
				//  B.kczt_dm,
				//  B.yczt_dm,
				//  B.jj_zp,
				//  B.yj_zp,
				//  B.bz
				// FROM
				//  ksAllData A 
				//  LEFT JOIN (SELECT * FROM xjData WHERE users_id = '${uid}' AND dk_sj >= '${this.oldStart} 00:00:00' ORDER BY dk_sj DESC) B ON A.id = B.ks_id
				//  LEFT JOIN usersData C ON B.users_id = C.id
				// ORDER BY A.id,B.dk_sj desc`,(res)=>{
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
					 ksData A 
					 LEFT JOIN (SELECT * FROM xjData WHERE users_id = '${getApp().globalData.uid}' AND dk_sj >= '${this.start} 00:00:00' ORDER BY dk_sj DESC) B ON A.id = B.ks_id
					 LEFT JOIN usersData C ON B.users_id = C.id
					 LEFT JOIN usersData D ON A.fzr_id = D.id
					ORDER BY A.id,B.dk_sj desc`,(data)=>{
					    let data1 = data;
						let hash = {}; 
						const data2 = data.reduce((preVal, curVal) => {
						    hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal); 
						    return preVal 
						}, [])
						// let data2 = data3.filter(item => JSON.stringify(res).includes(item.id)); 
						// console.log('dataList,data2',dataList,data2);
						this.errorNum=0;
						this.warnNum=0;
						data2.map((event)=>{
							let nowList = data1.filter(item=>(item.id === event.id) && (moment(item.dk_sj) >= moment(this.start + ' 00:00:00')));
							let day = moment(this.end).diff(moment(event.dk_sj),'day');
							let week = moment().day();
							if(this.is_zz == '1'){
								if(nowList && nowList.length > 0){
									event.zt = 'success';
									event.num = nowList.length;
								}else{
									event.zt = 'primary';
									event.num = 0;
								}
							}else{
								console.log('nowList && (nowList.length < parseInt(this.xj_pc)):',nowList && (nowList.length < parseInt(this.xj_pc)))
								if(nowList && (nowList.length < parseInt(this.xj_pc))){
									if(week === 0){
										event.zt = nowList.length === 0 ? 'errors' : 'error';
										this.errorNum = this.errorNum + 1;
									}else if(week >= this.yj_xq_num){
										event.zt = nowList.length === 0 ? 'warnings' :'warning';
										this.warnNum = this.warnNum + 1;
									}else{
										event.zt = nowList.length === 0 ? 'primarys' : 'primary';
									}
								}else{
									let days = moment(nowList[nowList.length - 1].dk_sj.substring(0,10)).diff(nowList[0].dk_sj.substring(0,10),'day');
									console.log('days====>',days);
									if(days === 0 && week === 0){
										event.zt = 'error';
										this.errorNum = this.errorNum + 1;
									}else if(days === 0 && week >= this.yj_xq_num){
										event.zt = 'warning';
										this.warnNum = this.warnNum + 1;
									}else{
										if(days === 0){
											event.zt = 'primary';
										}else{
											event.zt = 'success';
										}
									}
								}
							}
						})
						this.list = data2;
					});
				// });
			},
			//生成id
			makeId:function(thelen){
			  let text = '';
			  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			  for (var i = 0; i < thelen; i++)
			  text += possible.charAt(Math.floor(Math.random() * possible.length));
			  return text;
			},
			goDetail: function() {
				// console.log('this.values',this.values,this.person);
				this.values.map((ks_id)=>{
					let id = this.makeId(32);
					let data = {id:id,ks_id:ks_id,wt_sj:moment().format('YYYY-MM-DD HH:mm:ss'),fqr_id: getApp().globalData.uid,bwtr_id:this.person.id};
					uni.request({
					    url: getApp().globalData.ip + '/saveWtData',
					   data: data,
						method:'POST',
					    success: (res) => {
							// console.log('委托成功',res.data); 
							if(res.data.data && !res.data.error){
								data.wtzt_dm='01';
								data.wtzt_mc='待接受';
								 setWtData([data],(res)=>{});
								 if(this.wtList.length > 0){
									 let wtData = this.wtList.filter(item => JSON.stringify(item).includes(ks_id)); 
									 console.log('wtData：',wtData);
									 if(wtData && wtData.length > 0){
										 uni.request({
											 url: getApp().globalData.ip + '/updateWtData',
											 data: {"wt_id":wtData[0].id,"wtzt_dm":'05'},
											method:'POST',
											 success: (res) => {
												// console.log('修改委托记录状态',res.data);
												if(res.data.data && !res.data.error){
														let dataItem = {"id":wtData[0].id,"ks_id":wtData[0].ks_id,"wt_sj":wtData[0].wt_sj,"fqr_id":wtData[0].fqr_id,"bwtr_id":wtData[0].bwtr_id,"wtzt_dm":'05',"wtzt_mc":'已撤销'};
														setWtData([dataItem],(res)=>{});
												} 
											 }
										 });
									 }
								 }
								 uni.showToast({
								     title: '委托成功',
								     duration: 800
								 }); 
								 setTimeout(()=>{
									 uni.navigateBack({
									     delta: 2
									 });
								 },800)
							} else{
								uni.showToast({
									title: '操作失败,请重试',
									icon: 'none',
								}); 
							}
						}
					});
				})
				for (let i = 0, lenI = this.list.length; i < lenI; ++i) {
				    const item = this.list[i]
				    this.$set(item,'checked',false)
				};
			},
			 checkboxChange: function (e) {
			                let items = this.list,
			                    values = e.detail.value;
								console.log('values',values)
								this.values = values;
			                for (let i = 0, lenI = items.length; i < lenI; ++i) {
			                    const item = items[i]
			                    if(values.includes(item.value)){
			                        this.$set(item,'checked',true)
			                    }else{
			                        this.$set(item,'checked',false)
			                    }
			                }
			            }
		}
	}
</script>

<style>
	/deep/ .uni-list-item__container:after{
		height: 0!important;
	}
	.uni-list-item__container{
		border: 0!important;
	}
	.uni-list{
		background: #f5f5f5!important;
	}
	.uni-list-item{
		background: #fff;
		margin-bottom: 7px;
	}
	.uni-tag--error{
		float: left;
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
		float: left;
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
	.leftBox{
		width: 65%;
		float: left;
	}
	.rightBox{
		width: 35%;
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
	.bzBox{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		display: block;
		width: 100%;
	}
	.btnBox{
		width: 90%;
		margin: 20px 5%;
	}
	.btnBox button{
		background: #108EE9;
	}
	uni-button[disabled]{
		background: #C7C7C7!important;
		color: #fff;
	}
	/deep/ .uni-checkbox-input-checked{
		    color: #fff!important;
		    background-color: #108EE9!important;
		    border-color: #108EE9!important;
	}
	.warnTop{
		background: #ffcfc0;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		text-align: center;
		color: #f45619;
		width: 100%;
		position: fixed;
		top: 0px;
		left: 0;
		z-index: 99;
	}
	.header{
		    position: fixed;
		    left: 0;
		    top: 0;
		    width: 100%;
		    height: 44px;
		    height: calc(44px + constant(safe-area-inset-top));
		    height: calc(44px + env(safe-area-inset-top));
		    padding: 7px 10px;
		    padding-top: calc(7px + constant(safe-area-inset-top));
		    padding-top: calc(7px + env(safe-area-inset-top));
		    display: -webkit-box;
		    display: -webkit-flex;
		    display: flex;
		    overflow: hidden;
		    -webkit-box-pack: justify;
		    -webkit-justify-content: space-between;
		    justify-content: space-between;
		    box-sizing: border-box;
		    z-index: 998;
		    color: #fff;
		    background-color: rgb(23, 47, 135);
		    -webkit-transition-property: all;
		    transition-property: all;
	}
	.titleName{
		font-size: 16px;	
        font-weight: 700;
		line-height: 30px;
	}
	.time{
		font-size: 14px;
		margin: 0 7px;
		font-weight: 100;
	}
</style>
