<template>
	<view>
		<view class="boxList">
			<view class="noList" v-if="list.length == 0">暂无数据</view>
			<uni-list v-if="list.length > 0">
					<uni-list-item v-for="(item,index) in list">
						<view @click="getDetail()">
							<view class="listTitle"><text>{{item.mc}}</text></view>
							<view class="msgBox">
								<text class="ztTitle">这是标题</text> <uni-icons type="image" size="16" color="#666" style="margin-left: 5px;"></uni-icons>
							</view>
							<view class="msgBox">
								<text class="bzBox">通知内容：这是内容，这是内容，这是内容这是内容，这是内容。</text>
							</view>
							<view class="msgBox">
								<text class="bzBox">时间：2020-10-17</text>
								<view class="wdbj" v-if="item.type=='0'"></view>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
		</view> 
	</view>
</template>

<script>
	import moment from 'moment';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import detailList from "@/components/detail-list/detail-list.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {getWtData,setWtData} from '../common/env.js'
	export default {
		data() {
			return {
				name:'',
				time: moment().format('YYYY.MM.DD'),
				list:[{type:'0'},{type:'1'},{type:'0'}],
				item:{},
				text:'',
			}
		},
		components: {
			detailList,
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
	    onShow: function (option) { //option为object类型，会序列化上个页面传递的参数
			
		}, 
		methods: {
			getDetail:function(item){
				uni.navigateTo({
				    url: '../noticeDetail/noticeDetail?isReceived=true'
				});
			},
		}
	}
</script>

<style>
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
	.ztTitle{
		color: #333;
		font-size: 16px;
	}
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		height: 50px;
		line-height: 50px;
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
	.wdbj{
		position: absolute;
		bottom:15px;
		right: 15px; 
		width: 10px;
		height: 10px;
		border-radius: 20px;
		background: #F45151;
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
