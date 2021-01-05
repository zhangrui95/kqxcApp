<template>
	<view>
		 <map style="width: 100%; height: 250px;" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
		 <view class="listBox">
			 <uni-list>
				 <uni-list-item :title="'经度：' + longitudeText" :show-arrow="false" class="nohover"></uni-list-item>
				 <uni-list-item :title="'纬度：' + latitudeText" :show-arrow="false" class="nohover"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	export default {
	 data() {
			return {
				id:0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: '',
				longitude: '',
				latitudeText: '',
				longitudeText: '',
				covers: []
			}
		},
		onHide() {
			clearInterval(this.time);
		},
		onShow(){
			this.getLatlng();
			this.time = setInterval(()=>{
				this.getLatlng();
			}, 3000);
		},
		methods: {
			async getLatlng() {
				let that = this;
				let getLatlngOnline = ()=>{
					return new Promise((resolve, reject)=>{
						uni.getLocation({
							type: 'gcj02',
							success: (res)=> {
								resolve({lat: res.latitude, lng: res.longitude,isline:true})
							},
							fail: (error)=> {
								uni.showToast({
									title: '当前位置获取失败,请检查GPS是否打开',
									duration: 2000,
									icon: 'none'
								});
								reject();
							}
						});
					});
				}
				let getLatlngOffline = ()=>{
					return new Promise((resolve, reject)=>{
						plus.geolocation.getCurrentPosition((res)=>{
							resolve({lat: res.coords.latitude, lng: res.coords.longitude,isline:false});
						}, (error)=>{
							uni.showToast({
								title: error.message,
								duration: 2000,
								icon: 'none'
							});
							reject();
						},{provider:'system'});
					});
				}
				return new Promise((resolve, reject)=>{
					uni.getNetworkType({
						success: async ({networkType})=>{
							try{
								let coord = networkType === 'none'?await getLatlngOffline():await getLatlngOnline();
								if(coord.isline){
									let coord84 = this.gcj02towgs84(coord.lng,coord.lat);
									that.longitudeText = coord84[0].toFixed(7);
									that.latitudeText = coord84[1].toFixed(7);
									that.longitude = coord.lng;
									that.latitude = coord.lat;
									that.covers = [{
										latitude: coord.lat,
										longitude: coord.lng,
										iconPath: '/static/gps1.png'
									}];
								}else{
									let coord02 = this.transform(coord.lng,coord.lat);
									that.longitudeText = coord.lng.toFixed(7);
									that.latitudeText = coord.lat.toFixed(7);
									that.longitude = coord02[0];
									that.latitude = coord02[1];
									that.covers = [{
										latitude: coord02[1],
										longitude: coord02[0],
										iconPath: '/static/gps1.png'
									}];
								}
								resolve(coord);
							}catch(_){
								reject();
							}
						}
					})
				});
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
			gcj02towgs84(lng, lat){
				        const PI = 3.1415926535897932384626;
				        const a = 6378245.0;
				        const ee = 0.00669342162296594323;
				        let dlat = this.transformLat(lng - 105.0, lat - 35.0);
				        let dlng = this.transformLon(lng - 105.0, lat - 35.0);
				        let radlat = (lat / 180.0) * PI;
				        let magic = Math.sin(radlat);
				        magic = 1 - ee * magic * magic;
				        const sqrtmagic = Math.sqrt(magic);
				        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
				        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
				        let mglat = lat + dlat;
				        let mglng = lng + dlng;
				        return [lng * 2 - mglng, lat * 2 - mglat];
			}
		}
	}
</script>

<style>
	.listBox{
		background: #fff;
		margin-top: -8px;
	}
</style>
