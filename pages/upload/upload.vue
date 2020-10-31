<template>
	<view style="margin-bottom: 50px;">
		<detailList :list="list"></detailList>
		<!-- <tabBar :pagePath="'/pages/upload/upload'" :num="num"></tabBar> -->
	</view>
</template>

<script>
	import detailList from "@/components/detail-list/detail-list.vue"
	import moment from 'moment';
	import {getXjDataUpLoad,setXjAllData,setXjData,setWtData,deleteUpLoad,getWtData} from '../common/env.js'
	export default {
		data() {
			return {
				list:[],
				wtList:[],
				num:0,
			};
		},
		onShow: function (option) { //option为object类型，会序列化上个页面传递的参数
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
			this.getUploadList();
			getWtData('select * from wtData',(data)=>{
				this.wtList = data;
			});
		}, 
		components: {
			detailList,
		},
		methods:{
			getUploadList:function(){
				getXjDataUpLoad(`SELECT
				 A.*,
				 B.xm,
				 C.mc,
				 D.xm as fzr_xm
				FROM
				 xjDataUpLoad A
				 LEFT JOIN usersAllData B ON A.users_id = B.id
				 LEFT JOIN ksData C ON A.ks_id = C.id
				 LEFT JOIN usersAllData D ON C.fzr_id = D.id
				ORDER BY
				 dk_sj DESC`,(data)=>{
						// console.log('待上传======================callback====================>',data)
						this.list = data;
						if(data.length === 0){
							 uni.hideLoading();
						}
				});
			},
			getUpload:function(){
				let that = this;
				let data = this.list;
				if(data.length > 0){
					uni.showLoading({
						title: '数据上传中…',
						mask:true 
					});
					 data.map((item)=>{
						 let imgsJNet = []; 
						 let imgsNet = [];
						 let videoNet = [];
						 // console.log('------------图【item.yj_zp】------------',item.yj_zp,item.yj_zp.split('#'));
						 // console.log('------------图【item.jj_zp】------------',item.jj_zp,item.jj_zp.split('#'));
						 item.yj_zp.split('#').map((e)=>{
						 	uni.uploadFile({
						 		url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
						 		filePath: e,
						 		name: 'file',
						 		formData: {
						 			'user': 'test'
						 		},
						 		success: (uploadFileRes) => {
						 			// console.log('uploadFileRes.data',uploadFileRes.data,JSON.parse(uploadFileRes.data).fileUrl);
						 			// console.log('======图一转行【JSON.parse(uploadFileRes.data).fileUrl】======',JSON.parse(uploadFileRes.data).fileUrl)
						 			imgsNet.push(JSON.parse(uploadFileRes.data).fileUrl);
						 			if(imgsNet.length === item.yj_zp.split('#').length){
						 				item.jj_zp.split('#').map((e)=>{
						 					uni.uploadFile({
						 						url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
						 						filePath: e,
						 						name: 'file',
						 						formData: {
						 							'user': 'test'
						 						},
						 						success: (uploadFileRes) => {
						 							// console.log('======图二转行【JSON.parse(uploadFileRes.data).fileUrl】======',JSON.parse(uploadFileRes.data).fileUrl)
						 							imgsJNet.push(JSON.parse(uploadFileRes.data).fileUrl);
						 							if(imgsJNet.length === item.jj_zp.split('#').length){
														item.dsp.split('#').map((e)=>{
															uni.uploadFile({
																url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
																filePath: e,
																name: 'file',
																formData: {
																	'user': 'test'
																},
																success: (uploadFileRes) => {
																	// console.log('======图二转行【JSON.parse(uploadFileRes.data).fileUrl】======',JSON.parse(uploadFileRes.data).fileUrl)
																	videoNet.push(JSON.parse(uploadFileRes.data).fileUrl);
																	if(videoNet.length === item.dsp.split('#').length){
																		setTimeout(()=>{
																			 item.jj_zp_net = imgsJNet.join('#');
																			 item.yj_zp_net = imgsNet.join('#');
																			 item.dsp_net = item.dsp&&videoNet&&videoNet.length > 0 ? videoNet.join('#') : '';
																			 let uidId = item.users_id;
																			 let {users_id, ...dataItem} = item;
																			 dataItem.uid = uidId;
																			 uni.request({
																				 url: getApp().globalData.ip + '/saveXjData',
																				 data: dataItem,
																				method:'POST',
																				 success: (res) => {
																					 // console.log('待上传上传',res.data);
																					 if(res.data.data && !res.data.error){
																						 setTimeout(()=>{
																							uni.hideLoading();
																						 },500)
																						 setXjAllData([dataItem],(res)=>{});
																						 setXjData([dataItem],(res)=>{});
																						 deleteUpLoad(`DELETE FROM xjDataUpLoad WHERE id = '${item.id}'`,(res)=>{
																							that.getUploadList();
																						 });
																						 let idx = that.wtList.findIndex((event)=>{
																							return event.ks_id === item.ks_id;
																						 });
																						 if(idx > -1 && that.wtList[idx].wtzt_dm === '02'){
																							 uni.request({
																								 url: getApp().globalData.ip + '/updateWtData',
																								 data: {"wt_id":that.wtList[idx].id,"wtzt_dm":'04'},
																								method:'POST',
																								 success: (res) => {
																									// console.log('修改委托记录状态',res.data);
																									if(res.data.data && !res.data.error){
																											let dataItem = {"id":that.wtList[idx].id,"ks_id":that.wtList[idx].ks_id,"wt_sj":moment().format('YYYY-MM-DD HH:mm:ss'),"fqr_id":that.wtList[idx].fqr_id,"bwtr_id":that.wtList[idx].bwtr_id,"wtzt_dm":'04',"wtzt_mc":'已巡检'};
																											setWtData([dataItem],(res)=>{});
																									} 
																								 }
																							 });
																						 }
																						 // console.log('巡查成功',res.data);
																					}else{
																							uni.hideLoading();
																					}
																				} 
																			 }); 
																		},500)
																	}
																},
															});
														});
						 							}
						 						}
						 					});
						 				 }); 
						 			}
						 		}
						 	});
						 });	
					 });
				}else{
					
				}
			},
			onNavigationBarButtonTap:function(e){
				// console.log('导航按钮',e)
				let that = this;
				uni.getNetworkType({
				    success: function (res) {
						if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
							if(that.list.length>0){
								that.getUpload();
							}else{
								uni.showToast({
								    title: '暂无待上传数据',
								    duration: 2000,
									icon:'none'
								});
							}
							
						}else{
							uni.showToast({
							    title: '请连接互联网上传',
							    duration: 2000,
								icon:'none'
							});
						}
					}
				});
			},
		}
	}
</script>

<style lang="less">

</style>
