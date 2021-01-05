<template>
	<view class="qiun-columns">
		<uni-segmented-control v-if="qh_dm === '2303'" :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#172f87"></uni-segmented-control>
		<view class="searchTime" :style="{'top':(qh_dm === '2303' ? 50 : 0)+'px'}">
			<view :class="disabled ? 'timeDisabled' : 'time'" v-if="current == 1"> 
				<picker :disabled="disabled" :range="areaList" mode="selector" :value="value3" class="timePicker" @change="getArea">
						<view class="uni-input">{{areaList[value3]}}</view>
				</picker>  
			    <uni-icons type="arrowdown" size="16" :color="disabled ? '#999' : '#000'" class="icon"></uni-icons>
			</view>
			<view class="time"> 
				<picker :range="searchList" mode="selector" :value="value"  class="timePicker" @change="getYear">
						<view class="uni-input">{{searchList[value]}}年</view>
				</picker>  
			    <uni-icons type="arrowdown" size="16" color="#000" class="icon"></uni-icons>
			</view>
			<!-- <view class="time">
				<picker :range="monList" mode="selector" :value="value1" class="timePicker">
						<view class="uni-input">{{monList[value1]}}</view>
				</picker>  
			    <uni-icons type="arrowdown" size="16" color="#000" class="icon"></uni-icons>
			</view> -->
			<view class="time">
				<picker :range="weekList" mode="selector" :value="value2" class="timePicker" @change="getWeekChoice">
						<view class="uni-input">{{weekList[value2]}}</view>
				</picker>  
			    <uni-icons type="arrowdown" size="16" color="#000" class="icon"></uni-icons>
			</view>
		</view>
		<view v-if="current == 0">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt" :style="{'margin-top':(qh_dm === '2303' ? 95 : 45)+'px'}">
				<view class="qiun-title-dot-light">风险点</view>
			</view>
			<view class="qiun-charts">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn1" id="canvasColumn1" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
				<!--#endif-->
				<!--#ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn1" id="canvasColumn1" class="charts"></canvas>
				<!--#endif-->
			</view>
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
				<view class="qiun-title-dot-light">次数</view>
			</view>
			<view class="qiun-charts">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
				<!--#endif-->
				<!--#ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts"></canvas>
				<!--#endif-->
			</view>
		</view>
		<view v-if="current == 1">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt" :style="{'margin-top':(qh_dm === '2303' ? 95 : 45)+'px'}"> 
				<view class="qiun-title-dot-light">巡检趋势</view>
			</view>
			<view class="qiun-charts">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn2" id="canvasColumn2" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
				<!--#endif-->
				<!--#ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn2" id="canvasColumn2" class="charts"></canvas>
				<!--#endif-->
			</view>
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">用户/机构巡检次数</view>
			</view>
			<view class="qiun-charts">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn3" id="canvasColumn3" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}" @touchstart="touchColumn" @touchmove="moveColumn" @touchend="touchEndColumn"></canvas>
				<!--#endif-->
				<!--#ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn3" id="canvasColumn3" class="charts" @touchstart="touchColumn" @touchmove="moveColumn" @touchend="touchEndColumn"></canvas>
				<!--#endif-->
			</view>
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">风险点数</view>
			</view>
			<view class="qiun-charts">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn4" id="canvasColumn4" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
				<!--#endif-->
				<!--#ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn4" id="canvasColumn4" class="charts"></canvas>
				<!--#endif-->
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../components/u-charts/u-charts.js';
	import moment from 'moment';
	var _self;
	var canvaColumn=null;
	var canvaArea = null;
	var canvaPie=null;
	var canvaRing=null;
	export default {
		data() {
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				serverData:'',
				items: ['市局','区级'],
				searchList:['2020', '2019'],
				monList:['1月','2月', '3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				weekList:['第1周','第2周','第3周','第4周'],
				areaList:['鸡冠区', '恒山区','城子河区','麻山区','滴道区','梨树区','虎林市','密山市','鸡东县'],
				codeList:['230302', '230303','230306','230307','230304','230305','230381','230382','230321'],
				area:getApp().globalData.qh_dm && getApp().globalData.qh_dm!=='2303' ? getApp().globalData.qh_dm : '230302',
				current: getApp().globalData.qh_dm === '2303' ? 0 : 1,
				value:0,
				value1:0,
				value2:0,
				value3:0,
				weeks:{},
				qh_dm:getApp().globalData.qh_dm,
				disabled:false,
			}
		},
		onLoad() {
			this.value3 = getApp().globalData.qh_dm && getApp().globalData.qh_dm!=='2303' ?  this.codeList.indexOf(getApp().globalData.qh_dm) : 0;
			this.disabled = this.value3 > 0 ? true : false;
			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.cHeightPie=uni.upx2px(420);
			let weekList = [];
			let searchList = [];
			let year = parseInt(moment().format('YYYY'));
			let index = 53;
			let weeks = this.getWeek(moment().format('YYYY'));
			console.log('weeks',weeks);
			for(var i =2019;i<=year;i++){
				searchList.unshift(i);
			}
			this.searchList = searchList;
			if(weeks['54']){
				index = 54;
			}
			for(var i = 1;i<=index;i++){
				weekList.push('第'+ i +'周('+weeks[i][0]+'~'+weeks[i][weeks[i].length - 1]+')'); 
			}
			this.weekList = weekList;
			this.value2 = this.getNewWeek();
			this.weeks = weeks;
			if(this.current == 0){
				this.getServerData(weeks[this.value2 + 1][0],weeks[this.value2 + 1][weeks[this.value2 + 1].length - 1]);
				this.getServerFxdData(weeks[this.value2 + 1][0],weeks[this.value2 + 1][weeks[this.value2 + 1].length - 1]);
			}else{
				this.getServerQjData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
				this.getQjXAreaData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
				this.fxdNumber(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
			}
			
		},
		methods: {
			getWeekChoice(e){
				this.value2 = e.target.value;
				if(this.current == 0){
						 this.getServerData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1]);
						 this.getServerFxdData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1]);
				}else{
						 this.getServerQjData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
						 this.getQjXAreaData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
						 this.fxdNumber(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
				}
			},
			getArea(e){
				this.value3 = e.target.value;
				let area = this.codeList[e.target.value];
				this.area = area;
				this.getServerQjData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],area);
				this.getQjXAreaData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],area);
				this.fxdNumber(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],area);
			},
			getYear(e){
				 this.value = e.target.value;
				 let weekList = [];
				 let searchList = [];
				 let year = this.searchList[e.target.value];
				 console.log('year',year)
				 let index = 53;
				 let weeks = this.getWeek(year);
				 this.weeks = weeks;
				 if(weeks['54']){
				 	index = 54;
				 }
				 for(var i = 1;i<=index;i++){
				 	weekList.push('第'+ i +'周('+weeks[i][0]+'~'+weeks[i][weeks[i].length - 1]+')'); 
				 }
				 this.weekList = weekList;
				 if(this.current == 0){
					 this.getServerData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1]);
					 this.getServerFxdData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1]);
				 }else{
					 this.getServerQjData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
					 this.getQjXAreaData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
					 this.fxdNumber(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
				 }
			},
			getNewWeek:function(){
				var d1 = new Date();
				var d2 = new Date();
				d2.setMonth(0);
				d2.setDate(1);
				var rq = d1-d2;
				var s1 = Math.ceil(rq/(24*60*60*1000));
				var s2 = Math.ceil(s1/7);
				return s2;
			},
			formatNumber: function(n) {
			    return n.toString().length > 1 ? n : '0' + n;
			},
			getWeek: function (year) {
			        var days = this.getDate(year || new Date().getFullYear())
			        var weeks = {};
			        for (var i = 0; i < days.length; i++) {
			            var weeksKeyLen = Object.keys(weeks).length;
			            var daySplit = days[i].split('_');
			            if (weeks[weeksKeyLen] == undefined) {
			                weeks[weeksKeyLen + 1] = [daySplit[0]]
			            } else {
			                if (daySplit[1] == '1') {
			                    weeks[weeksKeyLen + 1] = [daySplit[0]]
			                } else {
			                    weeks[weeksKeyLen].push(daySplit[0])
			                }
			            }
			         }
			         return weeks
			},
			 getDate: function (year) {
				 var dates = []
				 for (var i = 1; i <= 12; i++) {
					 for (var j = 1; j <= new Date(year, i, 0).getDate(); j++) {
						  dates.push(year + '-' + this.formatNumber(i) + '-' + this.formatNumber(j) + '_' + new Date([year, i, j].join('-')).getDay())
					 }
				 }
				 return dates
			},
			onClickItem:function(e) {
			           if (this.current !== e.currentIndex) {
			               this.current = e.currentIndex;
			           }
					   if(e.currentIndex == 0){
						   this.getServerData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1]);
						   this.getServerFxdData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1]);
					   }else{
							this.getServerQjData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
							this.getQjXAreaData(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
							this.fxdNumber(this.weeks[this.value2 + 1][0],this.weeks[this.value2 + 1][this.weeks[this.value2 + 1].length - 1],this.area);
						}
			       },
			getServerData(kssj,jssj){
				let nameList = [];
				let csList = [];
				uni.request({
				    url: getApp().globalData.textIp + '/tj/getSjxjcntTj',
				   data: {
					 "kssj": kssj,
					 "jssj": jssj
					},
					method:'POST',
				    success: (res) => {
						console.log('数据========>',res);
						res.data.data.map((item)=>{
							nameList.push(item.dz);
							csList.push(item.count);
						});
						console.log('nameList',nameList)
						let data = {"categories":nameList,"series":[{"name":"次数","data":csList,color:"#1b2f85",textColor:"#1b2f85",textSize:12}]};
						_self.serverData=data;
						let Column={categories:[],series:[]};
						Column.categories=data.categories;
						Column.series=data.series;
						_self.showColumn("canvasColumn",Column);
					},
				});
			},
			getServerFxdData(kssj,jssj){
				let nameList = [];
				let yxjList = [];
				let wxjList = [];
				let allCountList = [];
				uni.request({
				    url: getApp().globalData.textIp + '/tj/getSjxjTj',
				   data: {
					 "kssj": kssj,
					 "jssj": jssj
					},
					method:'POST',
				    success: (res) => {
						res.data.data.map((item)=>{
							nameList.push(item.dz);
							yxjList.push(item.xjCount);
							wxjList.push(item.unCount);
							allCountList.push(item.allCount);
						});
						let data = {"categories":nameList,"series":[{"name":"总数","data":allCountList,"color":"#0093ff",textColor:"#0093ff"},{"name":"已巡检","data":yxjList,color:'#ffcf29',textColor:"#ffcf29"}]};
						_self.serverData=data;
						let Column={categories:[],series:[]};
						Column.categories=data.categories;
						Column.series=data.series;
						_self.showFxd("canvasColumn1",Column);
					},
				});
			},
			getServerQjData(kssj,jssj,dz_dm){
				console.log('kssj,jssj,dz_dm======>',kssj,jssj,dz_dm)
				let nameList = [];
				let countList = [];
				uni.request({
				    url: getApp().globalData.textIp + '/tj/getXunJianTj',
				   data: {
					 kssj,
					 jssj,
					 dz_dm,
					},
					method:'POST',
				    success: (res) => {
						console.log('res.data.data',res.data.data);
						if(res.data.data&&res.data.data.length > 0){
							res.data.data.map((item)=>{
								nameList.push(item.xm);
								countList.push(item.sl);
							});
						}else{
							nameList.push('');
						}
						let data = {"categories":nameList,"series":[{"name":"次数","data":countList,color:"#1b2f85",textColor:"#1b2f85",textSize:12}]};
						_self.serverData=data;
						let Column={categories:[],series:[]};
						Column.categories=data.categories;
						Column.series=data.series;
						let max = Math.max(...countList) > 10 ? Math.max(...countList) : 10;
						_self.showQyQj("canvasColumn3",Column,nameList.length,max);
					},
				});
			},
			getQjXAreaData(kssj,jssj,dz_dm){
				let nameList = [];
				let countList = [];
				uni.request({
				    url: getApp().globalData.textIp + '/tj/getDaKaCsTj',
				   data: {
					 kssj,
					 jssj,
					 dz_dm,
					},
					method:'POST',
				    success: (res) => {
						console.log('巡检次数',res.data.data);
						if(res.data.data&&res.data.data.length > 0){
							res.data.data.map((item)=>{
								nameList.push(item.rq.substring(5,10));
								countList.push(item.sl);
							});
						}else{
							nameList.push('');
						}
						let max = Math.max(...countList) > 10 ? Math.max(...countList) : 10;
						let data = {"categories":nameList,"series":[{"name":"次数","data":countList,"color":"#1890ff",textColor:"#1890ff"}]}
						_self.serverData=data;
						let Column={categories:[],series:[]};
						Column.categories=data.categories;
						Column.series=data.series;
						_self.showQjColumn("canvasColumn2",Column,max);
					},
				});
			},
			fxdNumber(kssj,jssj,dz_dm){
				uni.request({
				    url: getApp().globalData.textIp + '/tj/getWeekXjTj',
				   data: {
					 kssj,
					 jssj,
					 dz_dm,
					},
					method:'POST',
				    success: (res) => {
						let allNum = res.data.data.total || 0;
						let data = {"series":[{"name":"未巡检  "+ res.data.data.unCount || 0,"data":res.data.data.unCount || 0,"color":"#1890ff"},{"name":"已巡检  "+res.data.data.xjCount || 0,"data":res.data.data.xjCount || 0,color:'#ffcf29'}]};
						_self.textarea = JSON.stringify(data);
						_self.showRing("canvasColumn4",data,allNum)
					},
				});
			},
			showRing(canvasId,chartData,allNum){
				canvaRing=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'ring',
					fontSize:12,
					padding:[10,15,15,15],
					legend:{
						show:true,
						padding:5,
						lineHeight:11,
						margin:10,
						position:"top",
						float:'right',
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
					subtitle: {
						name: allNum,
						color: '#7cb5ec',
						fontSize: 25*_self.pixelRatio,
					},
					title: {
						name: '总数',
						color: '#666666',
						fontSize: 15*_self.pixelRatio,
					},
					extra: {
						pie: {
						  offsetAngle: 0,
						  ringWidth: 40*_self.pixelRatio,
						  labelWidth:15
						}
					},
				});
			},
			showColumn(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'column',
					padding:[15,15,15,15],
					legend:{
						show:false,
					},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid:true,
					},
					yAxis: {
						gridType:'dash',
						dashLength:6,
						gridColor:'#d9e6fe',
						min:0,
					},
					dataLabel: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						column: {
						  width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length
						}
					  }
				});
			},
			showFxd(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'column',
					padding:[0,15,15,15],
					legend:{
						show:true,
						padding:5,
						lineHeight:11,
						margin:10,
						position:"top",
						float:'right',
					},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid:true,
						// axisLineColor:'#d9e6fe',
					},
					yAxis: {
						gridType:'dash',
						dashLength:6,
						gridColor:'#d9e6fe',
						min:0,
					},
					dataLabel: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						column: {
							type:'meter',
							width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length,
							meter:{
								//这个是外层边框的宽度
								border:0,
								//这个是内部填充颜色
								fillColor:'#0093ff'
							}
						}
					  }
				});
			},
			showQyQj(canvasId,chartData,len,max){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'column',
					padding:[15,15,15,15],
					legend:{
						show:false,
					},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					animation: true,
					enableScroll: len && len>4,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid:true,
						itemCount:4,
						scrollShow:true,
						scrollAlign:'left',
					},
					yAxis: {
						gridType:'dash',
						dashLength:6,
						gridColor:'#d9e6fe',
						min:0,
						max
					},
					dataLabel: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						column: {
						  width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length > 30 ? 30 : _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length
						}
					  }
				});
			},
			showfxdNumber(canvasId,chartData){
				canvaPie=new uCharts({
									$this:_self,
									canvasId: canvasId,
									type: 'funnel',
									fontSize:12,
									padding:[15,15,15,15],
									legend:{
										show:true,
										position:'right',
										float:'center',
										padding:10,
										lineHeight:26,
										margin:5,
										borderWidth :1
									},
									background:'#FFFFFF',
									pixelRatio:_self.pixelRatio,
									series: chartData.series,
									animation: true,
									width: _self.cWidth*_self.pixelRatio,
									height: _self.cHeight*_self.pixelRatio,
									dataLabel: true,
									extra: {
										pie: {
											border:true,
											borderColor:'#FFFFFF',
											borderWidth:3
										}
									},
								});
			},
			showQjColumn(canvasId,chartData,max){
				canvaArea=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'area',
					fontSize:11,
					padding:[15,15,15,15],
					legend:{
						show:false,
					},
					dataLabel:true,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						disableGrid:true,
						boundaryGap:"justify",
						// axisLineColor:'#d9e6fe',
					},
					yAxis: {
						gridType:'dash',
						dashLength:6,
						gridColor:'#d9e6fe',
						min:0,
						max,
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						area:{
							type: 'curve',
							opacity:0.2,
							addLine:true,
							width:2,
							gradient:false,
							gradient:true
						}
					}
				});
			},
			changeData(){
				canvaColumn.updateData({
					series: _self.serverData.series,
					categories: _self.serverData.categories 
				});
			},
			touchColumn(e){
				canvaColumn.scrollStart(e);
			},
			moveColumn(e) {
				canvaColumn.scroll(e);
			},
			touchEndColumn(e) {
				canvaColumn.scrollEnd(e);
				canvaColumn.touchLegend(e, {
					animation:true,
				});
				// canvaColumn.showToolTip(e, {
				// 	format: function (item, category) {
				// 		return category + ' ' + item.name + ':' + item.data 
				// 	}
				// });
			},
		}
	}
