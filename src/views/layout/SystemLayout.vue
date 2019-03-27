<template>
  <!--todo 切换路由白一下-->
  <div class="container" :class="{hideSidebar:!this.$store.state.system.app.sidebar.opened}">
      <el-col :span="24" class="header">
  			<el-col :span="10" class="logo" :class="!this.$store.state.system.app.sidebar.opened?'logo-collapse-width':'logo-width'">
  				<div v-if="this.$store.state.system.app.sidebar.opened"><span class="system-name">GPS<font color="#409eff">BD</font></span><span class="trademark">®</span><span class="version">v{{$store.state.common.system.version}}</span></div>
          <div v-if="!this.$store.state.system.app.sidebar.opened"><span class="collapse-system-name">GPS</span></div>

  			</el-col>
  			<el-col :span="10">
            <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="$store.state.system.app.sidebar.opened"></hamburger>
              <el-button size="mini"  @click="windowOpenHelp('http://docs.gpsbd.com/lbs-gpsbd-docs/#/')">{{$t('system.manual')}}</el-button>
              <el-button size="mini"  @click="showAPiDocs()">{{$t('system.apiDoc')}}</el-button>
              <el-button size="mini"  @click="windowOpenHelp('http://docs.gpsbd.com/lbs-gpsbd-dev-docs/')">{{$t('system.devDoc')}}</el-button>
              <el-button size="mini"  @click="windowOpenHelp('http://docs.gpsbd.com/vue-lbsmap-docs/')">LBSMap {{$t('system.devDoc')}}</el-button>
              <el-button size="mini"  @click="windowOpenHelp('http://docs.gpsbd.com/sdk-api-docs/')">DataLink-SDK API</el-button>
  			</el-col>

  			<el-col :span="4" class="userinfo">

          <lang-select class="international right-menu-item"></lang-select>
  				<el-dropdown trigger="hover">
  					<span class="el-dropdown-link userinfo-inner">  <svg-icon icon-class="user" />{{$store.state.common.user.account}} <i class="el-icon-caret-bottom"></i></span>
  					<el-dropdown-menu slot="dropdown">
              <router-link to="/dashboard">
                <el-dropdown-item>{{$t('system.home')}}</el-dropdown-item>
              </router-link>
              <router-link to="/map">
                <el-dropdown-item>{{$t('system.monitor')}}</el-dropdown-item>
              </router-link>
  						 <el-dropdown-item @click.native="$store.dispatch('setVisblesFlag', [{key:'updatePassDialog',value:true}]);">{{$t('system.changePwd')}}</el-dropdown-item>
  						<el-dropdown-item divided @click.native="logout">{{$t('system.signOut')}}</el-dropdown-item>
  					</el-dropdown-menu>
  				</el-dropdown>
  			</el-col>
  		</el-col>
  		<el-col :span="24" class="main">
  			<sidebar class="sidebar-container"></sidebar>
        <div class="main-container">
          <navbar></navbar>
          <app-main></app-main>
          <UpdatePass></UpdatePass>
        </div>

  		</el-col>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import Hamburger from '@/components/Hamburger'
import UpdatePass from '../map/components/user/UpdatePass';
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'
export default {
  name: 'layout',
  components: {
    LangSelect,
    Hamburger,
    Navbar,
    Sidebar,
    UpdatePass,
    AppMain
  },
  methods: {
    logout() {
      this.$store.dispatch('cleanToken').then(() => {
        this.$store.dispatch('Exit').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    windowOpenHelp(url){

       window.open(url);
    },
    showAPiDocs(){
       window.open('http://'+window.location.hostname+':8085/swagger-ui.html');
    }
  },
  mounted() {

 }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
// .app-wrapper {
//   @include clearfix;
//   position: relative;
//   height: 100%;
//   width: 100%;
// }


.main-container{
  width: 100%;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.hamburger-container {
  line-height: 58px;
  height: 50px;
  float: left;
  padding: 0 10px;
  fill:#ffffff;
}

.container {
  @include clearfix;
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 50px;
			line-height: 50px;
			background: #304156;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;

				}
			}
			.logo {
				height:50px;

				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
        .system-name {
          color:#ffffff;
          font:italic bold 22px/50px arial,sans-serif;
        }
        .trademark {
           vertical-align: super;
           font-size: 12px;
           padding: 3px;
        }
        .version {
           font-size: 12px;
           padding: 3px;
        }
			}
			.logo-width{
				width:180px;
			}
			.logo-collapse-width{
				width:30px;
        .collapse-system-name {
              margin-left: -18px;
              font:italic bold 16px arial,sans-serif;
        }
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 50px;
				line-height: 50px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 50px;
			bottom: 0px;
			overflow: hidden;

		}
	}

</style>
