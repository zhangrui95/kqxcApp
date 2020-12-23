<template>
	<view>
		<uni-list style="margin-top: 7px;">
			<uni-list-item :showArrow="false">
			    <view>通知标题(必填)</view>
				<view>
					  <input placeholder='请输入通知标题' style="margin-top: 10px;" placeholder-style="color:#ccc" @input="getTitle"/>
				</view>
			</uni-list-item>
		    <uni-list-item :showArrow="false">
		        <view>通知内容(必填)</view>
				<view>
					  <textarea maxlength="1000" placeholder='请输入通知内容' style="height: 80px;margin-top: 10px;" placeholder-style="color:#ccc" @input="getTextarea"/>
				</view>
		    </uni-list-item>
			<uni-list-item :showArrow="false">
			    <view>通知图片</view>
				<view class="img-list">
					<image src="../../static/picter.png" class="imgItem" @click="upImg1"></image>
					<view v-for="(item,index) in imgs" class="threeImg"> 
						<view class="imgItemBox">
							<image :src="item" class="imgItem" @click="bigImg(imgs,index)"></image>
							<image src="../../static/del.png" class="del" @click="getDelImg(index)"></image>
						</view>
					</view>
				</view>
			</uni-list-item> 
		</uni-list>
		<view class="btnBox">
			   <button type="primary" :disabled="!(title&&nr)" @click="getSave">提交</button>
		</view>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import moment from 'moment';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {getConfig, setXjData,setXjDataUpLoad,setXjAllData,getWtData,setWtData,getUsersAllData} from '../common/env.js'
	let latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/
	let longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/
	export default {
		data() {
			return {
				record:'',
				imgs:[],
				imgsNet:[],
				title:'',
				nr:''
			}
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			
		}, 
		methods: {
			getTitle:function(e){
							  // console.log(e.target.value)
							  this.title = e.target.value;
			},
			getTextarea:function(e){
							  // console.log(e.target.value)
							  this.nr = e.target.value;
			},
			getSave:function(){
				let that = this;
				uni.getNetworkType({
				    success: function (res) {
						if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
							uni.getStorage({
							    key: 'userData',
							    success: function (res) {
									if(res.data){
										console.log('JSON.parse(res.data)',JSON.parse(res.data))
										if(JSON.parse(res.data).org_id){
											that.getZzjg({id:JSON.parse(res.data).org_id,name:JSON.parse(res.data).org_name || '组织架构'});
										}
									}
								},
							});
						}else{
							uni.showToast({
								title:'当前网络异常，请重新操作',
								icon:'none'
							});
						}
					},
				});
			},
			getZzjg:function(item,isUnPush){
				uni.request({
					 url: getApp().globalData.ip + '/getOrgData',
					 data: {
						id:item.id
					},
					 method:'POST',
					 success: (res) => {
						 // console.log('组织架构',res.data);
						 if(res&&res.data&&res.data.data){
							 let parent = res.data.data.parent ? res.data.data.parent : {};
							 if(parent && parent.track_code){
								 // console.log('parent.track_code',parent.track_code);
								 this.getSend(parent.track_code);
							 }
						 }
					 }
				});
			},
			getSend:function(track_code){
				uni.request({
					 url: getApp().globalData.ip + '/postNotice',
					 data: {
						title: this.title,
						text: this.nr,
						img_url: this.imgsNet&&this.imgsNet.length > 0 ? this.imgsNet.join('#') : '',
						poster_user_id: getApp().globalData.uid,
						track_code: track_code
					},
					 method:'POST',
					 success: (res) => {
						// console.log('res=====>',res.data);
						if(!res.data.error){
							uni.showToast({
								title: '下发成功',
								duration: 800,
								success:()=>{
									setTimeout(()=>{
										uni.navigateBack({
											delta: 1
										});
									},800)
								}
							});
						}
					 }
				});
			},
			upImg1:function(e){
				let that = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    // sourceType: ['camera'], //调用相机
					sourceType: ['album'], //从相册选择
				    success: function (resImg) {
						// console.log('JSON.stringify(resImg.tempFilePaths[0])',JSON.stringify(resImg.tempFilePaths[0]))
							  uni.saveFile({
							      tempFilePath: resImg.tempFilePaths[0],
							      success: function (res) {
							        let savedFilePath = res.savedFilePath;
							  								// console.log('savedFilePath====>',savedFilePath)
							  								let imgs = that.imgs;
							  								that.imgs.push(savedFilePath);
							  								that.imgs = imgs;
							  								// console.log('this.imgs========>',that.imgs)
							      }
							    });
								uni.getNetworkType({
									success: function (res) {
										// console.log('网络状态',res.networkType);
										if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
											// console.log('getApp().globalData.weedIp',getApp().globalData.weedIp,resImg.tempFilePaths[0])
											uni.uploadFile({
												url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
												filePath: resImg.tempFilePaths[0],
												name: 'file',
												formData: {
													'user': 'test'
												},
												success: (uploadFileRes) => {
													let imgsNet = that.imgsNet;
													that.imgsNet.push(JSON.parse(uploadFileRes.data).fileUrl);
													that.imgsNet = imgsNet;
												}
											});
										}
									}
								});
						
				    }
				});
			},
			bigImg:function(urls,current){
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
			},
			getDelImg:function(index){
				this.imgs.splice(index,1);
				this.imgs = this.imgs;
			},
			//生成id
			makeId:function(thelen){
			  let text = '';
			  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			  for (var i = 0; i < thelen; i++)
			  text += possible.charAt(Math.floor(Math.random() * possible.length));
			  return text;
			},
			
		}
	}
</script>

<style>
uni-button[disabled]{
	background: #C7C7C7!important;
	color: #fff;
}
.imgItemBox{
	position: relative;
	z-index: 1;
}
/deep/ .uni-dialog-title-text{
	    width: 80%;
	    text-align: center;
}
.del{
	position: absolute;
	right: 4px;
	top: -5px;
	width: 16px;
	height: 16px;
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