</script>

<style>
	.searchTime{
		width: 96%;
		background: #f5f5f5;
		overflow: hidden;
		padding: 0 2%;
		position: fixed;
		top: 50px;
		left: 0;
		z-index: 99;
		height: 46px;
	}
	.icon{
		position: absolute;
		top: 0;
		right: 15px;
	}
	.pageAll{
		/* float: right; */
		position: absolute;
		right: 12px;
		font-size: 12px; 
		color: #aaa;
		line-height: 46px;
	}
	.timePicker{
		text-align: left;
		padding: 0 15px;
	}
	.timeDisabled{
		height: 30px;
		background: #eee;
		border-radius: 50px;
		font-size: 12px;
		line-height: 30px;
		text-align: center;
		width: 100px;
		margin: 8px 5px;
		float: left;
		position: relative;
		color: #999;
	}
	.time{
		height: 30px;
		background: #fff;
		border-radius: 50px;
		font-size: 12px;
		line-height: 30px;
		text-align: center;
		width: 22%;
		margin: 8px 1%;
		float: left;
		position: relative;
	}
.qiun-padding{padding:2%; width:96%;}
.qiun-wrap{display:flex; flex-wrap:wrap;}
.qiun-rows{display:flex; flex-direction:row !important;}
.qiun-columns{display:flex; flex-direction:column !important;}
.qiun-common-mt{margin-top:20upx;}
.qiun-bg-white{background:#FFFFFF;}
.qiun-title-bar{width:96%; padding:15upx 2%; flex-wrap:nowrap; border-bottom: 0.25upx solid #e9e9e9;}
.qiun-title-dot-light{padding-left: 10upx; font-size: 30upx;color: #1b2f85}
.qiun-charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
.qiun-pie-charts{width: 750upx; height:420upx;background-color: #FFFFFF;}
.charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
.segmented-control--button{
	height: 50px!important;
}
.segmented-control__item--button{
		border-radius: 0!important;
		position: absolute;
		top: 0;
		background: #fff;
		border: none!important;
		height: 50px!important;
		border-bottom: 2px solid #fff!important;
	}
	.segmented-control__item--button--active{
		background: #fff!important;
		border-bottom: 2px solid #1b2f85!important;
	}
	.segmented-control__item--button .segmented-control__text{
		color: #999!important;
		}
	.segmented-control__item--button--active .segmented-control__text{
		color: #1b2f85!important;
		}
	.segmented-control{
		width:100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}
</style>
