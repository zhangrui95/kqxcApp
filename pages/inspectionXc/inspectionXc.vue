<template>
	<view>
		<view class="boxTop" v-if="record">
			<view class="name">{{record.mc}}</view>
			<view class="address">矿山地址：{{record.dz}}</view>
			<view class='address'>矿山说明：{{record.ms}}</view>
		</view>
		<!-- 右侧插槽 -->
		<uni-list>
		   <!-- <uni-list-item title="开采状态：" :showArrow="false">
		        <template v-slot:right="">
		            <view>
						 <radio-group @change="radioChangeKc">
							  <label class="radio"><radio value="01" :checked="currentKc=='01'"/>开采中</label>
							  <label class="radio"><radio value="02" :checked="currentKc=='02'"/>未开采</label>
						 </radio-group>
		            </view>
		        </template>
		    </uni-list-item> -->
			<uni-list-item title="异常状态：" :showArrow="false" v-if="is_yczt">
			    <template v-slot:right="">
			        <view>
						<radio-group @change="radioChangeYc">
			              <label class="radio"><radio value="01" :checked="currentYc==='01'"/>异常</label>
			              <label class="radio"><radio value="02" :checked="currentYc==='02'"/>无异常</label>
						</radio-group>
			        </view>
			    </template>
			</uni-list-item>
			<uni-list-item title="是否对周边进行地毯式巡查：" :showArrow="false" v-if="is_yczt">
			    <template v-slot:right="">
			        <view>
						<radio-group @change="radioChangeXc">
			              <label class="radio"><radio value="1" :checked="currentXc==='1'"/>是</label>
			              <label class="radio"><radio value="0" :checked="currentXc==='0'"/>否</label>
						</radio-group>
			        </view>
			    </template>
			</uni-list-item>
		</uni-list>
		<uni-list style="margin-top: 7px;">
		    <uni-list-item :showArrow="false">
		        <view>备注说明（{{is_yczt ? '选填' : '必填'}}）</view>
				<view>
					  <textarea placeholder='请输入异常说明或备注' style="height: 80px;margin-top: 10px;" placeholder-style="color:#ccc" @input="getTextarea"/>
				</view>
		    </uni-list-item>
			<!-- <uni-list-item :showArrow="false">
			    <view>远景照片（{{imgs.length}}）</view>
				<view class="img-list">
					<image src="../../static/picter.png" class="imgItem" @click="upImg1"></image>
					<view v-for="(item,index) in imgs" class="threeImg"> 
						<view class="imgItemBox">
							<image :src="item" class="imgItem" @click="bigImg(imgs,index)"></image>
							<image src="../../static/del.png" class="del" @click="getDelImg(index)"></image>
						</view>
					</view>
				</view>
			</uni-list-item> -->
			<uni-list-item :showArrow="false">
			    <view>拍摄照片（{{imgsJ.length}}）</view>
			    <view class="img-list">
					<image src="../../static/picter.png" class="imgItem" @click="upImg2"></image>
			    	<view v-for="(item,index) in imgsJ" class="threeImg">
						<view class="imgItemBox">
							<image :src="item" class="imgItem"  @click="bigImg(imgsJ,index)"></image>
							<image src="../../static/del.png" class="del" @click="getDelImg1(index)"></image>
						</view>
			    	</view>
			    </view>
			</uni-list-item>
			<uni-list-item :showArrow="false"> 
			    <view>上传视频（{{video.length}}/3）</view>
			    <view class="img-list">
					<image src="../../static/picter.png" class="imgItem" @click="upVideo" v-if="video.length < 3"></image>
			    	<view v-for="(item,index) in video" class="threeImg">
						<view class="imgItemBox">
							<video :src="item" class="imgItem" @play="bigVideo(item)" v-if="!playUrl"></video>
							<image src="../../static/del.png" class="del" @click="getDelVideo(index)"></image>
						</view>
			    	</view>
			    </view>
			</uni-list-item>
