function openComDB(name, path, callback) {  
     plus.sqlite.openDatabase({  
        name: name,  
        path: path,  
        success: function(e) {  
            // plus.nativeUI.alert('打开数据库成功');  
            callback(e)  
        },  
        fail: function(e) {  
            // plus.nativeUI.alert("打开数据库失败");  
            callback(e);  
        }  
    })  
}  

// setKsData 矿山列表
function setKsData(data,callback){
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists ksData("id" CHAR(100) PRIMARY KEY,"fzr_id" CHAR(100),"dz" CHAR(100),"jd" CHAR(100),"mc" CHAR(100),"ms" CHAR(100),"wd" CHAR(100))',//id,name,password,is_admin
		success: function(e){
			data.map((item)=>{
				plus.sqlite.executeSql({
					name: 'kqxj',
					sql: "insert or replace into ksData(id,fzr_id, dz, jd, mc, ms, wd) values('" + item.id + "', '" + item.fzr_id + "', '" + item.dz + "', '" + item.jd + "', '" + item.mc+ "', '" + item.ms + "', '" + item.wd + "')",
					success: function(e){
						callback({error:null});
					},
					fail: function(e){
						callback({error:JSON.stringify(e)})
					}
				});
			})
		}, 
		fail: function(e){
		
		}
	});
}
// 查询getKsData矿山列表语句
function getKsData(sql, callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			callback(e);  
		},  
		fail: function(e) { 
			callback([]);  
		}  
	});
}	
// setKsData 全部矿山列表
function setKsAllData(data,callback){
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists ksAllData("id" CHAR(100) PRIMARY KEY,"fzr_id" CHAR(100),"dz" CHAR(100),"jd" CHAR(100),"mc" CHAR(100),"ms" CHAR(100),"wd" CHAR(100),"visible" CHAR(100),"dz_dm" CHAR(100))',//id,name,password,is_admin
		success: function(e){
			data.map((item)=>{
				plus.sqlite.executeSql({
					name: 'kqxj',
					sql: "insert or replace into ksAllData(id,fzr_id, dz, jd, mc, ms, wd, visible,dz_dm) values('" + item.id + "', '" + item.fzr_id + "', '" + item.dz + "', '" + item.jd + "', '" + item.mc+ "', '" + item.ms + "', '" + item.wd+ "', '" + item.visible + "', '"  + item.dz_dm + "')",
					success: function(e){
						callback({error:null});
					},
					fail: function(e){
						callback({error:JSON.stringify(e)})
					}
				});
			})
		}, 
		fail: function(e){
		}
	});
}
// 查询getKsData全部矿山列表语句
function getKsAllData(sql, callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			callback(e);  
		},  
		fail: function(e) {  
			callback([]);  
		}  
	});
}	
// Config全局配置存储
function setConfig(data,callback){
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists config("id" CHAR(100) PRIMARY KEY,"must_update" CHAR(100),"max_dkjl" CHAR(100),"is_zz" CHAR(100),"tqyjtt_zz" CHAR(100),"tqgjtt_zz" CHAR(100),"yj_xq_num" CHAR(100),"xj_jzrq" CHAR(100),"app_update" CHAR(100),"app_down" CHAR(100),"xj_jg" CHAR(100),"xj_pc" CHAR(100),"xj_zq" CHAR(100),"xj_jg_zz" CHAR(100),"xj_pc_zz" CHAR(100),"xj_zq_zz" CHAR(100))',//id,name,password,is_admin
		success: function(e){
			plus.sqlite.executeSql({
				name: 'kqxj',
				sql: "insert or replace into config(id, must_update,max_dkjl, is_zz, tqyjtt_zz,tqgjtt_zz, yj_xq_num, xj_jzrq, app_update, app_down,xj_jg ,xj_pc, xj_zq,xj_jg_zz ,xj_pc_zz, xj_zq_zz) values('config', '" + data.must_update + "', '"+ data.max_dkjl + "', '"+ data.is_zz + "', '"+data.tqyjtt_zz + "', '"+data.tqgjtt_zz + "', '"+ data.yj_xq_num + "', '" + data.xj_jzrq + "', '" + data.app_update + "', '" + data.app_down + "', '"+ data.xj_jg + "', '"+ data.xj_pc + "', '" + data.xj_zq+ "', '"+ data.xj_jg_zz + "', '"+ data.xj_pc_zz + "', '" + data.xj_zq_zz + "')",
				success: function(e){
					callback({error:null});
				},
				fail: function(e){
					callback({error:JSON.stringify(e)})
				}
			});
		}, 
		fail: function(e){
		}
	});
}
// 查询Config全局配置存储
function getConfig(sql, callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			callback(e);  
		},  
		fail: function(e) {  
			callback([]);  
		}  
	});
}		
// setXjData巡查记录
function setXjData(data,callback){ 
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists xjData("id" CHAR(100) PRIMARY KEY,"ks_id" CHAR(100),"is_ycdk" CHAR(100),"is_dtxc" CHAR(100),"users_id" CHAR(100),"kczt_dm" CHAR(100),"yczt_dm" CHAR(100),"bz" CHAR(100),"dk_sj" CHAR(100),"dk_jd" CHAR(100),"dk_wd" CHAR(100),"dk_device" CHAR(100),"yj_zp" CHAR(100),"jj_zp" CHAR(100),"yj_zp_net" CHAR(100),"jj_zp_net" CHAR(100),"dsp" CHAR(100),"dsp_net" CHAR(100))',//id,name,password,is_admin
		success: function(e){
			data.map((item)=>{
				plus.sqlite.executeSql({
					name: 'kqxj',
					sql: "insert or replace into xjData(id, ks_id, is_ycdk, is_dtxc, users_id, kczt_dm, yczt_dm, bz,dk_sj,dk_jd,dk_wd,dk_device,yj_zp,jj_zp,yj_zp_net,jj_zp_net,dsp,dsp_net) values('" + item.id + "', '" + item.ks_id+ "', '"+ item.is_ycdk+ "', '"+ item.is_dtxc+ "', '" + item.users_id + "', '" + item.kczt_dm + "', '" + item.yczt_dm+ "', '" + item.bz+ "', '" + item.dk_sj+ "', '" + item.dk_jd+ "', '" + item.dk_wd+ "', '" + item.dk_device+ "', '" + item.yj_zp + "', '"+ item.jj_zp + "', '"+ item.yj_zp_net + "', '" + item.jj_zp_net+ "', '" + item.dsp+ "', '" + item.dsp_net + "')",
					success: function(e){
						callback({error:null});
					},
					fail: function(e){
						callback({error:JSON.stringify(e)})
					}
				});
			})
		}, 
		fail: function(e){
		}
	});
}
// setXjAllData全部巡查记录
function setXjAllData(data,callback){ 
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists xjAllData("id" CHAR(100) PRIMARY KEY,"ks_id" CHAR(100),"is_ycdk" CHAR(100),"is_dtxc" CHAR(100),"users_id" CHAR(100),"kczt_dm" CHAR(100),"yczt_dm" CHAR(100),"bz" CHAR(100),"dk_sj" CHAR(100),"dk_jd" CHAR(100),"dk_wd" CHAR(100),"dk_device" CHAR(100),"yj_zp" CHAR(100),"jj_zp" CHAR(100),"yj_zp_net" CHAR(100),"jj_zp_net" CHAR(100),"dsp" CHAR(100),"dsp_net" CHAR(100))',//id,name,password,is_admin
		success: function(e){
			data.map((item)=>{
				plus.sqlite.executeSql({
					name: 'kqxj',
					sql: "insert or replace into xjAllData(id, ks_id,is_ycdk,is_dtxc,users_id, kczt_dm, yczt_dm, bz,dk_sj,dk_jd,dk_wd,dk_device,yj_zp,jj_zp,yj_zp_net,jj_zp_net,dsp,dsp_net) values('" + item.id + "', '" + item.ks_id+ "', '" + item.is_ycdk+ "', '"+ item.is_dtxc+ "', '" + item.users_id + "', '" + item.kczt_dm + "', '" + item.yczt_dm+ "', '" + item.bz+ "', '" + item.dk_sj+ "', '" + item.dk_jd+ "', '" + item.dk_wd+ "', '" + item.dk_device+ "', '" + item.yj_zp + "', '"+ item.jj_zp + "', '"+ item.yj_zp_net + "', '" + item.jj_zp_net + "', '" + item.dsp+ "', '" + item.dsp_net + "')",
					success: function(e){
						callback({error:null});
					},
					fail: function(e){
						callback({error:JSON.stringify(e)})
					}
				});
			})
		}, 
		fail: function(e){
		}
	});
}
// 查询getXjData巡查记录
function getXjData(sql,callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			if (callback) { 
				callback(e) 
			}
		},  
		fail: function(e) {  
			callback([]);  
		}  
	});
}
// setXjDataUpLoad巡查记录没网
function setXjDataUpLoad(data,callback){
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists xjDataUpLoad("id" CHAR(100) PRIMARY KEY,"ks_id" CHAR(100),"is_ycdk" CHAR(100),"is_dtxc" CHAR(100),"users_id" CHAR(100),"kczt_dm" CHAR(100),"yczt_dm" CHAR(100),"bz" CHAR(100),"dk_sj" CHAR(100),"dk_jd" CHAR(100),"dk_wd" CHAR(100),"dk_device" CHAR(100),"yj_zp" CHAR(100),"jj_zp" CHAR(100),"yj_zp_net" CHAR(100),"jj_zp_net" CHAR(100),"dsp" CHAR(100),"dsp_net" CHAR(100))',//id,name,password,is_admin
		success: function(e){
			data.map((item)=>{
				plus.sqlite.executeSql({
					name: 'kqxj',
					sql: "insert or replace into xjDataUpLoad(id, ks_id,is_ycdk,is_dtxc,users_id, kczt_dm, yczt_dm, bz,dk_sj,dk_jd,dk_wd,dk_device,yj_zp,jj_zp,yj_zp_net,jj_zp_net,dsp,dsp_net) values('" + item.id + "', '" + item.ks_id+ "', '" + item.is_ycdk+ "', '"+ item.is_dtxc+ "', '" + item.users_id + "', '" + item.kczt_dm + "', '" + item.yczt_dm+ "', '" + item.bz+ "', '" + item.dk_sj+ "', '" + item.dk_jd+ "', '" + item.dk_wd+ "', '" + item.dk_device+ "', '" + item.yj_zp + "', '"+ item.jj_zp + "', '"+ item.yj_zp_net + "', '" + item.jj_zp_net  + "', '" + item.dsp+ "', '" + item.dsp_net + "')",
					success: function(e){
						// console.log(JSON.stringify(e))
						callback({error:null});
					},
					fail: function(e){
						// console.log('error',JSON.stringify(e))
						callback({error:JSON.stringify(e)})
					}
				});
			})
		}, 
		fail: function(e){
		}
	});
}
// 查询getXjData巡查记录没网待上传
function getXjDataUpLoad(sql, callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			callback(e);  
		},  
		fail: function(e) {  
			callback([]);  
		}  
	});
}
// 删除待上传getXjData巡查记录没网待上传
function deleteUpLoad(sql, callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			callback({error:null});  
		},  
		fail: function(e) {  
			callback({error:JSON.stringify(e)});  
		}  
	});
}
//setWtData 委托列表
function setWtData(data,callback){
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists wtData("id" CHAR(100) PRIMARY KEY,"ks_id" CHAR(100),"wt_sj" CHAR(100),"fqr_id" CHAR(100),"bwtr_id" CHAR(100),"wtzt_dm" CHAR(100),"wtzt_mc" CHAR(100))',
		success: function(e){
			data.map((item)=>{
				plus.sqlite.executeSql({
					name: 'kqxj',
					sql: "insert or replace into wtData(id, ks_id, wt_sj, fqr_id, bwtr_id,wtzt_dm,wtzt_mc) values('" + item.id + "', '" + item.ks_id + "', '" + item.wt_sj + "', '" + item.fqr_id + "', '" + item.bwtr_id + "', '" + item.wtzt_dm + "', '" + item.wtzt_mc + "')",
					success: function(e){
						callback({error:null});
					},
					fail: function(e){
						callback({error:JSON.stringify(e)})
					}
				});
			})
		}, 
		fail: function(e){
		}
	});
}
// 查询委托
function getWtData(sql, callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			callback(e);  
		},  
		fail: function(e) {  
			callback([]);  
		}  
	});
}	
//setUsersData 用户列表
function setUsersData(data,callback){
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists usersData("id" CHAR(100) PRIMARY KEY,"xm" CHAR(100),"lxdh" CHAR(100),"is_admin" CHAR(100),"is_zz" CHAR(100),"dw_mc" CHAR(100),"zw_mc" CHAR(100),"org_id" CHAR(100),"org_name" CHAR(100),"fkr_id" CHAR(100))',
		success: function(e){
			data.map((item)=>{
				plus.sqlite.executeSql({
					name: 'kqxj',
					sql: "insert or replace into usersData(id, xm, lxdh, is_admin, is_zz, dw_mc,zw_mc,org_id,org_name,fkr_id) values('" + item.id + "', '" + item.xm + "', '" + item.lxdh + "', '" + item.is_admin + "', '"+ item.is_zz + "', '" + item.dw_mc + "', '" + item.zw_mc + "', '" + item.org_id + "', '" + item.org_name + "', '" + item.fkr_id + "')",
					success: function(e){
						callback({error:null});
					},
					fail: function(e){
						callback({error:JSON.stringify(e)})
					}
				});
			})
		}, 
		fail: function(e){
		}
	});
}
// 查询用户列表
function getUsersData(sql, callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			callback(e);  
		},  
		fail: function(e) {  
			callback([]);  
		}  
	});
}
//setUsersData 用户列表
function setUsersAllData(data,callback){
	plus.sqlite.executeSql({
		name: 'kqxj',
		sql: 'create table if not exists usersAllData("id" CHAR(100) PRIMARY KEY,"xm" CHAR(100),"lxdh" CHAR(100),"is_admin" CHAR(100),"is_zz" CHAR(100),"dw_mc" CHAR(100),"zw_mc" CHAR(100),"org_id" CHAR(100),"org_name" CHAR(100),"fkr_id" CHAR(100))',
		success: function(e){
			data.map((item)=>{
				plus.sqlite.executeSql({
					name: 'kqxj',
					sql: "insert or replace into usersAllData(id, xm, lxdh, is_admin, is_zz, dw_mc,zw_mc,org_id,org_name,fkr_id) values('" + item.id + "', '" + item.xm + "', '" + item.lxdh + "', '" + item.is_admin + "', '"+ item.is_zz + "', '" + item.dw_mc + "', '" + item.zw_mc + "', '" + item.org_id + "', '" + item.org_name +"', '" + item.fkr_id + "')",
					success: function(e){
						callback({error:null});
					},
					fail: function(e){
						callback({error:JSON.stringify(e)})
					}
				});
			})
		}, 
		fail: function(e){
		}
	});
}
// 查询用户列表
function getUsersAllData(sql, callback){
	plus.sqlite.selectSql({
		name:'kqxj',  
		sql: sql,  
		success: function(e) {  
			callback(e);  
		},  
		fail: function(e) {  
			callback([]);  
		}  
	});
}
export{  
openComDB,  
setKsData,
getKsData,
setConfig,
getConfig,
getXjData,
setXjData,
getWtData,
setWtData,
getUsersData,
setUsersData,
setXjDataUpLoad,
getXjDataUpLoad,
setKsAllData,
getKsAllData,
setXjAllData,
deleteUpLoad,
getUsersAllData,
setUsersAllData,
}