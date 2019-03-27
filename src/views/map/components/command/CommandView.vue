<template>
	<section>
			<h3>{{device.name}}  {{command.name}}</h3>
		<el-form ref="form"  :model="this.form" label-width="160px"  inline>
			<el-form-item v-for="(formView,index) in formViews"  :key="index" :label="formView.label" :prop="formView.name">

				<el-select v-if="formView.type=='select'" v-model="form[formView.name]" placeholder="请选择">
			    <el-option
			      v-for="item in formView.options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>

			    <el-input v-if="formView.type=='input'" v-model="form[formView.name]"></el-input>

					<el-input-number v-if="formView.type=='input-number'" v-model="form[formView.name]" :min="formView.min" :max="formView.max"></el-input-number>

			    <el-radio-group v-if="formView.type=='radio'" v-model="form[formView.name]">
				    <el-radio v-for="(option,index) in formView.options"  :key="index" :label="option.value">{{option.label}}</el-radio>
				 </el-radio-group>

				 <el-checkbox-group
				 	v-if="formView.type=='checkbox'"
				    v-model="form[formView.name]"
				    >
				    <el-checkbox v-for="(option) in formView.options"  :key="option.value" :label="option.value">{{option.label}}</el-checkbox>
				  </el-checkbox-group>
					<el-time-select
					v-if="formView.type=='time-select'"
					v-model="form[formView.name]"
					:picker-options="{
						start: '00:00',
						step: '00:15',
						end: '23:59'
					}"
					placeholder="选择时间">
				</el-time-select>

				<el-date-picker
				 v-if="formView.type=='date-picker'"
				 v-model="form[formView.name]"
				 type="datetime"
				 value-format="yyyy-MM-dd HH:ss:mm"
				 placeholder="选择日期时间">
			 </el-date-picker>
				  <!-- <el-button v-if="formView.type=='button'" type="primary" @click.native="buttonOnClick(formView.value)">{{formView.label}}</el-button> -->

			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="upload2" @click="onSubmit">发送</el-button>

			</el-form-item>
		</el-form>
 	</section>
    </template>
<script>
import util from '@/utils/util';
import { sendCommand } from '@/api/api';
export default {


	data() {
			return {
				value1:'',
				form:{},
				formViews:[],
				command:{}
			}
		},
		methods: {
			render(){
					this.form={
						deviceId:this.device.id,
						password:''
					};
					this.command = this.$store.state.user.dict.commandViews[this.id];
					this.formViews = JSON.parse(this.command.view)
			},
		 		onSubmit() {
				 	this.form.id=Number(this.id);
					if(this.formViews.length!=0){
						this.formViews.forEach(formView => {
							if(formView.type=='input-number'){
								this.form[formView.name] =this.form[formView.name].value|this.form[formView.name]
							}
						 });

					}
					sendCommand(this.form).then((res) => {
						this.$message({
							 message: '发送成功',
							 type: 'success'
						 });
						 this.$store.dispatch('setVisblesFlag', [{key:'commandDialog',value:false}]);
					 });

	      },
      buttonOnClick(val){

      }

		},
		mounted() {

		},
		created(){

			this.render();

		},
		watch: {
			'visible': function() {
		    	if(this.visible){
		    		this.render();
		    	}
		    }
		},
		props: ['id','device','visible']
}
</script>
