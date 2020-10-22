<template>
	<view>
		<uni-list>
			<uni-list-item :showArrow="false">
				<view class="name">{{record.title}}</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="address"><text style="float: left;">发布时间：{{record.cjsj}}</text></view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="address">通知内容：{{record.text}}</view>
			</uni-list-item>
			<uni-list-item :showArrow="false" v-if="imgList&&imgList.length > 0">
			    <view class="address">图片：</view>
				<view class="img-list">
					<image :src="item" class="imgItem" @click="getBigImg(imgList,index)" v-for="(item,index) in imgList"></image>
				</view>
			</uni-list-item> 
		</uni-list>
		<uni-collapse v-if="!isReceived" style="border-top: 1px solid #eee;">
		    <uni-collapse-item :showAnimation="true" :title="'通知人数：'+record.receiver_total+'人，已读人数：'+ (record.receiver_total - record.receiver_unread) + '人'">
		        <uni-list>
		            <uni-list-item :showArrow="false" v-for="item in personList">
						<view class="address"><text style="float: left;">{{item.xm}}</text>
							<uni-tag :text="item.is_read == '1' ? '已读' : '未读'" :type="item.is_read == '1' ? 'primary' : 'warning'"></uni-tag>
						</view>
					</uni-list-item>
		        </uni-list>
		    </uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		data() {
			return {
				imgList:[],
				isReceived:false,
				record:{},
				personList:[]
			}
		},
		components: {uniCollapse,uniCollapseItem},
		onLoad:function(option){
			this.isReceived =  option.isReceived ? option.isReceived : false;
			this.record = option.record ? JSON.parse(option.record):{};
			this.imgList = this.record.img_url ? this.record.img_url.split('#') : [];
			if(this.isReceived){
				uni.request({
					 url: getApp().globalData.ip + '/getNoticeDetail',
					 data: {
						user_id: getApp().globalData.uid,
						notice_id:this.record.id,
					},
					 method:'POST',
					 success: (res) => {}
				});
			}else{
				uni.request({
					 url: getApp().globalData.ip + '/getNoticeReceiverUserList',
					 data: {
						notice_id:this.record.id,
					},
					 method:'POST',
					 success: (res) => {
						console.log('detail=====>',res.data);
						if(res.data){
							this.personList = res.data.data ? res.data.data : [];
						}
					 }
				});
			}
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
	.uni-collapse-cell__title{
		color: #666;
	}
	.uni-collapse-cell__title-text{
		font-size: 14px!important;
	}
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
