<template>
    <view>
        <view class="pageBody">
			<view class="page-section page-section-gap">
			     <map :style="{height:height+ 'px'}" style="width: 100%; position: relative;" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap='listShow' @labeltap='listShow'>
					 <cover-view class="kdNumberBoxAll"></cover-view>
					 <cover-view class="kdNumberBox"> 当前矿点：23个</cover-view>
					 <cover-view class="kdNumberBox1">正常矿点：21个</cover-view>
					 <cover-view class="kdNumberBox2">异常矿点：2个</cover-view>
			     </map>
			 </view>
        </view>
		<tabBar :pagePath="'/pages/work/work'"></tabBar>
    </view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			 return {
			      id:0, // 使用 marker点击事件 需要填写id
						height:0,
			            title: 'map',
						// scale:18,
			            latitude: 45.21071,
			            longitude: 130.90693,
			            covers: [{
			                latitude: 45.21171,
			                longitude: 130.90493,
			                iconPath: '/static/map1.png',
							label:{content:'恒山矿山'},
							id:'0'
			            }, {
			               latitude: 45.21001,
			               longitude:130.90982,
			                iconPath: '/static/map2.png',
							label:{content:'黑山矿山'},
							id:'1'
			            },{
			                latitude: 45.21271,
			                longitude: 130.90650,
			                iconPath: '/static/map3.png',
							label:{content:'巫山矿山'},
							id:'2'
			            }, {
			               latitude: 45.20700,
			               longitude:130.90582,
			                iconPath: '/static/map4.png',
							label:{content:'卢山矿山'},
							id:'3'
			            }],
			        }
		},
		 components: {
		        uniPopup, 
		},
		onLoad() {
			let that = this;
			uni.getSystemInfo({
				success:function(res) {
					that.height = res.windowHeight - 48
				}
			})
		},
		methods: {
			listShow:function(e){
				console.log('e:',e,e.detail.markerId);
				uni.navigateTo({
				    url: '../workList/workList?cover='+JSON.stringify(this.covers[e.detail.markerId])
				});
			}
		}
	}
</script>

<style>
	.pageBody,.page-section{
		height: 100%;
		width: 100%;
	}
	.kdNumberBoxAll{
		background: rgba(255,255,255,0.85);
		position: fixed!important;
		top: 20px!important;
		right: -10px!important;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 130px;
		height: 80px;
		box-shadow:0px 0px 38px 0px rgba(194, 194, 194, 0.35);
		border-radius: 10px;
	}
	.kdNumberBox{
		position: fixed!important;
		top: 27px!important;
		right: 10px!important;
		border-radius: 10px 0 0 10px;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
	}
	.kdNumberBox1{
		position: fixed!important;
		top:47px!important;
		right: 10px!important;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #4A9FF7;
	}
	.kdNumberBox2{
		position: fixed!important;
		top: 67px!important;
		right: 10px!important;
		border-radius: 0 0 0 10px;
		z-index: 999;
		font-size: 14px;
		line-height: 22px;
		width: 100px;
		color: #F45151;
	}
</style>
