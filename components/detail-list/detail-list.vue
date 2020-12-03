<template name='detailList'>
	<view>
		<view class="noList" v-if="list.length == 0"><image src="../../static/noList.png" style="width: 200px;height: 123px;"></image>
				<view>暂无数据</view>
		</view>
		<uni-list v-if="list.length > 0">
				<uni-list-item :show-arrow="true" @click="goDetail(item,record)" v-for="(item,index) in list">
					<view class="listTitle"><text>{{item.dk_sj.substring(0,10)}}</text></view>
					<view class="msgBox">
						<text class="leftBox">巡查时间：{{item.dk_sj.substring(11,19)}}</text>
						<text class="rightBox">巡查人：{{item.xm}}</text>
					</view>
					<view class="msgBox">
						<!-- <text class="leftBox">巡查结果：<text :style="{color:item.kczt_dm === '02' ? '#747474' : '#2de17e'}">{{item.kczt_dm === '02' ? '未开采' : '开采中'}}</text></text> -->
						<text class="rightBox">巡查结果：<text :style="{color:item.yczt_dm === '02' ? '#747474' : '#ee4c26'}">{{item.yczt_dm === '02' ? '未发现异常' : '发现异常'}}</text>
						<text style="margin-left: 5px;">{{item.jj_zp.split('#').length}}张照片</text></text> 
					</view>
					<view class="msgBox">
						<text class="bzBox">备注：{{item.bz}}</text>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
</template>

<script>
	export default {
		name:'detailList',
		props:{
			list: Array,
			record: Object,
		},
		data() {
			return {
			
			}
		},
		methods: {
			goDetail:function(item,record){ 
				if(record&&JSON.stringify(record)){
					uni.navigateTo({
					    url: '../../pages/inspectionDetail/inspectionDetail?detail='+JSON.stringify(item) + '&record=' + JSON.stringify(record)
					});
				}else{
					uni.navigateTo({
					    url: '../../pages/inspectionDetail/inspectionDetail?detail='+JSON.stringify(item)
					});
				}
			}
		}
	}
</script>

<style>
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		padding:30px 0;
		background: #F5F5F5;
	}
	.uni-list-item__container{
		border: 0!important;
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
