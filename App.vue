<script>
export default {
	globalData: {  
	   ip:'https://jixi.app.hylink.net.cn:10002',
	   // ip:'http://192.168.104.100:8080',
	   // ip:'http://112.102.212.130:10006',
	   // ip:'http://192.168.104.137:8080',
	   socketIp:'http://60.15.118.104:8723',
	   is_admin:'0',
	   uid:'',
	   weedIp:'',
	   httpImg:'',
	   version:'1.2.9',
	   isLogin:false,
	   is_zz:'0',
	},  
	onLaunch: function() {
		console.log('App Launch');
		plus.device.getInfo({
			success: (e) => {
				uni.setStorageSync('uuid', e.uuid)
			}
		})
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
page {
	      background-color: #f5f5f5;
}
</style>
