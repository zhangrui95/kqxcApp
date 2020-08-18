<template>
	<view>
		<view class="box">
			<view class="itemMsg" v-for="(item) in list">
				<view :class="item.from === id ? 'topTimeMe' : 'topTime'">{{item.params.name}}  {{item.time}}</view>
				<view class="messageText">{{item.params.text}}</view>
			</view>
		</view>
		<view class="sendBox">
		   <input class="uni-input" placeholder="请输入发送内容" @input="getInput" :value="value"/>
		   <button class="btn" @click="getSend">发送</button>
		</view>
	</view>
</template>

<script>
	// import socket from '../../socketio.js'
	import io from '@hyoga/uni-socket.io';
	import { Base64 } from '../../encode.js';
	import { decrypt_public, aes_encrypt, aes_decrypt } from '../../encrypt.js';
	import { hex_md5 } from '../../md5.js';
	import moment from 'moment';
	let socket = '';
	export default {
		data() { 
			return {
				list:[],
				msg_key_str:'',
				auth_key:'', 
				id:'',
				tid:'',
				value:'',
				record:{},
			}
		},
		onLoad: function (option) {
			let that = this;
			let record = option.record&&JSON.parse(option.record) ? JSON.parse(option.record) : '';
			this.record = record;
			uni.setNavigationBarTitle({
			    title: record ? record.xm : '消息'
			});
			uni.getStorage({
			    key: 'userData',
			    success: function (res) {
					if(res.data){
						that.id = JSON.parse(res.data).lxdh; 
						let tid = record.lxdh > that.id ? record.lxdh + that.id :  that.id + record.lxdh;
						that.tid = hex_md5(tid);
						socket = io(getApp().globalData.socketIp, {
							  query: {
								  idcard: that.id,
								  device: 'pc',
							  },
							  transports: [ 'websocket', 'polling' ], 
							});
							socket.on('connect', () => { 
							  console.log('ws 已连接');
							});
							 socket.emit('reset-unread', {
							        tid:that.tid,
							        count: 0,
							      });
							socket.on('aes-key', (data) => {
								let encrypt_msg = Base64.decode(data);
								let receive_info = decrypt_public(encrypt_msg);
								that.msg_key_str = JSON.parse(receive_info).msg_key;
								that.auth_key = JSON.parse(receive_info).auth_key;
							   that.getList(); 
							});
							socket.on('chat-message', (data) => {
								that.getList();
								socket.emit('reset-unread', {
								       tid:that.tid,
								       count: 0,
								     });
							})
					}
				},
			});
		},
		methods: {
			getInput:function(e){
				this.value = e.target.value;
			},
		 //生成id
		  makeId:function(thelen){
			let text = '';
			let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for (var i = 0; i < thelen; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		  },
			getSend: function(){
				    let params = {
				          text: this.value,
				          name: this.record.xm,
				    };
					let id = this.makeId(32);
			        let msg = {
						type:'1',
			            from: this.id,
			            to: this.record.lxdh,
			            time: moment().format('YYYY-MM-DD HH:mm:ss'),
			            params: params,
			            id:id,
			            tid:this.tid,
			        };
			        let key = this.msg_key_str
			            ? this.msg_key_str.split(',').map(item => parseInt(item))
			            : [];
			        let newMsg = aes_encrypt(key, JSON.stringify(msg));
			        socket.emit('chat-message', newMsg);
					this.value = '';
					this.getList();
			 },
			 getList:function(){
				 uni.request({
				    url: getApp().globalData.socketIp + '/slk-message/chat/query', //获取消息列表
				    data: {
					  tid: this.tid,
					  size: 999,
					  page: 0,
					  timeStart: '',
					  timeEnd: '',
					  contain: '',
					},
					header: {
					   'idcard': this.id,
					},
				 	method:'POST',
				     success: (res) => {
						if(!res.data.error){
							let key = this.msg_key_str ? this.msg_key_str.split(',').map(item => parseInt(item)): '';
							let response = JSON.parse(aes_decrypt(key, res.data.cipher));
							 if (response.data && response.data.length > 0) {
								this.list = response.data.reverse();
								setTimeout(()=>{
									uni.pageScrollTo({
									    scrollTop: 99999999999,
										duration: 0,
									})
								},200)
							 }
						}
				     }
				 });
			 }
		} 
	}
</script>

<style>
page {
 background-color: #fff;
}
.box{
	padding: 10px;
	margin-bottom: 50px;
}
.itemMsg{
	margin-bottom: 10px;
}
.topTime{
	font-size: 14px;
	color: #007AFF;
}
.topTimeMe{
	font-size: 14px;
	color: #35935d;
}
.messageText{
	margin:0 10px;
}
.sendBox{
	background-color: #f5f5f5;
	width: 100%;
	height: 40px;
	padding: 10px;
	position: fixed;
	bottom: 0;
	left: 0;
}
.uni-input{
	background: #fff;
	height: 40px;
	width: calc(100% - 100px);
	float: left;
	padding:0 5px;
	border-radius: 5px;
}
.btn{
	float: left;
	width: 60px;
	background: #00b7f0;
	color: #fff;
	padding: 0;
	height: 40px;
	line-height: 40px;
	margin-left: 10px;
}
</style>
