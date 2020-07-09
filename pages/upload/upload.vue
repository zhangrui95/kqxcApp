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
			getXjDataUpLoad(`SELECT A.*, B.xm, C.mc FROM xjDataUpLoad A LEFT JOIN usersData B ON A.users_id = B.id LEFT JOIN ksData C ON A.ks_id = C.id  WHERE A.users_id = '${getApp().globalData.uid}' ORDER BY dk_sj DESC`,(data)=>{
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
