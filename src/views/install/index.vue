<template>
  <div class="install-container">
    <el-row>
      <el-col :span="24">
        <h2>GPSBD卫星定位监控基础系统安装</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-steps :active="active" finish-status="success" simple>
          <el-step title="软件许可协议"></el-step>
          <el-step title="填写企业信息"></el-step>
          <el-step title="初始化数据"></el-step>
          <el-step title="安装成功"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row v-loading="loading">
      <el-col :span="24" v-show="active<1">

        版权所有 (c)2014-2018 安徽东位信息科技有限公司 gpsbd.com 保留所有权利。<br><br>

        感谢您使用GPSBD®卫星定位监控基础系统，GPSBD是一款基于JAVA轻量级GPS北斗卫星定位系统软件，依托企业级JAVA的高效、安全、稳定等优势，使用前后端分离的形式开发的模块化系统。
        数据库使用MYSQL，并支持ORACLE、DB2、SqlServer等主流数据库，官方网址：<a href="http://www.gpsbd.com" target="_blank">www.gpsbd.com</a>。
        无论您的使用目的为何，均请先仔细阅读本许可协议，如果您安装、使用、修改或分发本软件，则表示您已经完全接受本许可协议的所有条款。<br><br>

        一、许可<br>
        1.1 GPSBD®是由安徽东位信息科技自主研发的卫星定位系统，并已向国家商标局申请注册了GPSBD的商标，项目代码已向中国版权保护中心申请软件著作权。知识产权归安徽东位信息科技独立所有！<br>
        1.2 如果您是个人用户，可将本软件用于非商业用途，而不必支付软件授权许可费，商业则需购买GPSBD商业授权，例如：政府单位、教育机构、协会团体、企业、以赢利为目的等。<br>
        1.3 您可以在本协议的许可范围内，修改GPSBD源代码和界面风格以适应您的业务要求。<br>
        1.4 您拥有使用本软件构建的系统所有权，并独立承担与系统的相关法律义务。<br>
        1.5 在获得商业授权之后，您可以将本软件用于商业用途。<br>
        1.6 商业授权用户享有反映和提出意见的权力，并被优先考虑，但没有一定被采纳的承诺或保证。<br><br>

        二、测试版（beta）<br>
        2.1 测试版&ldquo;软件&rdquo;其性能和兼容性均未能达到最终全面发布版本的级别，将来也存在对&ldquo;软件&rdquo;进行重大更改的可能，其仅供测试&ldquo;软件&rdquo;之用，请勿用于正式用途。<br><br>

        三、约束和限制<br>
        3.1 在未获得商业授权之前，任何单位或个人不得将本软件用于商业用途（包括但不限于企业、政府单位、经营性、以盈利为目的）和任何非个人所有的项目中。如果您需要购买商业授权，请登录http://www.gpsbd.com了解详细说明。<br>
        3.2 未经官方许可，禁止修改本软件的整体或任何部分用于重新发布第三方版本。<br>
        3.3 不得对本软件或与之关联的商业授权进行出租、出售、抵押或发放子许可证。<br>
        3.4 在使用了GPSBD系统禁止自主去除相关位置的GPSBD版本标志或相关<a href="http://www.gpsbd.com" target="_blank">www.gpsbd.com</a>的链接。<br><br>

        四、免责声明<br>
        4.1 用户完全自愿使用本软件，您必须了解使用本软件的风险，且愿意承担使用本软件的风险。<br>
        4.2  任何情况下，我们不就因使用或不能使用本软件所发生的特殊的、意外的、非直接或间接的损失承担赔偿责任（包括但不限于，资料损失，资料执行不精确，或因由您或第三人承担的损失，或本程序无法与其他程序运作等）。即使已经被事先告知该损害发生的可能性。
        <el-row>
        <el-col :span="12" :offset="9">
          <el-button type="primary" @click="readLicense">允许</el-button>
          <el-button type="danger" @click="$message({message: '请关闭本页',type: 'warning'})">取消</el-button>
        </el-col>
      </el-row>

      </el-col>

        <el-col :span="12" :offset="3" v-show="active==1">
          <el-form ref="devForm" :model="devForm" label-width="180px">
            <el-form-item label="企业名称" prop="name" :rules="[{ required: true, message: '企业名称不能为空'},{ min: 2, max: 16, message: '请输入正确的企业名称', trigger: 'blur' }]">
            <el-input v-model="devForm.name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '邮箱不能为空'},{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
            <el-input v-model="devForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone" :rules="[{ required: true, message: '电话不能为空'},{ min: 11, max: 12, message: '请输入正确的电话', trigger: 'blur' }]">
            <el-input v-model="devForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '密码不能为空'},{ min: 6, message: '密码至少6位以上', trigger: 'blur' }]">
            <el-input v-model="devForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAppSecret">确认</el-button>
                <el-button type="danger" @click="active--">取消</el-button>
            </el-form-item>

            </el-form>
        </el-col>
        <el-col :span="12" :offset="4" v-show="active==2">
          <el-form ref="databaseForm" :model="databaseForm" label-width="180px">
            <el-form-item label="数据库主机" prop="dbHost"  :rules="[{ required: true, message: '主机地址不能为空'},{ min: 6, message: '请输入正确主机地址', trigger: 'blur' }]">
            <el-input v-model="databaseForm.dbHost"></el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="dbPort"  :rules="[{ required: true, message: '主机端口不能为空'},{ min: 2, max:6, message: '请输入正确主机端口', trigger: 'blur' }]">
            <el-input v-model="databaseForm.dbPort"></el-input>
            </el-form-item>
            <el-form-item label="数据库名" prop="dbName" :rules="[{ required: true, message: '数据库名不能为空'},{ min: 2, message: '请输入正确数据库名', trigger: 'blur' }]">
            <el-input v-model="databaseForm.dbName"></el-input>
            </el-form-item>
            <el-form-item label="数据库用户" prop="dbUserName" :rules="[{ required: true, message: '数据库用户名不能为空'},{ min: 2, message: '请输入正确数据库用户名', trigger: 'blur' }]">
            <el-input v-model="databaseForm.dbUserName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="dbPassword" :rules="[{ required: true, message: '数据库密码不能为空'},{ min: 2, message: '请输入正确数据库密码', trigger: 'blur' }]">
            <el-input v-model="databaseForm.dbPassword"></el-input>
            </el-form-item>
            <el-form-item label="创建数据库">
              <el-radio-group v-model="databaseForm.createDataBase">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="初始化数据">
              <el-radio-group v-model="databaseForm.initData">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Redis主机地址" prop="redisHost" :rules="[{ required: true, message: 'Redis主机地址不能为空'},{ min: 6, message: '请输入正确Redis主机地址', trigger: 'blur' }]">
              <el-input v-model="databaseForm.redisHost"></el-input>
            </el-form-item>
            <el-form-item label="Redis端口" prop="redisPort" :rules="[{ required: true, message: 'Redis主机端口不能为空'},{ min: 4,max:6, message: '请输入正确Redis主机端口', trigger: 'blur' }]">
              <el-input v-model="databaseForm.redisPort"></el-input>
            </el-form-item>
            <el-form-item label="Redis密码">
              <el-input v-model="databaseForm.redisPassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="initData">确认</el-button>
                <el-button type="danger" @click="active--">取消</el-button>
            </el-form-item>

            </el-form>
        </el-col>
        <el-col :span="12" :offset="9" v-show="active==3">
          <h2>恭喜GPSBD安装成功</h2>
          <h3>默认管理员账号admin 密码666666</h3>
          <h3>默认超级管理员账号root 密码888888</h3>
          <router-link to="/">
            <el-button type="primary">进入系统</el-button>
          </router-link>

        </el-col>
    </el-row>


    <div class ="footer-copyright">
			<el-button type="text" size="small">{{$store.state.common.system.name}}® Version:{{$store.state.common.system.version}} ©{{$store.state.common.system.date}} {{$store.state.common.system.company}}</el-button>
	 </div>
  </div>
