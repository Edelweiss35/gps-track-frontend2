<template>
	<section>
		<el-dialog  :title="$t('map.user.group.title')" width="40%" :visible="$store.state.user.visibles.groupsDialog" :before-close="handleClose" :lock-scroll="false">
			<el-alert :title="$t('map.user.group.tips')"  type="info"></el-alert><br>
	<el-button size="mini"  @click="handleAddGroup">{{$t('map.user.group.createMainGroup')}}</el-button>
	<el-tree
		ref="tree"
		:data="$store.state.user.groups"
		node-key="id"
		draggable
		:highlight-current='true'
		:default-expand-all="true"
		@node-click="handleNodeClick"
		 @node-drop="handleDrop"
		:render-content="renderContent"
		:props="defaultProps">
	</el-tree>
		</el-dialog>
		<el-dialog
	  :title="$t('map.groupBindFence')"
	  :visible.sync="dialogVisible"
	  width="40%">
		<el-alert
		:title="$t('map.groupBindTitle')"
		type="warning">
	</el-alert><br>
		<el-transfer
       	 :titles="[$t('map.unbind'),$t('map.bind')]"
       	 v-model="bindIds"
       	 :data="geofences"
       	  :props="{
		      key: 'id',
		      label: 'name'
		    }"
       	 @change="handleChange"
       	 ></el-transfer>

	  <span slot="footer" class="dialog-footer">
	    <el-button @click="dialogVisible = false">{{$t('report.cancel')}}</el-button>
	    <el-button type="primary" @click="dialogVisible = false">{{$t('report.confirm')}}</el-button>
	  </span>
	</el-dialog>
</section>
</template>

<script>
	import util from '@/utils/util'
	import { addGroup,updateGroup,deleteGroup,getGeofences,groupBindGeofenceIds,groupUnBindGeofenceIds,getGeofenceIdsByGroupId,moveGroup } from '@/api/api'
	export default {
		name: 'groupTree',

		data() {
			return {
				dialogVisible:false,
				geofences:[],
				bindIds:[],
				groups:[],
				group:{},
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			}
		},
		methods: {
		 handleNodeClick(node){
			 this.$emit('handleNodeClick',node);
		 },
		 handleClose: function() {
			 this.$store.dispatch('setVisblesFlag', [{key:'groupsDialog',value:false}]);
		 },
		 handleAddGroup(){
			 this.$prompt('请输入分组名称', '创建分组', {
           confirmButtonText: this.$t('report.confirm'),
           cancelButtonText: this.$t('report.cancel')
         }).then(({ value }) => {
					 let group = {
						 	name:value,
							groupId:0
					 }
					 addGroup(group).then((data) => {
						 this.$store.dispatch('initGroups');
						//  this.$store.dispatch('initTreeData');
					});
         }).catch(() => {
        //    this.$message({
        //      type: 'info',
        //      message: '取消输入'
        //    });
         });
		 },
		 append(data) {
			this.$prompt('请输入分组名称', '创建分组', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					let group = {
						 name:value,
						 groupId:data.id
					}
					addGroup(group).then((data) => {
						this.$store.dispatch('initGroups');
						// this.$store.dispatch('initTreeData');
				 });
				}).catch(() => {
				});
		 },
		 edit(data) {
			 console.log(data);
			 this.$prompt('请输入分组名称', '修改分组', {
 					confirmButtonText: '确定',
 					cancelButtonText: '取消',
					inputValue:data.name
 				}).then(({ value }) => {
 					let group = {
						 id:data.id,
 						 name:value,
 						 groupId:data.groupId|0
 					}
 					updateGroup(group).then((data) => {
 						this.$store.dispatch('initGroups');
						// this.$store.dispatch('initTreeData');
 				 });
 				}).catch(() => {
 				});
		 },

		 remove(node, data) {
			 this.$confirm('此操作将永久删除该分组, 是否继续?', '删除分组', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					deleteGroup(data.id).then((res) => {
							this.$store.dispatch('initGroups');
							// this.$store.dispatch('initTreeData');
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
					 });

        }).catch(() => {
        });
		 },
		 bind(data) {
			 console.log(data);
			 this.group = data;
			 this.getGeofences();
			 this.dialogVisible=true;
		 },
		 renderContent(h, { node, data, store }) {
			 return (
				 <span class="custom-tree-node">
					 <span><svg-icon icon-class="group" class-name="menu-icon-question blue" /> {node.label}</span>
					 <span>
						 <el-button size="mini" type="text" on-click={ () => this.append(data) }><span class="green">创建</span></el-button>
						 <el-button size="mini" type="text" on-click={ () => this.edit(data) }>编辑</el-button>
						 <el-button size="mini" type="text"  on-click={ () => this.bind(data) }><span class="yellow">绑定围栏</span></el-button>
						 <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }><span class="red">删除</span></el-button>
					 </span>
				 </span>);
		 },
		 getGeofences(){
			 getGeofences().then((data) => {
				 this.geofences = data;
				 this.getGeofenceIdsByGroupId();
			 });
		 },
		 getGeofenceIdsByGroupId(){
			 getGeofenceIdsByGroupId(this.group.id).then((data) => {
				this.bindIds = data;
			});
		},
		 handleChange(value, direction, movedKeys) {
			 	let params = {groupId:this.group.id,geofenceIds:movedKeys}
			   if(direction=='right'){
						groupBindGeofenceIds(params).then((res) => {
								this.$message({
										message: this.$t('map.bindSuccess'),
								});
						});
				 }else if(direction=='left'){
					 groupUnBindGeofenceIds(params).then((res) => {
							 this.$message({
									 message: this.$t('map.unbindSuccess'),
							 });
					 });
				 }
		 },
		 handleDrop(draggingNode, dropNode, dropType, ev) {
			  var targetNode = {}
			 if(dropType=='inner'){
				  targetNode = dropNode.data;

			 }else{
				 if(dropNode.data.groupId){
					  targetNode={id:dropNode.data.groupId,name:''}
				 }else{
					  targetNode={id:0,name:'root'}
				 }
			 }

			 let param = {type:'group',id:draggingNode.data.id,groupId:targetNode.id}
				 moveGroup(param).then((res) => {
					 this.$message({
						 message: '移动成功！',
						 type: 'success'
					 });
					  this.$store.dispatch('initData'); //初始化设备数据
				});



		 },

		},
		mounted(){
		},
		watch: {
			 '$store.state.user.visibles.groupsDialog':function(){
				 if(this.$store.state.user.visibles.groupsDialog){
						this.$store.dispatch('initGroups');
				 }

			},
		},
	}
</script>
 <style>
 .custom-tree-node {
     flex: 1;
     display: flex;
     align-items: center;
     justify-content: space-between;
     font-size: 14px;
     padding-right: 8px;
   }
	 </style>
