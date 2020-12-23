<template>
	<view>
		<uni-list>
			 <uni-list-item @click="sendMsg(item)" v-for="(item) in list" :show-badge="parseInt(item.unread) > 0 ? true : false" :badge-text="item.unread" badge-type="error">
				{{item.xm}} （{{item.is_zz=='1' ? '组长':'组员'}}）
			 </uni-list-item>
		</uni-list>
		<view class="noList" v-if="list.length == 0">暂无消息</view>
		</uni-list>
	</view>
</template>

<script>
	import {getUsersAllData} from '../common/env.js'
	import io from '@hyoga/uni-socket.io';
	let socket = '';
	export default {
		data() {
			return {
				list:[]
			}
		},
		onShow: function () {
			let that = this;
			uni.getStorage({
			    key: 'userData',
			    success: function (res) {
					if(res.data){
						that.id = JSON.parse(res.data).lxdh; 
						socket = io(getApp().globalData.socketIp, {
							  query: {
								  idcard: that.id,
								  device: 'pc',
							  },
							  transports: [ 'websocket', 'polling' ], 
							});
							socket.on('connect', () => { 
							  // console.log('ws 已连接');
							});
							socket.on('chat-list', function (data) {
								let list = [];
								getUsersAllData('select * from usersAllData',(res)=>{
									// console.log('res',res);
									data.map((item)=>{
										let idx = res.findIndex((e)=> e.lxdh === item.with);
										if(idx > -1){
											res[idx].unread = item.unread.toString();
											list.push(res[idx]);
										}
										console.log('list',list)
										that.list = list;
									})
								});
							});
					}
				},
			});
		},
		methods: {
			sendMsg:function(item){
				uni.navigateTo({
					url:'../sendMsg/sendMsg?record='+JSON.stringify(item),
				})
			}
		}
	}
</script>

<style>
	.noList{
		text-align: center;
		font-size: 14px;
		color: #999;
		padding:30px 0;
		background: #F5F5F5;
	}
</style>