</template>

<script>
import '@/styles/common.scss';
import LangSelect from '@/components/LangSelect'
import { getConfigReg,userLogin,installCheck,installSecond,installThird } from '@/api/api'

export default {
  name: 'login',
  components: { LangSelect},
  data() {

    return {
        loading:false,
        active: 0,
        devForm:{},
        databaseForm:{
          dbHost:'localhost',
          dbPort:'3306',
          dbName:'gps',
          dbUserName:'root',
          dbPassword:'lbssoft_GPSBD_2019',
          createDataBase:true,
          initData:true,
          redisHost:'localhost',
          redisPort:'6379',
          redisPassword:'',
        }
    }
  },
  methods: {
      init(){
        installCheck().then(data => {
            if(data){
                this.active = 3;
            }
        })
      },
      readLicense(){
        this.active++;;
      },
      getAppSecret(){
        this.$refs.devForm.validate(valid => {
          if (valid) {
              this.loading = true;
              installSecond(this.devForm).then(data => {
                    this.active++;
                    this.loading=false;
              })
            }
          })
      },
      initData(){
        this.$refs.databaseForm.validate(valid => {
            if (valid) {
              this.loading = true;
              installThird(this.databaseForm).then(data => {

                    this.active++;
                    this.loading=false;
              })
            }
        });
      }
  },
  mounted() {
      this.init();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  body {
    overflow: auto;
  }
  .install-container {
    padding: 50px;
    height: 100%;
    width:100%;
    .el-row {
        margin-top: 20px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  }
</style>
