<template>
	<view>
		<view class="boxList">
			<uni-list>
					<uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
						<view class="listTitle"><text>黑山矿山</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：黑龙江省鸡西市黑山</text>
						</view>
						<view class="msgBox">
							<text class="bzBox">被委托人：李菲菲</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">委托时间：2019-12-29</text>
							<text class="rightBox">委托状态：<text style="color: #F9A936;">待接受</text></text> 
						</view>
						<template v-slot:right="">
						           <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone"></image>
						       </template>
					</uni-list-item>
					<uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
						<view class="listTitle"><text>黑山矿山</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：黑龙江省鸡西市黑山</text>
						</view>
						<view class="msgBox">
							<text class="bzBox">被委托人：李菲菲</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">委托时间：2019-12-29</text>
							<text class="rightBox">委托状态：<text style="color: #29B6FF;">已接受</text></text> 
						</view>
						<template v-slot:right="">
						           <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone"></image>
						       </template>
					</uni-list-item>
					<uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
						<view class="listTitle"><text>黑山矿山</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：黑龙江省鸡西市黑山</text>
						</view>
						<view class="msgBox">
							<text class="bzBox">被委托人：李菲菲</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">委托时间：2019-12-29</text>
							<text class="rightBox">委托状态：<text style="color: #999999;">已拒绝</text></text> 
						</view>
						<template v-slot:right="">
						           <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone"></image>
						       </template>
					</uni-list-item>
					<uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
						<view class="listTitle"><text>黑山矿山</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：黑龙江省鸡西市黑山</text>
						</view>
						<view class="msgBox">
							<text class="bzBox">被委托人：李菲菲</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">委托时间：2019-12-29</text>
							<text class="rightBox">委托状态：<text style="color: #3CE84C;">已巡检</text></text> 
						</view>
						<template v-slot:right="">
						           <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone"></image>
						       </template>
					</uni-list-item>
					<uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
						<view class="listTitle"><text>黑山矿山</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：黑龙江省鸡西市黑山</text>
						</view>
						<view class="msgBox">
							<text class="bzBox">被委托人：李菲菲</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">委托时间：2019-12-29</text>
							<text class="rightBox">委托状态：<text style="color: #F9A936;">待接受</text></text> 
						</view>
						<template v-slot:right="">
						           <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone"></image>
						       </template>
					</uni-list-item>
					<uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
						<view class="listTitle"><text>黑山矿山</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：黑龙江省鸡西市黑山</text>
						</view>
						<view class="msgBox">
							<text class="bzBox">被委托人：李菲菲</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">委托时间：2019-12-29</text>
							<text class="rightBox">委托状态：<text style="color: #F9A936;">待接受</text></text> 
						</view>
						<template v-slot:right="">
						           <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone"></image>
						       </template>
					</uni-list-item>
					<uni-list-item :show-arrow="false" @click="goDetail('巫山矿山')">
						<view class="listTitle"><text>黑山矿山</text></view>
						<view class="msgBox">
							<text class="bzBox">矿山地址：黑龙江省鸡西市黑山</text>
						</view>
						<view class="msgBox">
							<text class="bzBox">被委托人：李菲菲</text>
						</view>
						<view class="msgBox">
							<text class="leftBox">委托时间：2019-12-29</text>
							<text class="rightBox">委托状态：<text style="color: #F9A936;">待接受</text></text> 
						</view>
						<template v-slot:right="">
						           <image style="width: 30px;height: 30px;" src="/static/phone.png" mode="widthFix" @click="makePhone"></image>
						       </template>
					</uni-list-item> 
				</uni-list>
		</view>
		<view class="buttonBox">
			<button type="primary" style="background: #00b7f0;" @click="entrustColleague()">发起委托</button>
			<button type="primary" style="background: #f19049;" @click="goWt()">收到委托</button>
		</view>
		<tabBar :pagePath="'/pages/entrust/entrust'"></tabBar> 
	</view>
</template>

<script>
	import moment from 'moment';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import detailList from "@/components/detail-list/detail-list.vue"
	export default {
		data() {
			return {
				name:'',
				time: moment().format('YYYY.MM.DD')
			}
		},
		components: {
			detailList,
		},
	  onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.name); //打印出上个页面传递的参数。
			this.name=option.name;
		}, 
		methods: {
			timeSearch:function(){
				uni.navigateTo({
				    url: '../detailKsTimeSearch/detailKsTimeSearch'
				});
			},
			goWt:function(){
				uni.navigateTo({
				    url: '../commissionReceived/commissionReceived'
				});
			},
			entrustColleague:function(){
				uni.navigateTo({
				    url: '../choiceKs/choiceKs'
				});
			},
			makePhone:function(){
				uni.makePhoneCall({
				    phoneNumber: '10086' //仅为示例
				});
			}
		}
	}
</script>

<style>
	.uni-list-item--hover{
		background: #fff!important;
	}
	.timeBtn{
		color: #2f67d5;
		position: absolute;
		top: 0px;
		right: 15px;
	}
	.timeSearch{
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		color: #666;
		margin-left: 15px;
		position: relative;
	}
	.boxList{
		background: #fff;
		width: 100%;
		margin-bottom: 130px;
	}
	.boxTop{
		background: #fff;
		width: 92%;
		height: auto;
		overflow: hidden;
		padding: 10px 4%;
		margin-bottom: 7px;
	}
	.name{
		border-bottom: 1px solid #f4f4f4;
		height: 36px;
		line-height: 30px;
		margin-bottom: 10px;
	}
	.address{
		font-size: 14px;
		color: #666;
		line-height: 22px;
	}
	/deep/ .uni-list-item__container:after{
		height: 1px!important;
	}
	.uni-list-item__container{
		border: 0px!important;
	}
	.leftBox{
		width: 50%;
		float: left;
	}
	.rightBox{
		width: 50%;
		float: left;
	}
	.listTitle{
		color: #000;
		margin-bottom: 4px;
	}
	.msgBox{
		color: #747474;
		font-size: 12px;
		line-height: 20px;
	}
	.buttonBox{
		position: fixed;
		bottom: 65px;
		width: 96%;
		left: 0;
		padding: 0 2%;
	}
	.buttonBox button{
		width: 46%;
		float: left;
		margin: 0 2%;
		border-radius: 50px;
		box-shadow:0px 5px 15px 0px rgba(0, 0, 0, 0.2);
	}
</style>
