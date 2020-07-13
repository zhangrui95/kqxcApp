<template>
	<view>
		<view class="headerTop">
			<image src="../../static/myHeader.png" style="width: 120px;height: 120px;"></image>
			<view class="name">{{name}}</view>
		</view>
		<uni-list style="margin-top:10px;">
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
		<tabBar :pagePath="'/pages/myPage/myPage'" :num="num"></tabBar>
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
			getOk:function(){
				 this.$refs.popup.open();
			},
			close:function(){
				 this.$refs.popup.close();
			},
			confirm:function(){
				 this.$refs.popup.close();
				 uni.reLaunch({
				     url: '../login/index'
				 });
			},
			getUpdate:function(){
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
										if(getApp().globalData.version !== res.data.data.last_version){
											uni.hideLoading();
											uni.showModal({
											    title: '检测到最新版本,是否确认更新？',
											    success: function (res) {
											        if (res.confirm) {
											            // console.log('用户点击确定');
														uni.downloadFile({
														    url: res.data.data.app_down,
														    success: (res) => {
														        if (res.statusCode === 200) {
														            // console.log('下载成功');
														        }
														    }
														});
											        } else if (res.cancel) {
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
</style>
