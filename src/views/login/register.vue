<template>
  <div class="register-container">
    <el-form autoComplete="on" :model="registerForm" :rules="registerFormRules" ref="registerForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">   {{$t("register.userRegister")}}</h3>

          <el-radio-group v-model="registerForm.roleIds[0]" >
          <el-radio :label="item.value" v-for="(item,index) in roles" :key="index">{{item.label}}</el-radio>
        </el-radio-group>
      <br><br>
      <el-form-item prop="account">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="account" type="text" v-model="registerForm.account" autoComplete="on" :placeholder="$t('register.account')" />
      </el-form-item>
      <el-form-item prop="email">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="email" type="text" v-model="registerForm.email" autoComplete="on" :placeholder="$t('register.email')" />
      </el-form-item>
      <el-form-item prop="phone">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="phone" type="text" v-model="registerForm.phone" autoComplete="on" :placeholder="$t('register.mobile')" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleRegister" v-model="registerForm.password" autoComplete="on"
          :placeholder="$t('register.password')"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="password2">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password2" :type="pwdType" @keyup.enter.native="handleRegister" v-model="registerForm.password2" autoComplete="on"
          :placeholder="$t('register.password2')"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleRegister">
          {{$t("login.register")}}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" style="width:100%;" :loading="loading" @click="$router.push({ path: '/login' })">
          {{$t("login.login")}}
        </el-button>
      </el-form-item>
    </el-form>
    <div class ="footer-copyright">
      <el-button type="text" size="small">{{$store.state.common.system.name}}® Version:{{$store.state.common.system.version}} ©{{$store.state.common.system.date}} {{$store.state.common.system.company}}</el-button>
   </div>
  </div>
</template>

<script>
import '@/styles/common.scss';
import {userRegister } from '../../api/api';

export default {
  name: 'register',
  data() {

    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error(this.$("common.pwdLengthErr")))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$("common.enterPwdAgain")));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      roles:[{
         value: 1,
         label: this.$t('common.personal')
       },
        {
         value: 2,
         label: this.$t('common.enterprise')
       }],
      registerForm: {
        roleIds:[1],
        account: '',
        password: ''
      },
      registerFormRules: { //登录框验证规则
        account: [
          { required: true, message: this.$t("common.enterAccount"), trigger: 'blur' },
          { min: 2, max: 12, message: this.$t("common.incorrectAccount"), trigger: 'blur' }
        ],
        email:[
          { type: 'email', message: this.$t("common.incorrectEmail"), trigger: ['blur', 'change']}
        ],
        phone:[
          { min: 11, max: 11, message: this.$t("common.incorrectPhone"), trigger: 'blur'},
        ],
        password:[
          { required: true, message: this.$t("common.incorrectPwd"), trigger: 'blur' },
        ],
        password2:[
          { validator: validatePass2, trigger: 'blur' },
        ]
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
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          userRegister(this.registerForm).then((res) => {
            this.$message({
             message: this.$t("common.registerSuccess"),
             type: 'success'
           });
            this.$router.push({path: '/login'})
          });

        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .register-container {
    position: fixed;
        overflow: auto;
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
  .footer-copyright span{
    color:#909399
  }
</style>
