<template>
	<view>
		<view class="headerTop">
			<image src="../../static/myHeader.png" style="width: 120px;height: 120px;"></image>
			<view class="name">卢展</view>
		</view>
		<uni-list style="margin-top:10px;">
		    <uni-list-item thumb="../../static/bbjc.png" title="检查版本"></uni-list-item>
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
		<tabBar :pagePath="'/pages/myPage/myPage'"></tabBar>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		data() {
			return {
				
			}
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
