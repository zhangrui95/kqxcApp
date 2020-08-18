<template>
	<view>
		 <swiper class="swiper" :indicator-dots="false" :autoplay="false">
				<swiper-item>
					<view class="imgBox">
							<image src="../../static/logo.png" class="imgs"></image>
					</view>
				</swiper-item>
		   </swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
page{
	background: #000;
}
.swiper,.imgBox,.imgs{
	width: 100%;
}

</style>