<!-- 			<uni-list-item :showArrow="false">
			    <view>上传音频</view>
			    <view class="img-list">
					<button v-if="!voicePath" @click="startRecorder ? stopAudio() : upAudio()">{{startRecorder ? '结束录音' : '开始录音'}}</button>
			    	<view class="threeImg" v-if="voicePath">
						<view class="imgItemBox">
							<audio :src="voicePath" class="imgItem" @play="bigVideo(item)" v-if="!playUrl"></audio>
							<image src="../../static/del.png" class="del" @click="getDelAudio(index)"></image>
						</view>
			    	</view>
			    </view>
			</uni-list-item> -->
		</uni-list>
		<view class="videoBox" v-if="playUrl">
			<video :src="playUrl" autoplay="true" class="videoItem"></video>
		</view>
		<view class="btnBox">
			   <button type="primary" :disabled="(!(imgsJ.length > 0 && (is_yczt ? true : bz))) || load" @click="getSave" :loading="btnLoading">提交</button>
		</view>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" :title='"上级负责人联系方式"+sjLxfs+"确定将联系上级负责人反馈？"' okText="确定" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
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
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	export default {
		data() {
			return {
				record:'',
				currentKc: '02',
				currentYc: '02',
				currentXc:'1',
				kc:true,
				yc:false,
				imgs:[],
				imgsJ:[],
				imgsNet:[],
				imgsJNet:[],
				video:[],
				videoNet:[],
				audio:[],
				audioNet:[],
				setXjDataUpLoad:[],
				bz:'',
				wtList:[],
				max_dkjl:500,
				PI:3.14159265358979324,
				ydJd:'',
				ydWd:'',
				ydDistance:'',
				playUrl:'',
				is_yczt:true,
				sjLxfs:'',
				startRecorder: false,
				voicePath:'',
				isLx:getApp().isLx,
				load:false,
				btnLoading:false,
			}
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		onBackPress:function(event){
			console.log('=================执行返回================');
			if(this.playUrl){
				this.playUrl = '';
				return true;
			}else{
				return false;
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			       let self = this;
					recorderManager.onStop(function (res) {
						console.log('recorder stop' + JSON.stringify(res));
						self.voicePath = res.tempFilePath;
					});
					this.record = option&&option.record && JSON.parse(option.record) ? JSON.parse(option.record) : '';
					this.is_yczt = option.is_yczt ? false : true;
					if(option.is_yczt){
						uni.setNavigationBarTitle({
						    title: '异常反馈'
						});
						this.currentYc = '01';
					}
					console.log('this.record',this.record)
					getWtData(` SELECT A.*, B.dz, C.xm as wtr_xm, C.lxdh as wtr_lxdh FROM wtData A
					LEFT JOIN ksData B ON A.ks_id = B.id
					LEFT JOIN usersData C ON A.fqr_id = C.id
					WHERE A.bwtr_id = '${getApp().globalData.uid}' ORDER BY A.wt_sj DESC`,(data)=>{
												// console.log('委托',data);
												 this.wtList = data;
											});
					getConfig('select * from config',(data)=>{
						if(data && data[0] && data[0].max_dkjl){
							  this.max_dkjl = max_dkjl;
						}
					});
		}, 
		methods: {
			transformLon : function (x, y) {
					var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
					ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
					ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
					ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
					return ret;
				},
				 transformLat : function (x, y) {
						var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
						ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
						ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
						ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
						return ret;
					},
				delta : function (lat, lon) {
					var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
					var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
					var dLat = this.transformLat(lon - 105.0, lat - 35.0);
					var dLon = this.transformLon(lon - 105.0, lat - 35.0);
					var radLat = lat / 180.0 * this.PI;
					var magic = Math.sin(radLat);
					magic = 1 - ee * magic * magic;
					var sqrtMagic = Math.sqrt(magic);
					dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
					dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
					return {'lat': dLat, 'lon': dLon};
				},
			distance:function(lat1, lon1, lat2, lon2) {
			 if ((lat1 == lat2) && (lon1 == lon2)) {
			  return 0;
			 }else {
			  var radlat1 = Math.PI * lat1/180;
			  var radlat2 = Math.PI * lat2/180;
			  var theta = lon1-lon2;
			  var radtheta = Math.PI * theta/180;
			  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			  if (dist > 1) {
			   dist = 1;
			  }
			  dist = Math.acos(dist);
			  dist = dist * 180/Math.PI;
			  dist = dist * 60 * 1.1515;
			  dist = parseInt(dist * 1.609344 * 1000);
			  return dist;
			 }
			},
			outOfChina : function (lat, lon) {
				if (lon < 72.004 || lon > 137.8347)
					return true;
				if (lat < 0.8293 || lat > 55.8271)
					return true;
				return false;
			},
			//GCJ-02 to WGS-84
			gcj_decrypt:function (gcjLat, gcjLon) {
				if (this.outOfChina(gcjLat, gcjLon))
					return {'lat': gcjLat, 'lon': gcjLon};
				var d = this.delta(gcjLat, gcjLon);
				return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
			},
			  getTextarea:function(e){
				  // console.log(e.target.value)
				  this.bz = e.target.value;
			  },
			  radioChangeKc: function(evt) {
			     this.currentKc = evt.target.value;
			},
			radioChangeYc: function(evt) {
				this.currentYc = evt.target.value;
			},
			radioChangeXc: function(evt) {
				this.currentXc = evt.target.value;
			},
			upImg1:function(e){
				let that = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['camera'], //调用相机
					// sourceType: ['album'], //从相册选择
				    success: function (resImg) {
						console.log('JSON.stringify(resImg.tempFilePaths[0])',JSON.stringify(resImg.tempFilePaths[0]))
						  // let ydJd = JSON.stringify(resImg.tempFilePaths[0]) && JSON.stringify(resImg.tempFilePaths[0]).split('-')&&JSON.stringify(resImg.tempFilePaths[0]).split('-')[1] ? JSON.stringify(resImg.tempFilePaths[0]).split('-')[1] : '';
						  // let ydWd = JSON.stringify(resImg.tempFilePaths[0])&&JSON.stringify(resImg.tempFilePaths[0]).split('-')&&JSON.stringify(resImg.tempFilePaths[0]).split('-')[2] ? JSON.stringify(resImg.tempFilePaths[0]).split('-')[2] : '';
						  // if(longrg.test(ydJd) && latreg.test(ydWd)){
							 //  let ydDistance = that.distance(that.record.jd,that.record.wd,ydJd,ydWd);
							 //  if(ydDistance <= that.max_dkjl){
							 //  							  if(!that.ydDistance){
							 //  								  that.ydDistance = ydDistance;
							 //  								  that.ydJd = ydJd;
							 //  								  that.ydWd = ydWd;
							 //  							  }else{
							 //  								  if(ydDistance < that.ydDistance){
							 //  									  that.ydDistance = ydDistance;
							 //  									  that.ydJd = ydJd;
							 //  									  that.ydWd = ydWd;
							 //  								  }
							 //  							  }
							 //  }
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
										if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g' && !that.isLx){
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
						  // }else{
							 //  uni.showToast({
							 //  	title:'请选择新版元道相机拍摄的现场图片',
							 //  	icon:'none',
								// duration: 2000
							 //  });
						  // }
				    }
				});
			},
			upImg2:function(e){
				let that = this;
				uni.chooseImage({
				    count: 1, //默认9 
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    // sourceType: ['album'], //从相册选择
					sourceType: ['camera'], //调用相机
				    success: function (resImg) {
						// let ydJd = JSON.stringify(resImg.tempFilePaths[0]) && JSON.stringify(resImg.tempFilePaths[0]).split('-')&&JSON.stringify(resImg.tempFilePaths[0]).split('-')[1] ? JSON.stringify(resImg.tempFilePaths[0]).split('-')[1] : '';
						// let ydWd = JSON.stringify(resImg.tempFilePaths[0])&&JSON.stringify(resImg.tempFilePaths[0]).split('-')&&JSON.stringify(resImg.tempFilePaths[0]).split('-')[2] ? JSON.stringify(resImg.tempFilePaths[0]).split('-')[2] : '';
						// if(longrg.test(ydJd) && latreg.test(ydWd)){
						// 	let ydDistance = that.distance(that.record.jd,that.record.wd,ydJd,ydWd);
						// 	if(ydDistance <= that.max_dkjl){
						// 		  if(!that.ydDistance){
						// 			  that.ydDistance = ydDistance;
						// 			  that.ydJd = ydJd;
						// 			  that.ydWd = ydWd;
						// 		  }else{
						// 			  if(ydDistance < that.ydDistance){
						// 				  that.ydDistance = ydDistance;
						// 				  that.ydJd = ydJd;
						// 				  that.ydWd = ydWd;
						// 			  }
						// 		  }
						// 	}
						uni.showLoading({
						    title: '图片上传中…',
							mask:true
						});
						that.load = true;
								uni.getNetworkType({
								    success: function (res) {
										if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g' && !that.isLx){
											// console.log('getApp().globalData.weedIp',getApp().globalData.weedIp,resImg.tempFilePaths[0])
											uni.uploadFile({
												url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
												filePath: resImg.tempFilePaths[0],
												name: 'file',
												formData: {
												    'user': 'test'
												},
												success: (uploadFileRes) => {
													let imgsJNet = that.imgsJNet;
													that.imgsJNet.push(JSON.parse(uploadFileRes.data).fileUrl);
													that.imgsJNet = imgsJNet;
													uni.saveFile({
													    tempFilePath: resImg.tempFilePaths[0],
													    success: function (res) {
													      let savedFilePath = res.savedFilePath;
															let imgsJ = that.imgsJ;
															that.imgsJ.push(savedFilePath);
															that.imgsJ = imgsJ;
															uni.hideLoading();
															that.load = false;
													    }
													  });
												}
											});
										}else{
											uni.saveFile({
											    tempFilePath: resImg.tempFilePaths[0],
											    success: function (res) {
											      let savedFilePath = res.savedFilePath;
													let imgsJ = that.imgsJ;
													that.imgsJ.push(savedFilePath);
													that.imgsJ = imgsJ;
													uni.hideLoading();
													that.load = false;
											    }
											  });
										}
								    }
								});
						// }else{
						// 	uni.showToast({
						// 		title:'请选择新版元道相机拍摄的现场图片', 
						// 		icon:'none',
						// 		duration: 2000
						// 	});
						// }
				    }
				});
			},
			stopAudio:function(e){
				recorderManager.stop();
				this.startRecorder = false;
			},
			upAudio:function(e){ 
				let that = this;
				 recorderManager.start();
				 this.startRecorder = true;
				// uni.chooseVideo({
				//     count: 1, //默认9 
				//     sourceType: ['camera'], //从相册选择
				// 	maxDuration:15,
				//     success: function (resImg) {
				// 			  uni.saveFile({
				// 			      tempFilePath: resImg.tempFilePath,
				// 			      success: function (res) {
				// 			        let savedFilePath = res.savedFilePath;
				// 					let video = that.video;
				// 					video.push(savedFilePath);
				// 					that.video = video;
				// 			      }
				// 			    });
				// 				uni.getNetworkType({
				// 				    success: function (res) {
				// 						if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'){
				// 							uni.showLoading({
				// 							    title: '视频存储中…',
				// 								mask:true,
				// 							});
				// 							uni.uploadFile({
				// 								url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
				// 								filePath: resImg.tempFilePath,
				// 								name: 'file',
				// 								formData: {
				// 								    'user': 'test'
				// 								},
				// 								success: (uploadFileRes) => {
				// 									let videoNet = that.videoNet;
				// 									videoNet.push(JSON.parse(uploadFileRes.data).fileUrl);
				// 									that.videoNet = videoNet;
				// 									uni.hideLoading();
				// 								}
				// 							});
				// 						}
				// 				    }
				// 				});
				//     }
				// });
			},
			upVideo:function(e){
				let that = this;
				uni.chooseVideo({
				    count: 1, //默认9 
				    sourceType: ['camera'], //从相册选择
					maxDuration:15,
				    success: function (resImg) {
							  uni.saveFile({
							      tempFilePath: resImg.tempFilePath,
							      success: function (res) {
							        let savedFilePath = res.savedFilePath;
									let video = that.video;
									video.push(savedFilePath);
									that.video = video;
							      }
							    });
								uni.getNetworkType({
								    success: function (res) {
										if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'&& !that.isLx){
											uni.showLoading({
											    title: '视频存储中…',
												mask:true,
											});
											uni.uploadFile({
												url: getApp().globalData.weedIp, //仅为示例，非真实的接口地址
												filePath: resImg.tempFilePath,
												name: 'file',
												formData: {
												    'user': 'test'
												},
												success: (uploadFileRes) => {
													let videoNet = that.videoNet;
													videoNet.push(JSON.parse(uploadFileRes.data).fileUrl);
													that.videoNet = videoNet;
													uni.hideLoading();
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
				// uni.navigateTo({
				// 	 url: '../bigImg/bigImg'
				// })
			},
			bigVideo:function(item){
				console.log('item',item)
				this.playUrl = item;
			},
			getDelImg:function(index){
				this.imgs.splice(index,1);
				this.imgs = this.imgs;
			},
			getDelImg1:function(index){
				this.imgsJ.splice(index,1);
				this.imgsJ = this.imgsJ;
			},
			getDelVideo:function(index){
				this.video.splice(index,1);
				this.video = this.video;
			},
			//生成id
			makeId:function(thelen){
			  let text = '';
			  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			  for (var i = 0; i < thelen; i++)
			  text += possible.charAt(Math.floor(Math.random() * possible.length));
			  return text;
			},
			getUpLoadWt:function(uid,longitude,latitude,back,is_ycdk){
				uni.showLoading({
				    title: '保存中…',
					mask:true,
				});
				let that = this;
				let data = {
								id:that.makeId(32),
								ks_id:that.makeId(32),
								uid:uid,
								kczt_dm:that.currentKc,
								yczt_dm:that.currentYc,
								is_dtxc:that.currentXc,
								bz:that.bz,
								dk_sj:moment().format('YYYY-MM-DD HH:mm:ss'),
								dk_jd:longitude,
								dk_wd:latitude,
								yj_zp:that.imgs.join('#'),
								jj_zp:that.imgsJ.join('#'),
								dsp:that.video ? that.video.join('#') : '',
								yj_zp_net:that.imgsNet.join('#'),
								jj_zp_net:that.imgsJNet.join('#'),
								dsp_net:that.videoNet ? that.videoNet.join('#') : '',
								is_ycdk:is_ycdk,
						};
						// console.log('data=========>',data);
						uni.request({
						    url: getApp().globalData.ip + '/saveXjData',
						    data: data,
							method:'POST',
						    success: (res) => {
								// console.log('巡查成功',res.data);
								if(res.data.data && !res.data.error){
									    if(back){
											uni.hideLoading();
											uni.showToast({
												title: '巡查成功',
												duration: 800
											});
										}
										data.users_id = uid;
										setXjAllData([data],(res)=>{});
										setXjData([data],(res)=>{//存巡查记录
											if(back){
												uni.getStorage({
												    key: 'userData',
												    success: function (res) {
														if(res.data && !that.is_yczt){
															console.log('JSON.parse(res.data)',JSON.parse(res.data))
															if(JSON.parse(res.data).fkr_id){
																getUsersAllData(`select * from usersAllData WHERE id='${JSON.parse(res.data).fkr_id}'`,(res)=>{
																	that.sjLxfs = res[0].lxdh;
																});
															}
															uni.navigateTo({
															    url: '../success/success?fkr_id='+JSON.parse(res.data).fkr_id
															});
														}
													},
												});
												if(that.is_yczt){
													that.btnLoading = false;
													uni.navigateBack({
														delta: 1
													});
												}
											}
										});
								} else{
									uni.hideLoading();
									that.btnLoading = false;
									uni.showToast({
										title:'操作失败，请重试',
										icon:'none'
									});
								}
						    }
						});
			},
			close:function(){
				 this.$refs.popup.close();
				 uni.navigateBack({
				 	delta: 1
				 });
			},
			close1:function(){
				 this.$refs.popup1.close();
				 uni.navigateBack({
				 	delta: 1
				 });
			},
			confirm1:function(){
				this.close1();
			},
			confirm:function(){
				let that = this;
				this.$refs.popup.close();
				uni.makePhoneCall({
					phoneNumber: that.sjLxfs //仅为示例  
				});
				uni.navigateBack({
					delta: 1
				});
			},
			getNoNet:function(uid,longitude,latitude,back,is_ycdk){
				uni.showLoading({
				    title: '保存中…',
					mask:true,
				});
				let that = this;
				let dataEnNet = {
								id:that.makeId(32),
								ks_id:that.makeId(32),
								uid:uid,
								users_id:uid,
								kczt_dm:that.currentKc,
								yczt_dm:that.currentYc,
								is_dtxc:that.currentXc,
								bz:that.bz,
								dk_sj:moment().format('YYYY-MM-DD HH:mm:ss'),
								dk_jd:longitude,
								dk_wd:latitude,
								yj_zp:that.imgs.join('#'),
								jj_zp:that.imgsJ.join('#'),
								dsp:that.video ? that.video.join('#') : '',
								yj_zp_net:that.imgsNet.join('#'),
								jj_zp_net:that.imgsJNet.join('#'),
								dsp_net:that.videoNet ? that.videoNet.join('#') : '',
								is_ycdk:is_ycdk,
						};
						// console.log('dataEnNet=========>',dataEnNet);
						if(back){
							uni.hideLoading();
							that.btnLoading = false;
							uni.showToast({
								title: '当前网络环境较差，记录已离线保存成功',
								icon:'none',
								duration: 2000
							});	
						}
						setXjDataUpLoad([dataEnNet],(res)=>{});
						setXjAllData([dataEnNet],(res)=>{});
						setXjData([dataEnNet],(res)=>{//存巡查记录
							if(back){
								uni.getStorage({
								    key: 'userData',
								    success: function (res) {
										if(res.data && !that.is_yczt){
											console.log('用户信息1',JSON.parse(res.data).fkr_id);
											if(JSON.parse(res.data).fkr_id){
												getUsersAllData(`select * from usersAllData WHERE id='${JSON.parse(res.data).fkr_id}'`,(res)=>{
													console.log('上级？',res[0].lxdh);
													that.sjLxfs = res[0].lxdh;
												});
											}
											uni.navigateTo({
											    url: '../success/success?fkr_id='+JSON.parse(res.data).fkr_id
											});
										}
									},
								});
								if(that.is_yczt){
									that.btnLoading = false;
									uni.navigateBack({
										delta: 1 
									});
								}
							}
						});
			},
			getNetSave:function(longitude,latitude,is_ycdk,idx){
				let that = this;
				that.getUpLoadWt(getApp().globalData.uid,longitude,latitude,idx > -1 && that.wtList[idx].wtzt_dm === '02' ? false : true,is_ycdk);
				if(idx > -1 && that.wtList[idx].wtzt_dm === '02'){
					that.getUpLoadWt(that.wtList[idx].fqr_id,longitude,latitude,true,is_ycdk);
					uni.request({
						url: getApp().globalData.ip + '/updateWtData',
						data: {"wt_id":that.wtList[idx].id,"wtzt_dm":'04'},
						method:'POST',
						success: (res) => {
							// console.log('修改委托记录状态',res.data);
							if(res.data.data && !res.data.error){
									let dataItem = {"id":that.wtList[idx].id,"ks_id":that.wtList[idx].ks_id,"wt_sj":moment().format('YYYY-MM-DD HH:mm:ss'),"fqr_id":that.wtList[idx].fqr_id,"bwtr_id":that.wtList[idx].bwtr_id,"wtzt_dm":'04',"wtzt_mc":'已巡检'};
									// console.log('修改存储',dataItem);
									setWtData([dataItem],(res)=>{});
							} 
						}
					});
				}
			},
			getNoneNetSave:function(longitude,latitude,is_ycdk,idx){
				let that = this;
				that.getNoNet(getApp().globalData.uid,longitude,latitude,idx > -1 && that.wtList[idx].wtzt_dm === '02' ? false : true,is_ycdk);
				if(idx > -1 && that.wtList[idx].wtzt_dm === '02'){
					that.getNoNet(that.wtList[idx].fqr_id,longitude,latitude,true,is_ycdk);
				}
			},
			distance:function(lat1, lon1, lat2, lon2) {
			 if ((lat1 == lat2) && (lon1 == lon2)) {
			  return 0;
			 }else {
			  var radlat1 = Math.PI * lat1/180;
			  var radlat2 = Math.PI * lat2/180;
			  var theta = lon1-lon2;
			  var radtheta = Math.PI * theta/180;
			  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			  if (dist > 1) {
			   dist = 1;
			  }
			  dist = Math.acos(dist);
			  dist = dist * 180/Math.PI;
			  dist = dist * 60 * 1.1515;
			  dist = parseInt(dist * 1.609344 * 1000);
			  return dist;
			 }
			},
			getSave:function(){
				let longitude = '';
				let latitude = '';
				let that = this;
				this.btnLoading = true;
				uni.showLoading({
				    title: '正在获取GPS信息' 
				});
				uni.getNetworkType({
				    success: function (res) {
				        // console.log('网络状态',res.networkType);
						let idx = that.wtList.findIndex((event)=>{
							return event.ks_id === (that.record.typeXj ? that.record.ks_id : that.record.id)
						});
						// console.log('idx',idx);
						if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g'&& !that.isLx){
							plus.geolocation.getCurrentPosition(function(p){
									let res = p.coords;
									longitude = res&&res.longitude ? that.gcj_decrypt(res.latitude,res.longitude).lon.toFixed(6) : '';
									latitude = res&&res.latitude ? that.gcj_decrypt(res.latitude,res.longitude).lat.toFixed(6) : '';
									// let dist = that.distance(that.record.jd,that.record.wd,longitude,latitude);
									// if(dist <= that.max_dkjl){
										uni.hideLoading();
										that.getNetSave(longitude,latitude,'0',idx);
									// }else{
									// 	if(that.ydDistance&&that.ydDistance <= that.max_dkjl){
									// 		that.getNetSave(that.ydJd,that.ydWd,'0',idx);
									// 	}else{
									// 		uni.showModal({
									// 		    title: '您距离矿点位置'+(dist > 1000 ?  parseInt(dist/1000) + '千米' : dist + '米')+'，超出'+that.max_dkjl+'米的打卡范围，仍要打卡？',
									// 		    success: function (resDate) {
									// 		         if (resDate.confirm) {
									// 					that.getNetSave(longitude,latitude,'1',idx);
									// 		         } else if (resDate.cancel) {
									// 		             // console.log('用户点击取消'); 
									// 		         }
									// 			}
									// 		});
									// 	}
									// }
									
								}, function(e){
									// if(that.ydDistance&&that.ydDistance <= that.max_dkjl){
									// 	that.getNetSave(that.ydJd,that.ydWd,'0',idx);
									// }else{
										uni.hideLoading();
										uni.showModal({
										    title: '未获取到您的定位，仍要确认打卡？',
										    success: function (resDate) {
										         if (resDate.confirm) {
													that.getNetSave(longitude,latitude,'2',idx);
										         } else if (resDate.cancel) {
										             // console.log('用户点击取消');
										         }
											}
										});
								// 	}
								} );
						}else{
							plus.geolocation.getCurrentPosition(function(p){
									let res = p.coords;
									longitude = res&&res.longitude ? that.gcj_decrypt(res.latitude,res.longitude).lon.toFixed(6) : '';
									latitude = res&&res.latitude ? that.gcj_decrypt(res.latitude,res.longitude).lat.toFixed(6) : '';
									// let dist = that.distance(that.record.jd,that.record.wd,longitude,latitude);
									// if(dist <= that.max_dkjl){
										uni.hideLoading();
										that.getNoneNetSave(longitude,latitude,'0',idx);
									// }else{
									// 	if(that.ydDistance&&that.ydDistance <= that.max_dkjl){
									// 		that.getNetSave(that.ydJd,that.ydWd,'0',idx);
									// 	}else{
									// 		uni.showModal({
									// 		    title: '您距离矿点位置为'+(dist > 1000 ?  parseInt(dist/1000) + '千米' : dist + '米')+'，超出'+that.max_dkjl+'米的打卡范围，仍要打卡？',
									// 		    success: function (resDate) {
									// 		         if (resDate.confirm) {
									// 					that.getNoneNetSave(longitude,latitude,'1',idx);
									// 		         } else if (resDate.cancel) {
									// 		             // console.log('用户点击取消');
									// 		         }
									// 			}
									// 		});
									// 	}
									// }
								}, function(e){
									// if(that.ydDistance&&that.ydDistance <= that.max_dkjl){
									// 	that.getNetSave(that.ydJd,that.ydWd,'0',idx);
									// }else{
										uni.hideLoading();
										uni.showModal({
										    title: '未获取到您的定位，仍要确认打卡？',
										    success: function (resDate) {
										         if (resDate.confirm) {
													that.getNoneNetSave(longitude,latitude,'2',idx);
										         } else if (resDate.cancel) {
										             // console.log('用户点击取消');
										         }
											}
										});
									// }
								} );
						}
				    }
				});
			} 
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
