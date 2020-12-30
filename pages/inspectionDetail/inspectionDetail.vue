<template>
	<view>
		<map v-if="mapShow" style="width: 100%; height: 180px;" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
		<uni-list class="listBox">
			<uni-list-item :showArrow="false">
				<view class="name">
					<text class="topName">{{item.mc}}</text>
					<text class="topTime">{{item.dk_sj.substring(0,10)}}</text>
				</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="address"><text style="float: left;">巡查时间：{{item.dk_sj.substring(11,19)}}</text>
					<uni-tag :text="item.is_ycdk == '1' ? '定位异常':item.is_ycdk == '2' ? '无定位' : '正常'" :type="item.is_ycdk == '1' ? 'error' : item.is_ycdk == '2' ? 'warning' : 'primary'"></uni-tag>
				</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class='address'>责任人：{{record&&record.fzr_xm ? record.fzr_xm : '暂无'}}</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class='address'>执行人：{{item.xm}}</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<!-- <view class="address">巡查结果：<text :style="{color:item.kczt_dm === '02' ? '#747474' : '#2de17e'}">{{item.kczt_dm === '02' ? '未开采' : '开采中'}}</text></view> -->
				<view class='address'>巡查结果：<text :style="{color:item.yczt_dm === '02' ? '#747474' : '#ee4c26'}">{{item.yczt_dm === '02' ? '未发现异常' : '发现异常'}}</text></view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="address">是否对周边进行地毯式巡查：{{item.is_dtxc == '1' ? '是' : '否'}}</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view>
					<text class='address' style="width: 50%;float: left;">打卡经度：{{item.dk_jd || ''}}</text>
					<text class='address' style="width: 50%;float: left;">打卡纬度：{{item.dk_wd || ''}}</text>
				</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="address">备注说明：{{item.bz}}</view>
			</uni-list-item>
			<!-- <uni-list-item :showArrow="false" >
			    <view>远景照片：{{yjList.length}}张</view>
				<view class="img-list">
					<image :src="item" class="imgItem" @click="getBigImg(yjList,index)" v-for="(item,index) in yjList"></image>
				</view>
			</uni-list-item> -->
			<uni-list-item :showArrow="false">
			    <view>拍摄照片：{{jjList.length}}张</view>
			    <view class="img-list">
			    	<image :src="item" class="imgItem" @click="getBigImg(jjList,index)" v-for="(item,index) in jjList"></image>
			    </view>
			</uni-list-item>
			<uni-list-item :showArrow="false" v-if="videoList&&videoList.length > 0">
			    <view>上传视频：{{videoList.length}}个</view>
			    <view class="img-list">
			    	<video :src="item" class="imgItem" @play="bigVideo(item)" v-for="(item) in videoList" v-if="!playUrl"></video>
			    </view>
			</uni-list-item>
		</uni-list>
		<view class="videoBox" v-if="playUrl">
			<video :src="playUrl" autoplay="true" class="videoItem"></video>
		</view>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	export default {
		data() {
			return {
				item:{},
				record:{},
				name:'',
				yjList:[],
				jjList:[],
				videoList:[],
				playUrl:'',
				isUpload:false,
				latitude: '',
				longitude: '',
				latitudeText: '',
				longitudeText: '',
				covers: [],
				mapShow: true,
			}
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
			// console.log('option.datail',option.detail); //打印出上个页面传递的参数。
			let detail = JSON.parse(option.detail);
			if(option.record){
				this.record = JSON.parse(option.record);
			}else{
				this.record = {fzr_xm:detail&&detail.fzr_xm ? detail.fzr_xm : ''};
			}
			console.log('detail==========>',detail);
			if(detail.dk_jd && detail.dk_wd){
				let coord02 = this.transform(Number(detail.dk_jd),Number(detail.dk_wd));
				console.log('coord02======>',coord02[0],coord02[0]);
				this.longitude = coord02[0];
				this.latitude = coord02[1];
				this.covers = [{
					latitude: coord02[1],
					longitude: coord02[0],
					iconPath: '/static/gpsDetail.png'
				}];
			}else{
				this.mapShow = false;
			}
			this.item = detail;
			let that = this;
			uni.getNetworkType({
			    success: function (res) {
			        // console.log('网络状态',res.networkType);
					if(res.networkType !== 'none' &&  res.networkType !== '2g' &&  res.networkType !== '3g' && !that.isUpload && !getApp().isLx){
						let yjList = [];
						let jjList = [];
						let videoList = [];
						detail.yj_zp_net.split('#').map((item)=>{
							if(item.includes('http')){ 
								yjList.push(item)
							}else{
								yjList.push('http://'+ item);
							}
						});
						detail.jj_zp_net.split('#').map((item)=>{
							if(item.includes('http')){
								jjList.push(item);
							}else{
								jjList.push('http://'+ item);
							}
						});
						detail.dsp_net&&detail.dsp_net.split('#').map((item)=>{
							// console.log('item???',item)
							if(item.includes('http')){
								videoList.push(item);
							}else{
								videoList.push('http://'+ item);
							}
						});
						that.yjList = yjList;
						that.jjList = jjList;
						that.videoList = videoList;
					}else{
						// console.log('视频detail.dsp',detail.dsp)
						that.yjList = detail.yj_zp.split('#');
						that.jjList = detail.jj_zp.split('#');
						that.videoList = detail.dsp ? detail.dsp.split('#') : [];
					}
			    }
			});
		}, 
		methods: {
			bigVideo:function(item){
				// console.log('item',item)
				this.playUrl = item;
			},
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
				// uni.navigateTo({
				// 	 url: '../bigImg/bigImg'
				// })
			},
			transform(lon, lat){
			        const pi = 3.1415926535897932384626;
			        const a = 6378245.0;
			        const ee = 0.00669342162296594323;
			
			        let dLat = this.transformLat(lon - 105.0, lat - 35.0);
			        let dLon = this.transformLon(lon - 105.0, lat - 35.0);
			
			        const radLat = (lat / 180.0) * pi;
			        let magic = Math.sin(radLat);
			        magic = 1 - ee * magic * magic;
			        const sqrtMagic = Math.sqrt(magic);
			
			        dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi);
			        dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);
			
			        const mgLat = lat + dLat;
			        const mgLon = lon + dLon;
			
			        return [mgLon, mgLat];
			},
			transformLat(x, y) {
					const pi = 3.1415926535897932384626;
					let ret =
						-100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
					ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
					ret += ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0;
					ret +=
						((160.0 * Math.sin((y / 12.0) * pi) + 320.0 * Math.sin((y * pi) / 30.0)) * 2.0) / 3.0;
					return ret;
			},
			transformLon(x, y){
					const pi = 3.1415926535897932384626;
					let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
					ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
					ret += ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0;
					ret +=
						((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x * pi) / 30.0)) * 2.0) / 3.0;
					return ret;
			},
		}
	}
</script>

<style>
	.listBox{
		background: #fff;
		margin-top: -8px;
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
	.topName{
		float: left;
		width: 70%;
	}
	.topTime{
		color: #999;
		float: right;
		width: 30%;
		font-size: 16px;
		text-align: right;
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
