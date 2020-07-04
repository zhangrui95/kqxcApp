<template>
	<view @click="hide">
		<view class="searchTime">
			<view class="time" @click="show"> 
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" fields='month' class="timePicker">
									<view class="uni-input">{{date}}</view>
								</picker>  
			    <uni-icons type="arrowdown" size="16" color="#000" class="icon"></uni-icons>
			</view>
			<view class="pageAll">共5条记录</view>
		</view>
		<!-- <picker-view v-if="visible" indicator-style="height:30px;" :value="value" @change="bindChange" class="pickerBox">
		            <picker-view-column>
		                <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
		            </picker-view-column>
		            <picker-view-column>
		                <view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
		            </picker-view-column>
		</picker-view> -->
		<view class="listBox">
			<detailList></detailList>
		</view>
	</view>
</template>

<script>
	import detailList from "@/components/detail-list/detail-list.vue"
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		data() {
			const currentDate = this.getDate({
			            format: true
			        })
			        return {
			            date: currentDate,
			        }
			 // const date = new Date()
			 //        const years = []
			 //        const year = date.getFullYear()
			 //        const months = []
			 //        const month = date.getMonth() + 1
			 //        const days = []
			 //        const day = date.getDate()
			 //        for (let i = 1990; i <= date.getFullYear(); i++) {
			 //            years.push(i)
			 //        }
			 //        for (let i = 1; i <= 12; i++) {
			 //            months.push(i)
			 //        }
			 //        for (let i = 1; i <= 31; i++) {
			 //            days.push(i)
			 //        }
			 //        return {
			 //            title: 'picker-view',
			 //            years,
			 //            year,
			 //            months,
			 //            month,
			 //            days,
			 //            day,
			 //            value: [9999, month - 1, day - 1],
			 //            visible: false,
			 //            indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
			 //        }
		},
		components: {
			detailList,
		},
		 computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },
		methods: {
			   bindDateChange: function(e) {
            this.date = e.target.value
        },
			 bindChange: function (e) {
			            const val = e.detail.value
			            this.year = this.years[val[0]]
			            this.month = this.months[val[1]]
			},
			show: function(){
				this.visible= !this.visible;
			},	
				getDate(type) {
				            const date = new Date();
				            let year = date.getFullYear();
				            let month = date.getMonth() + 1;
				            let day = date.getDate();
				
				            if (type === 'start') {
				                year = year - 60;
				            } else if (type === 'end') {
				                year = year + 2;
				            }
				            month = month > 9 ? month : '0' + month;;
				            return `${year}-${month}`;
				        }
		}
	}
</script>

<style>
.icon{
	position: absolute;
	top: 0;
	right: 15px;
}
.timePicker{
	text-align: left;
	padding: 0 15px;
}
.pickerBox{
	height: 100px;
	position:fixed;
	top: 30px;
	left: 3%;
	width: 120px;
	z-index: 999;
	background: #fff;
	box-shadow: 0 4px 4px #ccc;
	border-radius: 0 0 10px 10px;
	overflow: hidden;
}
/* /deep/ .uni-picker-view-indicator{
	height: 22px!important;
} */
/deep/ .uni-picker-view-content{
	font-size: 14px!important;
	line-height: 30px;
	text-align: center;
	/* height: 22px!important; */
}
.searchTime{
	width: 94%;
	background: #f5f5f5;
	overflow: hidden;
	padding: 0 3%;
	position: fixed;
	/* top: 44px!important; */
	top:0;
	left: 0;
	z-index: 99;
}
.time{
	height: 30px;
	background: #fff;
	border-radius: 50px;
	font-size: 14px;
	line-height: 30px;
	text-align: center;
	width: 120px;
	margin: 8px 0px;
	float: left;
}
.time{
	position: relative;
}
.pageAll{
	float: right;
	font-size: 14px;
	color: #aaa;
	line-height: 46px;
}
.listBox{
	margin-top: 46px;
}
</style>
