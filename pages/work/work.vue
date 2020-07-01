<template>
    <view>
        <view class="pageBody">
            <view class="page-section page-section-gap">
                <map style="width: 100%; height: 580px;" :latitude="latitude" :longitude="longitude" :markers="covers">
                </map>
            </view>
        </view>
    </view>
</template>

<script>
	export default {
		data() {
			 return {
			      id:0, // 使用 marker点击事件 需要填写id
			            title: 'map',
			            latitude: 45.3,
			            longitude: 130.9,
			            covers: [{
			                latitude: 39.909,
			                longitude: 116.39742,
			                iconPath: '../../../static/location.png'
			            }, {
			                latitude: 39.90,
			                longitude: 116.39,
			                iconPath: '../../../static/location.png'
			            }]
			        }
		}
	}
</script>

<style>
	.pageBody,.page-section{
		height: 100%;
		width: 100%;
	}
</style>
