<template>
	<view>
		<view class="headerTop">
			<image src="../../static/myHeader.png" style="width: 120px;height: 120px;"></image>
			<view class="name">{{name}}</view>
		</view>
		<uni-list style="margin-top:10px;">
			<uni-list-item thumb="../../static/msg.png" title="我的消息" @click="myMessage" :show-badge="parseInt(allNum) > 0 ? true : false" :badge-text="allNum" badge-type="error"></uni-list-item>
		    <uni-list-item thumb="../../static/bbjc.png" title="检测版本" @click="getUpdate"></uni-list-item>
			<!-- <uni-list-item thumb="../../static/rjxy.png" title="软件许可协议"></uni-list-item> -->
		</uni-list>
       <!-- <uni-list style="margin-top:80px;">
		    <uni-list-item :show-arrow="false" @click="choice">
				<view class="listBtn">切换账号</view>
			</uni-list-item>
		</uni-list> -->
		<uni-list style="margin-top:140px;">
		    <uni-list-item :show-arrow="false" @click="getOk">
				<view class="listBtn">退出登陆</view>
			</uni-list-item>
		</uni-list>
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
		},
		onShow() {
			if(this.$refs.tabBar){
				this.$refs.tabBar.getNum();
			}
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
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		methods: {
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
				  uni.removeStorage({
				      key: 'userData',
				      success: function (res) {
				        uni.reLaunch({
				            url: '../login/index'
				        });
				      }
				  });
			},
			getUpdate:function(){
				let that = this;
				uni.getNetworkType({
				    success: function (res) {
						if(res.networkType !== 'none'){
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
										if(getApp().globalData.version < res.data.data.last_version){
											uni.hideLoading();
											uni.showModal({
											    title: '检测到最新版本,是否确认更新？',
											    success: function (resDate) {
											        if (resDate.confirm) {
														that.load = true;
											   //          console.log('res.data.data.app_down=====>',res.data.data.app_down);
														const downloadTask = uni.downloadFile({
														    url: res.data.data.app_down,
														    success: (res) => {
														        if (res.statusCode === 200) {
																	that.load = false; 
																	plus.runtime.install(res.tempFilePath);
														            console.log('下载成功');
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
											    title: '当前版本已是最新版本',
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
</style>
