<template>
	<div id="gps-user" class="gps-user-box" >

		<el-popover
		  ref="popover5"
		  placement="top-end"
		  width="220"
		  >
			<el-row>
			<el-col :span="6"><div class="avatar panel-avatar" v-bind:style="'background-image: url(/static/icon/avatar_.png)'"></div></el-col>
			<el-col :span="8">
				<div class="user-info">
					<b>{{$store.state.common.user.account}}</b><br>
					<el-tag 
						type="gray" 
						size="small" 
						v-for="(roleKey,index) in roleKeys" 
						:key="index"
					>{{$t("common." + roleKey)}}
					</el-tag>
				</div>
			</el-col>
			<el-col :span="6" :offset="4" class="user-setting"><el-button @click.native="handleSetting"> <font-awesome-icon icon="cog"/></el-button></el-col>
			</el-row>
			<el-row>
				<el-col :span="24"><hr style="color:blue;border-style:dotted;color:#CCC"></el-col>
			</el-row>
			<el-row v-if="false">
				<el-col :span="24">
					<el-button type="primary" size="small" style="width:100%;" @click.native="$store.dispatch('setVisblesFlag', [{key:'statisticsTripDialog',value:true}]);"><font-awesome-icon icon="chart-bar"/> {{$t("map.userDeviceStatistics")}}</el-button>
				</el-col><br><br>
			</el-row>
			<el-row  v-if="hasPermission('user:group:view')">
				<el-col :span="24">
					<el-button type="primary" size="small" style="width:100%;" @click.native="$store.dispatch('setVisblesFlag', [{key:'groupsDialog',value:true}]);"><font-awesome-icon icon="folder"/>  {{$t("map.userGroupManage")}}</el-button>
				</el-col><br><br>
			</el-row>
			<el-row  v-if="hasPermission('user:user:update')">
				<el-col :span="24">
					<el-button type="primary" size="small"  style="width:100%;" @click.native="$store.dispatch('setVisblesFlag', [{key:'updatePassDialog',value:true}]);"><font-awesome-icon icon="unlock"/>  {{$t("map.userUpdatePass")}}</el-button>
				</el-col><br><br>
			</el-row>
			<el-row v-if="false">
				<el-col :span="24">
					<el-button type="primary" size="small"  style="width:100%;" @click="windowOpenHelp"><font-awesome-icon icon="question-circle"/> {{$t("map.userUserManual")}}</el-button>
				</el-col><br><br>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-button type="danger"  size="small" style="width:100%;" @click.native="exitSystem"><font-awesome-icon icon="undo"/> {{$t("map.userExitSystem")}}</el-button>
				</el-col>
			</el-row>

		</el-popover>

		<el-button v-popover:popover5 class="user-avatar" v-bind:style="'background-image: url(/static/icon/avatar_.png)'">
		</el-button>
		<UpdatePass></UpdatePass>
		<Groups></Groups>
		<DeviceStatistics></DeviceStatistics>
		<UserConfig></UserConfig>
	</div>
</template>

<script>
	import '@/styles/gps-user.scss';
	import {util} from '@/utils/util';
	import UpdatePass from './UpdatePass';
	import Groups from './Groups'; //围栏
	import DeviceStatistics from './DeviceStatistics'; //里程统计
	import UserConfig from './UserConfig';
	export default {
		name:'toolsbox',
		data() {
			return{
			}
		},
		methods:{
			handleSetting() {
				this.$store.dispatch('setVisblesFlag', [{key:'userConfigDialog',value:true}]);
				this.$store.dispatch("initUserSetting");
			},
			showUserLogin(){
				this.$store.dispatch('userLoginDialogTrg',true)
			},
			exitSystem(){
				this.$confirm(this.$t('tips.signOut'), this.$t('tips.tips'), {
		          type: 'warning',
							lockScroll:false
		        }).then(() => {
							this.$store.dispatch('cleanToken').then(() => {
								this.$store.dispatch('Exit').then(() => {
									location.reload() // 为了重新实例化vue-router对象 避免bug
								})
							})

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '取消系统退出'
		          });

		        });
			},
			windowOpenHelp(){
					  window.open('http://docs.gpsbd.com/lbs-gpsbd-docs/#/');
			}

		},
		computed: {
			roleKeys() {
				var _roleKeys = this.$store.state.common.user.roleKeys;
				if(typeof _roleKeys != 'undefined' && _roleKeys != null)
					return _roleKeys.split(',')
				else 
					return []
			}
		},
		mounted(){
			
		},
		components: {
			UpdatePass,
			Groups,
			DeviceStatistics,
			UserConfig
		}
	}
</script>
<style>
.user-setting button {
	border: none;
    font-size: 23px;
    padding: 10px;
    border-radius: 100px;
}
</style>

