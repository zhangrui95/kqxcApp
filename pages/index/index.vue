<template>
	<view class="box">
		<view class="header">
			<text class="titleName">矿山<text class="time">{{time}}</text></text>
		</view>
		<view class="warnTop">
			提示：有1个矿区巡检逾期，2个矿区需要2日内巡检。
		</view>
		<view class="listBox">
			<uni-list>
			    <uni-list-item :show-arrow="false" @click="goDetail('黑山矿山')">
					<view class="listTitle"><text>黑山矿山</text><uni-tag text="巡检逾期" type='error'></uni-tag></view>
					<view class="msgBox">
						<text class="leftBox">上次巡查：2019年12月10日 11:56</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text style="color: #2de17e;">开采中</text></text>
						<text class="rightBox">矿山状态：<text>无异常</text><text style="margin-left: 5px;">4照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>巫山矿山</text><uni-tag text="2日内巡检" type='warning'></uni-tag></view>
					<view class="msgBox">
						<text class="leftBox">上次巡查：2019年12月10日 11:56</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text style="color: #ee4c26;">有异常</text><text style="margin-left: 5px;">8照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="false" @click="goDetail('卢山矿山')">
					<view class="listTitle"><text>卢山矿山</text><uni-tag text="2日内巡检" type='warning'></uni-tag></view>
					<view class="msgBox">
						<text class="leftBox">上次巡查：2019年12月10日 11:56</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text style="color: #2de17e;">开采中</text></text>
						<text class="rightBox">矿山状态：<text>无异常</text><text style="margin-left: 5px;">5照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注，需场人填写备注，需场人填写备注，需场人填写备注，需场人填写备注。</text>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		data() {
			return {
				time: moment().format('YYYY.MM.DD')
			}
		},
		methods: {
			goDetail: function(e) {
				console.log('e',e);
				uni.navigateTo({
				    url: '../detailKs/detailKs?name='+e
				});
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
	.leftBox{
		width: 60%;
		float: left;
	}
	.rightBox{
		width: 40%;
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
	.listBox{
		margin-top: 74px;
		width: 100%;
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
		top: 44px;
		left: 0;
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
