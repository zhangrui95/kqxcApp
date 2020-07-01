<template name='detailList'>
	<view>
		<uni-list>
				<uni-list-item :show-arrow="true" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>2019年11月10日</text></view>
					<view class="msgBox">
						<text class="leftBox">巡查时间：10:22</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text>无异常</text><text style="margin-left: 5px;">8照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="true" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>2019年12月10日</text></view>
					<view class="msgBox">
						<text class="leftBox">巡查时间：11:56</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text style="color: #ee4c26;">有异常</text><text style="margin-left: 5px;">5照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="true" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>2019年11月10日</text></view>
					<view class="msgBox">
						<text class="leftBox">巡查时间：10:22</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text>无异常</text><text style="margin-left: 5px;">8照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="true" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>2019年11月10日</text></view>
					<view class="msgBox">
						<text class="leftBox">巡查时间：10:22</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text>无异常</text><text style="margin-left: 5px;">8照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="true" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>2019年12月10日</text></view>
					<view class="msgBox">
						<text class="leftBox">巡查时间：11:56</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text style="color: #ee4c26;">有异常</text><text style="margin-left: 5px;">5照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="true" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>2019年11月10日</text></view>
					<view class="msgBox">
						<text class="leftBox">巡查时间：10:22</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text>无异常</text><text style="margin-left: 5px;">8照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="true" @click="goDetail('巫山矿山')">
					<view class="listTitle"><text>2019年12月10日</text></view>
					<view class="msgBox">
						<text class="leftBox">巡查时间：11:56</text>
						<text class="rightBox">巡查人：张三</text>
					</view>
					<view class="msgBox">
						<text class="leftBox">巡查结果：<text>未开采</text></text>
						<text class="rightBox">矿山状态：<text style="color: #ee4c26;">有异常</text><text style="margin-left: 5px;">5照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：需场人填写备注</text>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
</template>

<script>
	export default {
		name:'detailList',
		data() {
			return {
			
			}
		},
		methods: {
	
		}
	}
</script>

<style>
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
		margin-bottom: 80px;
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
		border: 1px!important;
	}
	.leftBox{
		width: 50%;
		float: left;
	}
	.rightBox{
		width: 50%;
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
	.buttonBox{
		position: fixed;
		bottom: 15px;
		width: 96%;
		left: 0;
		padding: 0 2%;
	}
	.buttonBox button{
		width: 46%;
		float: left;
		margin: 0 2%;
		border-radius: 50px;
	}
</style>
