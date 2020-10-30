<template>
	<view>
		<uni-icons type="checkbox-filled" size="130" color="#37ce4b" class="iconSuccess"></uni-icons>
		<view class="czcg">提交成功</view>
		<view class="ts" v-if="fkr_id">上级负责人：{{xm}}（联系方式：<text class="phone" @click="call()">{{sjLxfs}}</text>）</view>
		<view class="ts" v-else>暂未设置反馈上级，请联系主管领导反馈问题</view>
	</view>
</template>

<script>
	import {getConfig, setXjData,setXjDataUpLoad,setXjAllData,getWtData,setWtData,getUsersAllData} from '../common/env.js'
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components: {uniIcons},
		data() {
			return {
				fkr_id:'',
				sjLxfs:'',
				xm:''
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			let that = this;
			this.fkr_id = option.fkr_id ? option.fkr_id : '';
			getUsersAllData(`select * from usersAllData WHERE id='${this.fkr_id}'`,(res)=>{
				that.sjLxfs = res[0].lxdh;
				that.xm = res[0].xm;
			});
		},
		methods: {
			call:function(){
				let that = this;
				uni.makePhoneCall({
					phoneNumber: that.sjLxfs //仅为示例  
				});
			}
		}
	}
</script>

<style>
.iconSuccess{
	text-align: center;
	margin-top: 30px;
	display: block;
}
.czcg{
	font-size: 30px;
	color: #333;
	text-align: center;
}
.phone{
	color: #0087FF;
}
.ts{
	color: #999;
	text-align: center;
	font-size: 18px;
	margin-top: 20px;
}
</style>
