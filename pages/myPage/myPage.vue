<template>
	<view>
		<view class="headerTop">
			<image src="../../static/myHeader.png" style="width: 120px;height: 120px;"></image>
			<view class="name">{{name}}</view>
		</view>
		<uni-list style="margin-top:10px;">
			<!-- <uni-list-item thumb="../../static/msg.png" title="我的消息" @click="myMessage" :show-badge="parseInt(allNum) > 0 ? true : false" :badge-text="allNum" badge-type="error"></uni-list-item> -->
		    <uni-list-item thumb="../../static/tjxz.png" title="推荐下载" @click="getTj"></uni-list-item>
			<uni-list-item thumb="../../static/bbjc.png" title="软件更新" @click="getUpdate" :rightText="'v'+version"></uni-list-item>
			<uni-list-item thumb="../../static/gps.png" title="工具箱-GPS坐标" @click="getGps"></uni-list-item>
			<!-- <uni-list-item thumb="../../static/rjxy.png" title="软件许可协议"></uni-list-item> -->
		</uni-list>
       <!-- <uni-list style="margin-top:80px;">
		    <uni-list-item :show-arrow="false" @click="choice">
				<view class="listBtn">切换账号</view>
			</uni-list-item>
		</uni-list> -->
		<!-- <uni-list style="margin-top:140px;">
		    <uni-list-item :show-arrow="false" @click="getOk">
				<view class="listBtn">退出登陆</view>
			</uni-list-item>
		</uni-list> -->
		<view class="btnBox">
			<button type="primary" class="btn" @click="getOk">退出登陆</button>
		</view>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" title="确定退出登陆？" okText="确定" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup> 
		<tabBar :pagePath="'/pages/myPage/myPage'" :num="num" @getMsgNum="getMsgNum" ref="tabBar"></tabBar> 
		<view class="loading" v-if="load">
			<view class="loadBox">
				<view class="loadName">下载中({{this.progress}}%)</view>
				<view class="loadItem">
					<view class="load" :style="{width:this.progress+'%'}"></view>
				</view>
			</view>
		</view>
		<!-- <view class="newUpBox">
			<view class="updateBg">
				<view class="upText">1.修改部分Bug,体验更加的流畅</view>
				<view class="upText">2.新增图表统计功能</view>
				<view class="upText">3.功能优化</view>
				<view class="newUpbtnBox">
					<text class="noUpBtn">暂不更新</text>
					<text class="upBtn">立即更新</text>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {getWtData} from '../common/env.js'
	export default {
		data() {
			return {
				name:'',
				num:0,
				progress:0,
				load:false,
				allNum:'0',
				version:getApp().globalData.version,
				isLx:getApp().isLx,
				isNet:true
			}
		},
		onLoad() {
			let that = this;
			uni.getStorage({
			    key: 'user',
			    success: function (res) {
					if(res.data){
						that.name = JSON.parse(res.data).xm;
					}
			    }
			});
			uni.getNetworkType({
				success: function (res) {
					if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g' && !that.isLx){
						that.isNet = true
					}else{
						that.isNet = false
					}
				},	
			});
		},
		onShow() {
			// if(this.$refs.tabBar){
			// 	this.$refs.tabBar.getNum();
			// }
			getWtData(` SELECT A.*, B.dz, B.mc, C.xm as wtr_xm, C.lxdh as wtr_lxdh FROM wtData A
			LEFT JOIN ksData B ON A.ks_id = B.id
			LEFT JOIN usersData C ON A.fqr_id = C.id
			WHERE A.bwtr_id = '${getApp().globalData.uid}' ORDER BY A.wt_sj DESC`,(data)=>{
					  this.num = 0;
						data.map((item)=>{
							if(item.wtzt_dm == '01'){
								this.num = this.num + 1;
							}
						})
					});
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: !this.isNet || this.isLx ? '我的(离线)' : '我的'
			});
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		methods: {
			getGps:function(){
				uni.navigateTo({
					 url: '../myGps/myGps'
				})
			},
			getTj:function(){
				uni.navigateTo({
					 url: '../tjDownload/tjDownload'
				})
			},
			choice:function(){
				uni.navigateTo({
					 url: '../choiceNumber/choiceNumber'
				})
			},
			getMsgNum:function(num){
				this.allNum = num;
			},
			myMessage:function(){
				uni.navigateTo({
				    url: '../myMessage/myMessage'
				});
			},
			getOk:function(){
				 this.$refs.popup.open();
			},
			close:function(){
				 this.$refs.popup.close();
			},
			confirm:function(){
				 this.$refs.popup.close();
				  getApp().globalData.isLogin = false;
				  uni.reLaunch({
				      url: '../login/index'
				  });
				  // uni.removeStorage({
				  //     key: 'userData',
				  //     success: function (res) {
				  //       uni.reLaunch({
				  //           url: '../login/index'
				  //       });
				  //     }
				  // });
			},
			toNum(a){
			  var a=a.toString();
			  var c=a.split('.');
			  var num_place=["","0","00","000","0000"],r=num_place.reverse();
			  for (var i=0;i<c.length;i++){ 
			     var len=c[i].length;       
			     c[i]=r[len]+c[i];  
			  } 
			  var res= c.join(''); 
			  return res; 
			},
			getUpdate:function(){
				let that = this;
				uni.getNetworkType({
				    success: function (res) {
						if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
							uni.showLoading({
							    title: '版本检测中…',
								mask: true
							});
							uni.request({
							    url: getApp().globalData.ip + '/getConfig', 
							    data: {},
								method:'POST',
							    success: (res) => {
									// console.log('getConfig===========>',res.data);
									if(res.data.data && !res.data.error){
										if(that.toNum(getApp().globalData.version) < that.toNum(res.data.data.last_version)){
											uni.hideLoading();
											uni.showModal({
											    title: '当前版本v'+getApp().globalData.version+'检测到最新版本v'+res.data.data.last_version+',是否确认更新？',
											    success: function (resDate) {
											        if (resDate.confirm) {
														that.load = true;
											   //          console.log('res.data.data.app_down=====>',res.data.data.app_down);
														const downloadTask = uni.downloadFile({
														    url: res.data.data.app_down,
														    success: (res) => {
														        if (res.statusCode === 200) {
																	that.load = false; 
																	uni.removeStorage({
																	    key: 'userData',
																	    success: function (res) {}
																	});
																	uni.removeStorageSync('workHeight');
																	uni.removeStorageSync('homeHeight');
																	plus.runtime.install(res.tempFilePath);
														            // console.log('下载成功');
														        }
														    }
														});
														downloadTask.onProgressUpdate((res) => {
															that.progress = res.progress;
														});
											        } else if (resDate.cancel) {
											            // console.log('用户点击取消');
											        }
											    }
											});
										}else{
											uni.hideLoading();
											uni.showToast({
											    title: '当前版本已是最新版本v'+getApp().globalData.version,
											    duration: 2000,
												icon:'none' 
											});
										}
									}
							    } 
							});
						}else{
							uni.showToast({
							    title: '请连接互联网检测版本',
							    duration: 2000,
								icon:'none'
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
	.headerTop{
		height: 150px;
		width: 100%;
		background: #fff;
		text-align: center;
		padding: 20px 0;
	}
	.listBtn{
		text-align: center;
		width: 100%;
	}
	.loading{
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0,0,0,0.2);
		width: 100%;
		height: 100%;
		z-index: 999;
	}
	.loadBox{
		width: 90%;
		height: 100px;
		background: #fff;
		border-radius: 10px;
		position: absolute;
		top: 35%;
		left: 5%;
	}
	.loadName{
		color: #333;
		text-align: center;
		font-size: 16px;
		margin: 20px 0;
	}
	.loadItem{
		width: 80%;
		margin: 10px 10%;
		height: 10px;
		background: #eee;
		border-radius: 50px;
		overflow: hidden;
	}
	.load{
		width: 0%;
		height: 10px;
		background: #172f87;
		border-radius: 50px;
	}
	.btn{
		background: #172f87!important;
	}
	.btnBox{
		margin-top: 90px;
		padding: 30px;
	}
	.newUpBox{
		background: rgba(0,0,0,0.35);
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.updateBg{
		width: 600upx;
		height: 300upx;
		margin-left: 75upx;
		margin-top: 200upx;
		background: url(../../static/updateBg.png) no-repeat top;
		background-size: 100% 100%;
		padding: 300upx 0 20upx;
		line-height: 30px;
		position: relative;
	}
	.upText{
		padding: 0 40upx;
	}
	.newUpbtnBox{
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 50px;
		border-top: 1upx solid #ddd;
		line-height: 50px;
	}
	.noUpBtn{
		width: 50%;
		float: left;
		text-align: center;
		color: #aaa;
		border-right: 1upx solid #ddd;
	}
	.upBtn{
		width: calc(50% - 1upx);
		float: left;
		text-align: center;
		color: #00B7F0;
	}
</style>
