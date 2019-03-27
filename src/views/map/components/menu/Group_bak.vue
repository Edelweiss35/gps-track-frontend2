<template>
	<section>
	<el-dialog class="Blue" title="添加分组" width="30%" :visible="this.$store.state.user.visibles.groupAddForm" :before-close="handleClose" :lock-scroll="false">
		<el-form label-width="80px" :model="addForm"  ref="addForm">
			<el-row>
			  <el-col :span="24">
					<el-form-item
					label="分组名称"
					prop="name"
					:rules="[{ required: true, message: '分组名称不能为空'},{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}]">
						<el-input type="text" v-model="addForm.name" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
			  <el-col :span="24">
					<el-form-item label="所属分组">
						<GroupTree @handleNodeClick="handleNodeClick" :currentKey="currentKey"></GroupTree>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" @click.native="addSubmit">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog class="Blue" title="编辑分组" width="30%" :visible="this.$store.state.user.visibles.groupEditForm" :before-close="handleClose" :lock-scroll="false">
		<el-form label-width="80px" :model="editForm"  ref="editForm">
			<el-row>
			  <el-col :span="24">
					<el-form-item
					label="分组名称"

					prop="name"
					:rules="[{ required: true, message: '分组名称不能为空'},{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}]">
						<el-input type="text" v-model="editForm.name" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
			  <el-col :span="24">
					<el-form-item label="所属分组">
						<GroupTree @handleNodeClick="handleNodeClick" :currentKey="currentKey"></GroupTree>
					</el-form-item>


				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" @click.native="editSubmit">确 定</el-button>
		</div>
	</el-dialog>
</section>
</template>

<script>
	import util from '@/utils/util'
	import GroupTree from './GroupTree'; //设备新增
	import { addGroup,updateGroup } from '@/api/api'
	export default {
		name: 'addGroup',
		props: ['group'],
		components: {
			GroupTree
		},
		data() {
			return {
				addForm: {
					name: '',
					groupId: null
				},

				defaultProps: {
					children: 'children',
					label: 'name'
				},
				currentKey:null
			}
		},
		methods: {
			handleClose: function() {
				this.$store.dispatch('setVisblesFlag', [{key:'groupAddForm',value:false},{key:'groupEditForm',value:false}]);
			},
			addSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.addForm.groupId = this.addForm.groupId|0;
						addGroup(this.addForm).then((data) => {
							this.$store.dispatch('setVisblesFlag', [{key:'groupAddForm',value:false}]);
							this.$store.dispatch('initGroups');
							// this.$store.dispatch('initTreeData');
					 });
					}
				});
			},
			editSubmit: function() {
				this.$refs.editForm.validate((valid) => {
					if(valid) {
						if(this.editForm.id ===this.editForm.groupId){
							this.$message({
								message: '所属分组不能是当前分组',
								type: 'error'
							});
							return;
						}
						updateGroup(this.editForm).then((data) => {
							this.$store.dispatch('setVisblesFlag', [{key:'groupEditForm',value:false}]);
							this.$store.dispatch('initGroups');
							// this.$store.dispatch('initTreeData');
					 });
					}
				});
			},
		 handleNodeClick(node){
			 this.addForm.groupId = node.id||0;
			 this.editForm.groupId = node.id||0;
		 }
		},
		mounted(){


		},
		watch: {

			 '$store.state.user.visibles.groupEditForm': function() {
					 if(this.$store.state.user.visibles.groupEditForm){

						  this.currentKey = this.group.groupId;
										 console.log(this.currentKey);
					 }
				 }
		 },
		 computed: {
			 editForm:function(){
				 return this.group;
			 }
		 }
	}
</script>
