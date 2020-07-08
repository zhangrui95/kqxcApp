<template>
	<view style="margin-bottom: 50px;">
		<detailList :list="list"></detailList>
		<tabBar :pagePath="'/pages/upload/upload'"></tabBar>
	</view>
</template>

<script>
	import detailList from "@/components/detail-list/detail-list.vue"
	import {getXjDataUpLoad} from '../common/env.js'
	export default {
		data() {
			return {
				list:[]
			};
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			getXjDataUpLoad(`select * from xjDataUpLoad`,(data)=>{
				console.log('待上传======================callback====================>',data)
				this.list = data;
			});
		}, 
		components: {
			detailList,
		},
	}
</script>

<style lang="less">

</style>
