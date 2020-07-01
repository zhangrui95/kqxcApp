<template>
	<view>
		<view class="searchTime">
			
		</view>
		<detailList></detailList>
	</view>
</template>

<script>
	import detailList from "@/components/detail-list/detail-list.vue"
	export default {
		data() {
			return {
				
			}
		},
		components: {
			detailList,
		},
		methods: {
			
		}
	}
</script>

<style>
.searchTime{
	width: 100%;
	height: 40px;
	line-height: 40px;
	background: #f5f5f5;
}
</style>
