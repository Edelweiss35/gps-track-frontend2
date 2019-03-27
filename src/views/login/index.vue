<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <div class="title-container">
        <!-- <h3 class="title">GPSBD®监控基础平台</h3> -->
        <!-- <div class="logo">GPS<span>BD</span><span>®</span>卫星定位系统</div> -->
        <div class="logo"><span class="system-name">GPS<font color="#409eff">BD</font></span><span class="trademark">®</span><span class="system-title">{{$t("common.systemName")}}</span></div>
        <lang-select class="set-language"></lang-select>
      </div>
      <el-form-item prop="account"  :rules="[
      { required: true, message: $t('common.accountEmpty')},
      { min: 2, max: 12, message: $t('common.incorrectAccount'), trigger: 'blur' }
        ]">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="account" type="text" v-model="loginForm.account" autoComplete="on" :placeholder="$t('register.account')" />
      </el-form-item>
      <el-form-item prop="password" :rules="[{ required: true, message: $t('common.pwdEmpty')}]">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          :placeholder="$t('register.password')" ></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
        {{$t("login.login")}}
        </el-button>
      </el-form-item>
      <el-form-item v-if="registration">
        <el-button type="info" style="width:100%;" @click="$router.push({ path: '/register' })">
        {{$t("login.register")}}
        </el-button>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-tooltip placement="top">
            <div slot="content"><img width="180" src="http://base.gpsbd.com/down/android.png"/></div>
            <el-button style="width:90%"><font-awesome-icon :icon="['fab','android']"/> GPSBD-{{$t('common.client')}}</el-button>
          </el-tooltip>
        </el-col>
        <!-- <el-col :span="8">
          <el-tooltip placement="top">
            <div slot="content">开发中...</div>
            <el-button style="float:right;width:90%"><font-awesome-icon :icon="['fab','apple']"/> GPSBD-Client</el-button>
          </el-tooltip>
        </el-col> -->
        <el-col :span="12">
          <el-tooltip placement="top">
            <div slot="content"><img width="180" src="http://base.gpsbd.com/down/gpsbd_track.png"/></div>
            <el-button style="float:right;width:90%"><font-awesome-icon :icon="['fas','street-view']"/> GPSBD-{{$t('common.track')}}</el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="24" class="demo-guide">
          <p class="desc">You can login with demo account, but you will be restricted to use specific functions.</p>
          <p class="account-info">Demo account: <b>demo</b> | Password: <b>demo1234</b></p>
        </el-col>
      </el-row>
    </el-form>

    <div class ="footer-copyright">
			<el-button type="text" size="small">{{$store.state.common.system.name}}® Version:{{$store.state.common.system.version}} ©{{$store.state.common.system.date}} {{$store.state.common.system.company}}</el-button>
	 </div>
  </div>
</template>

<script>
import '@/styles/common.scss';
import LangSelect from '@/components/LangSelect'
import { getConfigReg,userLogin,installCheck } from '@/api/api'

export default {
  name: 'login',
  components: { LangSelect},
  data() {

    return {
      registration:true,
      loginForm: {
        account: '',
        password: '',
        client:0
      },

      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    init(){
      installCheck().then(data => {
          if(!data){
            this.$router.push({path: '/install'})
          }else{
            getConfigReg().then(data => {
                this.registration = data;
            })
          }
      })

    },
    handleLogin() {
      this.loading=true;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
            this.$store.dispatch('Login', this.loginForm).then(data => {
                this.loading = false;
              //  this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
        }
      })
    }
  },
  mounted() {
      this.init();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 500;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 500px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
  .demo-guide {
    margin-top: 20px;
    text-align: center;
    padding: 10px;
    background-color: rgba(255,255,255,0.8);
    border-radius: 10px;  
    .desc {
      font-size: 14px;
      color: green;
    }
    .account-info {
      font-size: 13px;
      color: #454545;
    }
  }
  .footer-copyright span{
    color:#909399
  }
  .logo {
    color:#fff;
    text-align: center;
    padding-bottom: 26px;
    //font:italic bold 28px arial,sans-serif;
    .system-name {
      color:#ffffff;
      font:italic bold 26px/50px arial,sans-serif;
    }
    .trademark {
       vertical-align: top;
       font-size: 12px;
       padding: 3px;
    }
    .system-title {
       font:bold 26px "microsoft yahei";
       padding: 3px;
    }
  }
</style>
