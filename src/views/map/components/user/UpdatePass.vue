<template>
	<el-dialog :title="$t('common.updatePass')" width="30%" :visible="$store.state.user.visibles.updatePassDialog" :before-close="handleClose" :lock-scroll="false">
		<el-form label-width="80px" ref="userForm" :rules="rules" :model="userForm" >
			<el-form-item :label="$t('register.password')" prop="password">
			 <el-input type="password" v-model="userForm.password" auto-complete="off"></el-input>
		 </el-form-item>
		 <el-form-item :label="$t('register.password2')" prop="password2">
			 <el-input type="password" v-model="userForm.password2" auto-complete="off"></el-input>
		 </el-form-item>
		 </el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" @click.native="editSubmit">{{$t('common.ok')}}</el-button>
		</div>

	</el-dialog>
</template>

<script>
	import { updatePass } from '@/api/api';
	import { util } from '@/utils/util';
	export default {
		name: 'UpdatePass',

		data() {
			var validatePass = (rule, value, callback) => {
				console.log(value);
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.userForm.password2 !== '') {
            this.$refs.userForm.validateField('password2');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
			return {
				userForm:{
					password:'',
					password2:''
				},
				rules: {
					password: [
             { validator: validatePass, trigger: 'blur' },
						 { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
           ],
           password2: [
             { validator: validatePass2, trigger: 'blur' },
						  { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
           ],
				}

			}
		},
		methods: {
			handleClose: function() {
				this.$store.dispatch('setVisblesFlag', [{key:'updatePassDialog',value:false}]);
			},
			editSubmit(){
				this.$refs.userForm.validate((valid) => {
				 if (valid) {
					 updatePass(this.userForm).then((res) => {
							 //localStorage.removeItem("user");
							 //this.$store.dispatch('signoutRestData');
							 //this.$store.dispatch('setVisblesFlag', [{key:'login',value:true},{key:'deviceMenu',value:false},{key:'updatePassDialog',value:false}]);
							 this.$store.dispatch('cleanToken').then(() => {
								 this.$store.dispatch('Exit').then(() => {
									 location.reload() // 为了重新实例化vue-router对象 避免bug
								 })
							 })
					 });
				 } else {
					 return false;
				 }
			 });
			}

		},
		mounted() {

		}
	}
</script>
