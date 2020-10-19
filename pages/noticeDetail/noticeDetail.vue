<template>
	<view>
		<uni-list>
			<uni-list-item :showArrow="false">
				<view class="name">这是通知标题</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="address"><text style="float: left;">发布时间：2020-10-19 13:22:51</text></view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="address">通知内容：通知内容通知内容通知内容通知内容，通知内容通知内容通知内容，通知内容通知内容通知内容，通知内容通知内容。</view>
			</uni-list-item>
			<uni-list-item :showArrow="false" >
			    <view class="address">图片：</view>
				<view class="img-list">
					<image :src="item" class="imgItem" @click="getBigImg(imgList,index)" v-for="(item,index) in imgList"></image>
				</view>
			</uni-list-item> 
			</uni-list-item>
			<uni-list-item :showArrow="false" v-if="!isReceived">
				<view class="address">通知人数：30人，已读人数：16人</view>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList:['https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg','https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg'],
				isReceived:false,
			
			}
		},
		onLoad:function(option){
			this.isReceived =  option.isReceived ? option.isReceived : false;
		},
		methods: {
				getBigImg:function(urls,current){
					uni.previewImage({
						current:current,
						urls: urls,
						longPressActions: {
							itemList: ['保存图片'],
							success: function(data) {
								// console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							},
							fail: function(err) {
								// console.log(err.errMsg);
							}
						}
					})
				}
		}
	}
</script>

<style>
	.uni-tag--primary{
		float: left;
		background: #41BEF9!important;
		border: 1px solid #41BEF9!important;
		padding: 0 5px!important;
		height:20px!important;
		line-height: 19px!important;
		transform: scale(0.70);
	}
	/deep/ .uni-tag--primary .uni-tag-text{
		font-size: 12px;
	}
	.uni-tag--error{
		float: left;
		background: #f25b4a!important;
		border: 1px solid #f25b4a!important;
		padding: 0 5px!important;
		height:20px!important;
		line-height: 19px!important;
		transform: scale(0.70);
	}
	/deep/ .uni-tag--error .uni-tag-text{
		font-size: 12px;
	}
	.uni-tag--warning{
		float: left;
		background: #f4bb52!important;
		border: 1px solid #f4bb52!important;
		padding: 0 5px!important;
		height:20px!important;
		line-height: 19px!important;
		transform: scale(0.70);
	}
	/deep/ .uni-tag--warning .uni-tag-text{
		font-size: 12px;
	}
.threeImg{
	float: left;
}
.imgItem{
	width: 60px;
	height: 60px;
	margin-right:8px;
	float: left;
}
.btnBox{
	width: 90%;
	margin: 20px 5%;
}
.btnBox button{
	background: #108EE9;
}
.uni-label-pointer{
	font-size: 14px;
}
/deep/ .uni-radio-input{
	margin-left: 10px;
}	
/deep/ .uni-radio-input-checked{
	background-color: #108EE9!important;
	border-color: #108EE9!important;
}
.uni-list-item--hover{
	background: #fff!important;
}
.boxTop{
		background: #fff;
		width: 92%;
		height: auto;
		overflow: hidden;
		padding: 10px 4%;
	}
	.name{
		color: #000000;
	}
	.address{
		font-size: 14px;
		color: #666;
		line-height: 22px;
	}
	.img-list{
		margin-top: 10px;
	}
	.videoBox{
		position: absolute;
		width: 100%;
		height: 100%;
		background: #000;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.videoItem{
		width: 100%;
	}
</style>
