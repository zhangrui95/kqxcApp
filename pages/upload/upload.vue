<template>
	<view style="margin-bottom: 50px;">
		<detailList></detailList>
		<tabBar :pagePath="'/pages/upload/upload'"></tabBar>
	</view>
</template>

<script>
	import detailList from "@/components/detail-list/detail-list.vue"
	export default {
		data() {
			return {
				
			};
		},
		components: {
			detailList,
		},
	}
</script>

<style lang="less">

</style>
